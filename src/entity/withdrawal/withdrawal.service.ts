import {
  PaymentNetwork,
  PaymentStatus,
  WithdrawalStatus,
} from '@/generated/prisma/client';
import { Service } from 'typedi';

import { PrismaService } from '@/service/prisma';
import { TXCService } from '@/service/txc';
import { croToTxc } from '@/utils/currency';

import { WithdrawalQueryArgs, WithdrawalSummary } from './withdrawal.type';

@Service()
export class WithdrawalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly txcService: TXCService
  ) {}

  async findById(id: string) {
    return this.prisma.withdrawal.findUnique({
      where: { id },
      include: { payment: true, merchant: true },
    });
  }

  async findAll(params: WithdrawalQueryArgs) {
    return this.prisma.withdrawal.findMany({
      where: params.where,
      orderBy: params.orderBy,
      ...params.parsePage,
    });
  }

  async getCount({ where }: Pick<WithdrawalQueryArgs, 'where'>) {
    return this.prisma.withdrawal.count({ where });
  }

  async getSummary(merchantId: string): Promise<WithdrawalSummary> {
    const [confirmed, pending] = await Promise.all([
      this.prisma.withdrawal.aggregate({
        where: { merchantId, status: WithdrawalStatus.CONFIRMED },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.withdrawal.aggregate({
        where: {
          merchantId,
          status: { in: [WithdrawalStatus.PENDING, WithdrawalStatus.PROCESSING, WithdrawalStatus.BROADCAST] },
        },
        _sum: { amount: true },
        _count: true,
      }),
    ]);

    return {
      totalWithdrawn: confirmed._sum.amount ?? 0n,
      pendingAmount: pending._sum.amount ?? 0n,
      totalCount: confirmed._count,
      pendingCount: pending._count,
    };
  }

  /**
   * Get all completed payments that have not been withdrawn yet for a merchant.
   */
  async getWithdrawablePayments(merchantId: string) {
    return this.prisma.payment.findMany({
      where: {
        merchantId,
        network: PaymentNetwork.TXC,
        status: { in: [PaymentStatus.COMPLETED, PaymentStatus.OVERPAID] },
        isWithdrawn: false,
        paymentAddressPrivateKey: { not: null },
      },
      include: {
        merchant: {
          include: { supportedNetworks: true },
        },
      },
    });
  }

  /**
   * Get all completed payments across all merchants that have not been withdrawn.
   * Used by the auto-sweep scheduler.
   */
  async getAllWithdrawablePayments() {
    return this.prisma.payment.findMany({
      where: {
        network: PaymentNetwork.TXC,
        status: { in: [PaymentStatus.COMPLETED, PaymentStatus.OVERPAID] },
        isWithdrawn: false,
        paymentAddressPrivateKey: { not: null },
      },
      include: {
        merchant: {
          include: { supportedNetworks: true },
        },
      },
    });
  }

  /**
   * Sweep funds from a single payment address to the merchant's TXC wallet.
   * @param paymentId - The payment to sweep
   * @param isManual - Whether this was triggered manually by the merchant
   * @returns The created withdrawal record
   */
  async sweepPayment(paymentId: string, isManual: boolean = false) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        merchant: {
          include: { supportedNetworks: true },
        },
      },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.isWithdrawn) {
      throw new Error('Payment has already been withdrawn');
    }

    if (!payment.paymentAddressPrivateKey) {
      throw new Error('Payment private key not available');
    }

    if (payment.status !== PaymentStatus.COMPLETED && payment.status !== PaymentStatus.OVERPAID) {
      throw new Error(`Payment is not in a withdrawable status (current: ${payment.status})`);
    }

    // Find merchant's TXC wallet address
    const txcNetwork = payment.merchant.supportedNetworks.find(
      (n) => n.network === PaymentNetwork.TXC && n.isActive
    );

    if (!txcNetwork) {
      throw new Error('Merchant has no active TXC network configured');
    }

    const toAddress = txcNetwork.walletAddress;

    // Create withdrawal record as PROCESSING
    const withdrawal = await this.prisma.withdrawal.create({
      data: {
        paymentId: payment.id,
        merchantId: payment.merchantId,
        fromAddress: payment.paymentAddress,
        toAddress,
        amount: 0n, // Will be updated after building tx
        fee: 0n,
        network: payment.network,
        currency: payment.currency,
        status: WithdrawalStatus.PROCESSING,
        isManual,
        attempts: 1,
      },
    });

    try {
      // Build and sign sweep transaction
      const addressType = this.txcService.getAddressType(payment.paymentAddress);
      if (!addressType) {
        throw new Error('Invalid payment address type');
      }
      
      const sweepResult = await this.txcService.makeSweepTransaction(
        {
          addressType,
          feeRate: 10,
          toAddress,
          senderPrivKey: payment.paymentAddressPrivateKey,
        }
      );


      // Broadcast the transaction
      const txid = await this.txcService.broadcastTransaction(sweepResult.txHex);

      // Update withdrawal with transaction details
      const updatedWithdrawal = await this.prisma.withdrawal.update({
        where: { id: withdrawal.id },
        data: {
          txHash: txid,
          amount: sweepResult.amountSent,
          fee: sweepResult.fee,
          status: WithdrawalStatus.BROADCAST,
          broadcastAt: new Date(),
        },
      });

      // Mark payment as withdrawn
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          isWithdrawn: true,
          withdrawnAt: new Date(),
        },
      });

      console.log(
        `✅ Withdrawal ${withdrawal.id}: Swept ${croToTxc(sweepResult.amountSent)} TXC from ${payment.paymentAddress} to ${toAddress} (tx: ${txid.slice(0, 16)}...)`
      );

      return updatedWithdrawal;
    } catch (error: any) {
      // Update withdrawal as failed
      await this.prisma.withdrawal.update({
        where: { id: withdrawal.id },
        data: {
          status: WithdrawalStatus.FAILED,
          errorMessage: error.message || 'Unknown error',
        },
      });

      console.error(
        `❌ Withdrawal ${withdrawal.id} failed for payment ${payment.id}:`,
        error.message
      );

      throw error;
    }
  }

  /**
   * Sweep all withdrawable payments for a specific merchant.
   * @param merchantId - The merchant whose payments to sweep
   * @param isManual - Whether this was triggered manually
   * @returns Array of withdrawal results
   */
  async sweepMerchantPayments(merchantId: string, isManual: boolean = false) {
    const payments = await this.getWithdrawablePayments(merchantId);

    if (payments.length === 0) {
      return { success: true, message: 'No payments to withdraw', withdrawals: [], count: 0, totalAmount: '0' };
    }

    const results: any[] = [];
    let totalSwept = 0n;
    let successCount = 0;
    let failCount = 0;

    for (const payment of payments) {
      try {
        const withdrawal = await this.sweepPayment(payment.id, isManual);
        results.push(withdrawal);
        totalSwept += withdrawal.amount;
        successCount++;
      } catch (error: any) {
        failCount++;
        console.error(
          `Failed to sweep payment ${payment.id}:`,
          error.message
        );
      }
    }

    return {
      success: failCount === 0,
      message: `Swept ${successCount} payment(s)${failCount > 0 ? `, ${failCount} failed` : ''}`,
      withdrawals: results,
      count: successCount,
      totalAmount: croToTxc(totalSwept).toString(),
    };
  }

  /**
   * Sweep all withdrawable payments across all merchants.
   * Used by the auto-sweep scheduler.
   */
  async sweepAllPayments() {
    const payments = await this.getAllWithdrawablePayments();

    if (payments.length === 0) {
      return { success: true, message: 'No payments to withdraw', count: 0 };
    }

    console.log(`🔄 Auto-sweep: Found ${payments.length} withdrawable payment(s)`);

    let successCount = 0;
    let failCount = 0;

    for (const payment of payments) {
      try {
        await this.sweepPayment(payment.id, false);
        successCount++;
      } catch (error: any) {
        failCount++;
        // Don't throw - continue with next payment
      }
    }

    console.log(
      `📊 Auto-sweep complete: ${successCount} succeeded, ${failCount} failed out of ${payments.length} total`
    );

    return {
      success: failCount === 0,
      message: `Auto-sweep: ${successCount} succeeded, ${failCount} failed`,
      count: successCount,
    };
  }

  /**
   * Confirm withdrawals that have been broadcast.
   * Called by the sweep scheduler to update withdrawal statuses.
   */
  async confirmBroadcastWithdrawals() {
    const pendingWithdrawals = await this.prisma.withdrawal.findMany({
      where: {
        status: WithdrawalStatus.BROADCAST,
        txHash: { not: null },
      },
    });

    if (pendingWithdrawals.length === 0) return 0;

    let confirmedCount = 0;

    for (const withdrawal of pendingWithdrawals) {
      try {
        const tx = await this.txcService.getTransaction(withdrawal.txHash!);

        if (tx.status.confirmed) {
          await this.prisma.withdrawal.update({
            where: { id: withdrawal.id },
            data: {
              status: WithdrawalStatus.CONFIRMED,
              confirmedAt: new Date(),
            },
          });
          confirmedCount++;
          console.log(`✅ Withdrawal ${withdrawal.id} confirmed (tx: ${withdrawal.txHash!.slice(0, 16)}...)`);
        }
      } catch (error: any) {
        console.error(
          `Error checking withdrawal ${withdrawal.id}:`,
          error.message
        );
      }
    }

    return confirmedCount;
  }
}
