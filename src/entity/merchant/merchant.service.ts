import { Merchant, MerchantNetwork, PaymentNetwork, UserRole } from '@/generated/prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { Service } from 'typedi';

import { ENV } from '@/consts';
import { PrismaService } from '@/service/prisma';
import { TXCService } from '@/service/txc';

import {
  AddMerchantNetworkInput,
  CreateMerchantInput,
  MerchantQueryArgs,
  UpdateMerchantInput,
  UpdateMerchantNetworkInput,
} from './merchant.type';

const JWT_SECRET = ENV.JWT_SECRET;
const JWT_EXPIRES_IN = ENV.JWT_EXPIRES_IN;

type MerchantWithRelations = Merchant & {
  apiKeys?: any[];
  supportedNetworks?: MerchantNetwork[];
};

@Service()
export class MerchantService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly txcService: TXCService
  ) {}

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

  // Merchant Network methods
  private validateWalletAddress(network: PaymentNetwork, walletAddress: string): void {
    switch (network) {
      case PaymentNetwork.TXC:
        if (!this.txcService.isValidAddress(walletAddress)) {
          throw new Error(
            'Invalid TXC wallet address. Address must start with "txc1" (bech32) or "T" (legacy).'
          );
        }
        break;
      case PaymentNetwork.ETH:
      case PaymentNetwork.BASE:
      case PaymentNetwork.BSC:
      case PaymentNetwork.POLYGON:
        if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
          throw new Error(
            'Invalid EVM wallet address. Address must be a valid 0x-prefixed hex address.'
          );
        }
        break;
      default:
        throw new Error(`Unsupported network: ${network}`);
    }
  }

  async addNetwork(merchantId: string, data: AddMerchantNetworkInput): Promise<MerchantNetwork> {
    this.validateWalletAddress(data.network, data.walletAddress);
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
    if (data.walletAddress) {
      // Look up the existing network to get its type for validation
      const existing = await this.prisma.merchantNetwork.findUnique({
        where: { id: data.id },
      });
      if (!existing) {
        throw new Error('Network not found');
      }
      this.validateWalletAddress(existing.network, data.walletAddress);
      updateData.walletAddress = data.walletAddress;
    }
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
      where: { merchantId },
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

  async findAll(params: MerchantQueryArgs) {
    return this.prisma.merchant.findMany({
      where: params.where,
      orderBy: params.orderBy,
      ...params.parsePage,
    });
  }

  async getCount({ where }: Pick<MerchantQueryArgs, 'where'>): Promise<number> {
    return this.prisma.merchant.count({ where });
  }

  verifyToken(token: string): { id: string; email: string; role: UserRole } | null {
    try {
      return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: UserRole };
    } catch {
      return null;
    }
  }
}
