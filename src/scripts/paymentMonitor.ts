/**
 * Payment Monitor Script
 *
 * This script monitors pending TXC payments using the Mempool API.
 * It detects incoming transactions, tracks confirmations, and updates payment statuses.
 *
 * Run with: npx ts-node src/scripts/paymentMonitor.ts
 */

import 'dotenv/config';
import 'reflect-metadata';

import { PaymentNetwork, PaymentStatus } from '@/generated/prisma/client';
import Container from 'typedi';

import { CHAIN_CONFIG } from '@/consts';
import { PaymentTransactionService } from '@/entity/paymentTransaction/paymentTransaction.service';
import { WebhookService } from '@/entity/webhookLog/webhookLog.service';
import { MempoolService } from '@/service/mempool';
import { PrismaService } from '@/service/prisma';
import { TXCService } from '@/service/txc';
import { croToTxc } from '@/utils/currency';

const POLL_INTERVAL = 10000; // 10 seconds
const WEBHOOK_RETRY_INTERVAL = 30000; // 30 seconds

class PaymentMonitor {
  private prisma: PrismaService;
  private txcService: TXCService;
  private mempoolService: MempoolService;
  private webhookService: WebhookService;
  private transactionService: PaymentTransactionService;
  private isRunning = false;
  private lastWebhookRetry = 0;

  constructor() {
    this.prisma = Container.get(PrismaService);
    this.txcService = Container.get(TXCService);
    this.mempoolService = Container.get(MempoolService);
    this.webhookService = Container.get(WebhookService);
    this.transactionService = Container.get(PaymentTransactionService);
  }

  async start() {
    console.log('🚀 Payment Monitor started');
    console.log('📊 Polling interval: ' + POLL_INTERVAL / 1000 + 's');
    console.log('🔄 Webhook retry interval: ' + WEBHOOK_RETRY_INTERVAL / 1000 + 's');
    console.log('⛓️ Chain configs:', JSON.stringify(CHAIN_CONFIG, null, 2));

    this.isRunning = true;

    while (this.isRunning) {
      try {
        await this.checkPayments();
        await this.expireOldPayments();
        await this.retryWebhooks();
      } catch (error) {
        console.error('Error in payment monitor:', error);
      }

      await this.sleep(POLL_INTERVAL);
    }
  }

  stop() {
    console.log('🛑 Payment Monitor stopping...');
    this.isRunning = false;
  }

  private async retryWebhooks() {
    const now = Date.now();
    if (now - this.lastWebhookRetry < WEBHOOK_RETRY_INTERVAL) {
      return;
    }
    this.lastWebhookRetry = now;

    try {
      const retried = await this.webhookService.retryPendingWebhooks();
      if (retried > 0) {
        console.log('📤 Retried ' + retried + ' failed webhook(s)');
      }
    } catch (error) {
      console.error('Error retrying webhooks:', error);
    }
  }

  private async checkPayments() {
    // Get all pending payments for TXC network
    const pendingPayments = await this.prisma.payment.findMany({
      where: {
        network: PaymentNetwork.TXC,
        status: {
          in: [PaymentStatus.PENDING, PaymentStatus.DETECTED, PaymentStatus.CONFIRMING],
        },
        expiresAt: { gt: new Date() },
      },
      include: { merchant: true, transactions: true },
    });

    if (pendingPayments.length === 0) {
      return;
    }

    console.log('\n📋 Checking ' + pendingPayments.length + ' pending TXC payments...');

    // Get current block height
    const blockHeight = await this.mempoolService.getBlockTip();

    for (const payment of pendingPayments) {
      try {
        await this.checkPayment(payment, blockHeight);
      } catch (error) {
        console.error('Error checking payment ' + payment.id + ':', error);
      }
    }
  }

  private async checkPayment(payment: any, blockHeight: number) {
    // Get transactions for this address from mempool API
    const [confirmedTxs, mempoolTxs] = await Promise.all([
      this.mempoolService.getAddressChainTransactions(payment.paymentAddress),
      this.mempoolService.getAddressMempoolTransactions(payment.paymentAddress),
    ]);

    const allTxs = [...confirmedTxs, ...mempoolTxs];

    if (allTxs.length === 0) {
      return; // No transactions yet
    }

    // Find incoming transactions to this payment address
    let totalReceivedCro = 0;
    let minConfirmations = Infinity;

    for (const tx of allTxs) {
      // Calculate amount received in this transaction
      let amountCro = 0;
      for (const vout of tx.vout) {
        if (vout.scriptpubkey_address === payment.paymentAddress) {
          amountCro += vout.value;
        }
      }

      if (amountCro === 0) continue;

      const amountTxc = croToTxc(amountCro);
      const confirmations = tx.status.confirmed
        ? blockHeight - (tx.status.block_height || blockHeight) + 1
        : 0;

      // Track total and minimum confirmations
      totalReceivedCro += amountCro;
      if (confirmations < minConfirmations) {
        minConfirmations = confirmations;
      }

      // Check if we already have this transaction recorded
      const existingTx = payment.transactions.find((t: any) => t.txHash === tx.txid);

      if (!existingTx) {
        // Record new transaction (amount in cros/smallest unit)
        await this.transactionService.create({
          paymentId: payment.id,
          txHash: tx.txid,
          amount: BigInt(amountCro), // amountCro is already in cros
          confirmations,
          blockHash: tx.status.block_hash || undefined,
          blockNumber: tx.status.block_height || undefined,
        });

        console.log(
          '💰 Payment ' +
            payment.id +
            ': New tx ' +
            tx.txid.slice(0, 16) +
            '... Amount: ' +
            amountTxc +
            ' TXC, Confirmations: ' +
            confirmations
        );
      } else if (existingTx.confirmations !== confirmations) {
        // Update confirmation count
        await this.transactionService.updateConfirmations(existingTx.id, confirmations);
        console.log(
          '🔄 Payment ' +
            payment.id +
            ': Updated tx ' +
            tx.txid.slice(0, 16) +
            '... Confirmations: ' +
            confirmations
        );
      }
    }

    // Compare in cros (smallest unit) - both are BigInt now
    const requiredAmount = payment.amountRequested; // Already BigInt in cros
    const previousStatus = payment.status;

    // Determine new status based on received amount and confirmations
    let newStatus = payment.status;
    let additionalData: any = {};

    if (totalReceivedCro > 0) {
      additionalData.amountPaid = BigInt(totalReceivedCro); // Store in cros
      additionalData.currentConfirmations = minConfirmations === Infinity ? 0 : minConfirmations;

      if (BigInt(totalReceivedCro) >= requiredAmount) {
        // Full payment received
        if (minConfirmations >= payment.requiredConfirmations) {
          newStatus = PaymentStatus.COMPLETED;
          additionalData.completedAt = new Date();
          console.log(
            '✅ Payment ' + payment.id + ': COMPLETED (' + minConfirmations + ' confirmations)'
          );
        } else if (minConfirmations > 0) {
          newStatus = PaymentStatus.CONFIRMING;
          additionalData.confirmedAt = additionalData.confirmedAt || new Date();
          console.log(
            '⏳ Payment ' +
              payment.id +
              ': CONFIRMING (' +
              minConfirmations +
              '/' +
              payment.requiredConfirmations +
              ')'
          );
        } else {
          newStatus = PaymentStatus.DETECTED;
          additionalData.detectedAt = new Date();
          console.log('👀 Payment ' + payment.id + ': DETECTED (unconfirmed)');
        }
      } else if (totalReceivedCro > 0 && minConfirmations >= payment.requiredConfirmations) {
        // Underpaid and confirmed
        newStatus = PaymentStatus.UNDERPAID;
        const receivedTxc = croToTxc(totalReceivedCro);
        const requiredTxc = croToTxc(requiredAmount);
        console.log(
          '⚠️ Payment ' + payment.id + ': UNDERPAID (' + receivedTxc + '/' + requiredTxc + ' TXC)'
        );
      } else {
        // Partial payment, still waiting
        newStatus = PaymentStatus.DETECTED;
        if (previousStatus === PaymentStatus.PENDING) {
          additionalData.detectedAt = new Date();
        }
      }
    }

    // Update payment status if changed
    if (newStatus !== previousStatus || Object.keys(additionalData).length > 0) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: newStatus,
          ...additionalData,
        },
      });

      // Send webhook if status changed
      if (newStatus !== previousStatus) {
        await this.sendWebhook(payment, newStatus, BigInt(totalReceivedCro));
      }
    }
  }

  private async sendWebhook(payment: any, status: PaymentStatus, amountPaidcros: bigint) {
    try {
      await this.webhookService.sendWebhook(
        payment.merchantId,
        payment.id,
        'payment.' + status.toLowerCase(),
        {
          paymentId: payment.id,
          externalId: payment.externalId,
          status,
          amountRequested: payment.amountRequested.toString(), // In cros
          amountPaid: amountPaidcros.toString(), // In cros
          currency: payment.currency,
          network: payment.network,
          paymentAddress: payment.paymentAddress,
        }
      );
    } catch (error) {
      console.error('Failed to send webhook for payment ' + payment.id + ':', error);
    }
  }

  private async expireOldPayments() {
    const result = await this.prisma.payment.updateMany({
      where: {
        status: PaymentStatus.PENDING,
        expiresAt: { lt: new Date() },
      },
      data: { status: PaymentStatus.EXPIRED },
    });

    if (result.count > 0) {
      console.log('⏰ Expired ' + result.count + ' pending payments');
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Start the monitor
const monitor = new PaymentMonitor();

// Handle graceful shutdown
process.on('SIGINT', () => monitor.stop());
process.on('SIGTERM', () => monitor.stop());

monitor.start().catch(console.error);
