import { ApiKey } from '@/generated/prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Service } from 'typedi';

import { PrismaService } from '@/service/prisma';

import { CreateApiKeyInput, UpdateApiKeyInput } from './apiKey.type';

@Service()
export class ApiKeyService {
  constructor(private readonly prisma: PrismaService) {}

  private generatePublicKey(): string {
    const prefix = process.env.NODE_ENV === 'production' ? 'pk_live_' : 'pk_test_';
    return prefix + crypto.randomBytes(24).toString('hex');
  }

  private generateSecretKey(): string {
    const prefix = process.env.NODE_ENV === 'production' ? 'sk_live_' : 'sk_test_';
    return prefix + crypto.randomBytes(32).toString('hex');
  }

  async create(
    merchantId: string,
    data: CreateApiKeyInput
  ): Promise<{ apiKey: ApiKey; secretKey: string }> {
    const publicKey = this.generatePublicKey();
    const secretKey = this.generateSecretKey();
    const secretHash = await bcrypt.hash(secretKey, 10);

    const apiKey = await this.prisma.apiKey.create({
      data: {
        merchantId,
        name: data.name,
        description: data.description,
        publicKey,
        secretHash,
        permissions: data.permissions || ['payments:read', 'payments:create'],
        allowedIPs: data.allowedIPs || [],
        rateLimit: data.rateLimit || 100,
        expiresAt: data.expiresAt,
      },
    });

    return { apiKey, secretKey };
  }

  async findById(id: string): Promise<ApiKey | null> {
    return this.prisma.apiKey.findUnique({
      where: { id },
    });
  }

  async findByPublicKey(publicKey: string): Promise<ApiKey | null> {
    return this.prisma.apiKey.findUnique({
      where: { publicKey },
    });
  }

  async validateApiKey(publicKey: string, secretKey: string): Promise<ApiKey | null> {
    const apiKey = await this.findByPublicKey(publicKey);
    if (!apiKey || !apiKey.isActive) {
      return null;
    }

    // Check expiration
    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      return null;
    }

    // Verify secret
    const isValid = await bcrypt.compare(secretKey, apiKey.secretHash);
    if (!isValid) {
      return null;
    }

    // Update last used
    await this.prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    });

    return apiKey;
  }

  async validatePublicKeyOnly(publicKey: string): Promise<ApiKey | null> {
    const apiKey = await this.findByPublicKey(publicKey);
    if (!apiKey || !apiKey.isActive) {
      return null;
    }

    // Check expiration
    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      return null;
    }

    // Update last used
    await this.prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    });

    return apiKey;
  }

  async update(data: UpdateApiKeyInput): Promise<ApiKey> {
    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.permissions !== undefined) updateData.permissions = data.permissions;
    if (data.allowedIPs !== undefined) updateData.allowedIPs = data.allowedIPs;
    if (data.rateLimit !== undefined) updateData.rateLimit = data.rateLimit;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.expiresAt !== undefined) updateData.expiresAt = data.expiresAt;

    return this.prisma.apiKey.update({
      where: { id: data.id },
      data: updateData,
    });
  }

  async revoke(id: string): Promise<ApiKey> {
    return this.prisma.apiKey.update({
      where: { id },
      data: { isActive: false, deletedAt: new Date() },
    });
  }

  async findByMerchant(
    merchantId: string,
    isActive?: boolean,
    take = 20,
    skip = 0
  ): Promise<{ apiKeys: ApiKey[]; total: number }> {
    const where: any = {
      merchantId,
      deletedAt: null,
    };

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [apiKeys, total] = await Promise.all([
      this.prisma.apiKey.findMany({ where, take, skip, orderBy: { createdAt: 'desc' } }),
      this.prisma.apiKey.count({ where }),
    ]);

    return { apiKeys, total };
  }

  async rotateSecret(id: string): Promise<{ apiKey: ApiKey; secretKey: string }> {
    const secretKey = this.generateSecretKey();
    const secretHash = await bcrypt.hash(secretKey, 10);

    const apiKey = await this.prisma.apiKey.update({
      where: { id },
      data: { secretHash },
    });

    return { apiKey, secretKey };
  }
}
