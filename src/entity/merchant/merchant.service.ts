import { Merchant, MerchantNetwork, UserRole } from '@/generated/prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { Service } from 'typedi';

import { PrismaService } from '@/service/prisma';

import {
  AddMerchantNetworkInput,
  CreateMerchantInput,
  UpdateMerchantInput,
  UpdateMerchantNetworkInput,
} from './merchant.type';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

type MerchantWithRelations = Merchant & {
  apiKeys?: any[];
  supportedNetworks?: MerchantNetwork[];
};

@Service()
export class MerchantService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<Merchant | null> {
    return this.prisma.merchant.findUnique({
      where: { email },
    });
  }

  async findById(id: string, includeRelations = false): Promise<MerchantWithRelations | null> {
    return this.prisma.merchant.findUnique({
      where: { id },
      include: includeRelations
        ? {
            apiKeys: true,
            supportedNetworks: true,
          }
        : undefined,
    });
  }

  async login(
    email: string,
    password: string
  ): Promise<{ merchant: Merchant; token: string } | null> {
    const merchant = await this.findByEmail(email);
    if (!merchant || !merchant.isActive) {
      return null;
    }

    const isValid = await bcrypt.compare(password, merchant.password);
    if (!isValid) {
      return null;
    }

    const token = jwt.sign(
      { id: merchant.id, email: merchant.email, role: UserRole.MERCHANT },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return { merchant, token };
  }

  async register(data: CreateMerchantInput): Promise<Merchant> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const webhookSecret = crypto.randomBytes(32).toString('hex');

    return this.prisma.merchant.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        website: data.website,
        description: data.description,
        webhookSecret,
      },
    });
  }

  async update(id: string, data: UpdateMerchantInput): Promise<Merchant> {
    return this.prisma.merchant.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Merchant> {
    return this.prisma.merchant.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
  }

  async activate(id: string): Promise<Merchant> {
    return this.prisma.merchant.update({
      where: { id },
      data: { isActive: true },
    });
  }

  async deactivate(id: string): Promise<Merchant> {
    return this.prisma.merchant.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async verify(id: string): Promise<Merchant> {
    return this.prisma.merchant.update({
      where: { id },
      data: { verifiedAt: new Date() },
    });
  }

  async unverify(id: string): Promise<Merchant> {
    return this.prisma.merchant.update({
      where: { id },
      data: { verifiedAt: null },
    });
  }

  async findAll(
    search?: string,
    isActive?: boolean,
    take = 20,
    skip = 0
  ): Promise<{ merchants: Merchant[]; total: number }> {
    const where: any = {
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [merchants, total] = await Promise.all([
      this.prisma.merchant.findMany({
        where,
        take,
        skip,
        orderBy: { createdAt: 'desc' },
        include: { supportedNetworks: true },
      }),
      this.prisma.merchant.count({ where }),
    ]);

    return { merchants, total };
  }

  // Merchant Network methods
  async addNetwork(merchantId: string, data: AddMerchantNetworkInput): Promise<MerchantNetwork> {
    return this.prisma.merchantNetwork.create({
      data: {
        merchantId,
        network: data.network,
        currency: data.currency,
        walletAddress: data.walletAddress,
      },
    });
  }

  async updateNetwork(data: UpdateMerchantNetworkInput): Promise<MerchantNetwork> {
    const updateData: any = {};
    if (data.walletAddress) updateData.walletAddress = data.walletAddress;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    return this.prisma.merchantNetwork.update({
      where: { id: data.id },
      data: updateData,
    });
  }

  async removeNetwork(id: string): Promise<MerchantNetwork> {
    return this.prisma.merchantNetwork.delete({
      where: { id },
    });
  }

  async getNetworks(merchantId: string): Promise<MerchantNetwork[]> {
    return this.prisma.merchantNetwork.findMany({
      where: { merchantId, isActive: true },
    });
  }

  async regenerateWebhookSecret(id: string): Promise<string> {
    const webhookSecret = crypto.randomBytes(32).toString('hex');
    await this.prisma.merchant.update({
      where: { id },
      data: { webhookSecret },
    });
    return webhookSecret;
  }

  verifyToken(token: string): { id: string; email: string; role: UserRole } | null {
    try {
      return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: UserRole };
    } catch {
      return null;
    }
  }
}
