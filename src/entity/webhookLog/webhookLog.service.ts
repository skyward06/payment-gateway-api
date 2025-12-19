import { Prisma, WebhookLog } from '@/generated/prisma/client';
import axios from 'axios';
import crypto from 'crypto';
import { Service } from 'typedi';

import { PrismaService } from '@/service/prisma';

interface WebhookPayload {
  event: string;
  data: Record<string, unknown>;
  timestamp: number;
}

const MAX_RETRY_ATTEMPTS = 5;
const RETRY_DELAYS = [60, 300, 900, 3600, 14400]; // 1min, 5min, 15min, 1hr, 4hr

@Service()
export class WebhookService {
  constructor(private readonly prisma: PrismaService) {}

  async sendWebhook(
    merchantId: string,
    paymentId: string | null,
    event: string,
    data: any
  ): Promise<WebhookLog | null> {
    // Get merchant webhook config
    const merchant = await this.prisma.merchant.findUnique({
      where: { id: merchantId },
      select: { webhookUrl: true, webhookSecret: true },
    });

    if (!merchant?.webhookUrl) {
      return null;
    }

    const payload: WebhookPayload = {
      event,
      data,
      timestamp: Date.now(),
    };

    // Create signature
    const signature = this.createSignature(payload, merchant.webhookSecret || '');

    // Create log entry
    const log = await this.prisma.webhookLog.create({
      data: {
        merchantId,
        paymentId,
        event,
        payload: payload as unknown as Prisma.InputJsonValue,
        url: merchant.webhookUrl,
      },
    });

    // Attempt delivery
    await this.deliverWebhook(log.id, merchant.webhookUrl, payload, signature);

    return log;
  }

  private createSignature(payload: WebhookPayload, secret: string): string {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(JSON.stringify(payload));
    return hmac.digest('hex');
  }

  private async deliverWebhook(
    logId: string,
    url: string,
    payload: WebhookPayload,
    signature: string
  ): Promise<void> {
    try {
      const response = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature,
          'X-Webhook-Timestamp': payload.timestamp.toString(),
        },
        timeout: 30000, // 30 second timeout
      });

      await this.prisma.webhookLog.update({
        where: { id: logId },
        data: {
          httpStatus: response.status,
          response: JSON.stringify(response.data).substring(0, 1000),
          isDelivered: true,
        },
      });
    } catch (error: any) {
      const httpStatus = error.response?.status || 0;
      const response = error.message || 'Unknown error';

      const log = await this.prisma.webhookLog.findUnique({
        where: { id: logId },
      });

      if (!log) return;

      const nextAttempt = log.attempts;
      const nextRetryAt =
        nextAttempt < MAX_RETRY_ATTEMPTS
          ? new Date(Date.now() + RETRY_DELAYS[nextAttempt] * 1000)
          : null;

      await this.prisma.webhookLog.update({
        where: { id: logId },
        data: {
          httpStatus,
          response: response.substring(0, 1000),
          attempts: log.attempts + 1,
          nextRetryAt,
        },
      });
    }
  }

  async retryPendingWebhooks(): Promise<number> {
    const pendingLogs = await this.prisma.webhookLog.findMany({
      where: {
        isDelivered: false,
        attempts: { lt: MAX_RETRY_ATTEMPTS },
        nextRetryAt: { lte: new Date() },
      },
      include: {
        merchant: {
          select: { webhookUrl: true, webhookSecret: true },
        },
      },
      take: 100,
    });

    let retried = 0;

    for (const log of pendingLogs) {
      if (!log.merchant?.webhookUrl) continue;

      const payload = log.payload as unknown as WebhookPayload;
      const signature = this.createSignature(payload, log.merchant.webhookSecret || '');

      await this.deliverWebhook(log.id, log.merchant.webhookUrl, payload, signature);
      retried++;
    }

    return retried;
  }

  async getLogsByPayment(paymentId: string): Promise<WebhookLog[]> {
    return this.prisma.webhookLog.findMany({
      where: { paymentId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getLogsByMerchant(
    merchantId: string,
    take = 20,
    skip = 0
  ): Promise<{ logs: WebhookLog[]; total: number }> {
    const where = { merchantId };

    const [logs, total] = await Promise.all([
      this.prisma.webhookLog.findMany({
        where,
        take,
        skip,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.webhookLog.count({ where }),
    ]);

    return { logs, total };
  }
}
