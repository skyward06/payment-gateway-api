import { PaymentNetwork, PaymentTransaction, Prisma } from '@prisma/client';
import { Service } from 'typedi';

import { PrismaService } from '@/service/prisma';

@Service()
export class PaymentTransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    paymentId: string;
    txHash: string;
    network?: PaymentNetwork;
    fromAddress?: string;
    toAddress?: string;
    amount: bigint | number;
    confirmations?: number;
    blockNumber?: number;
    blockHash?: string;
  }): Promise<PaymentTransaction> {
    // Get payment to determine network and toAddress
    const payment = await this.prisma.payment.findUnique({
      where: { id: data.paymentId },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    return this.prisma.paymentTransaction.create({
      data: {
        paymentId: data.paymentId,
        txHash: data.txHash,
        network: data.network || payment.network,
        fromAddress: data.fromAddress,
        toAddress: data.toAddress || payment.paymentAddress,
        amount: typeof data.amount === 'bigint' ? data.amount : BigInt(data.amount),
        confirmations: data.confirmations || 0,
        blockNumber: data.blockNumber ? BigInt(data.blockNumber) : null,
        blockHash: data.blockHash,
      },
    });
  }

  async findById(id: string): Promise<PaymentTransaction | null> {
    return this.prisma.paymentTransaction.findUnique({
      where: { id },
    });
  }

  async findByTxHash(txHash: string, network: PaymentNetwork): Promise<PaymentTransaction | null> {
    return this.prisma.paymentTransaction.findUnique({
      where: { txHash_network: { txHash, network } },
    });
  }

  async findByPayment(paymentId: string): Promise<PaymentTransaction[]> {
    return this.prisma.paymentTransaction.findMany({
      where: { paymentId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateConfirmations(
    id: string,
    confirmations: number,
    isConfirmed?: boolean
  ): Promise<PaymentTransaction> {
    const updateData: any = { confirmations };

    if (isConfirmed !== undefined) {
      updateData.isConfirmed = isConfirmed;
      if (isConfirmed) {
        updateData.confirmedAt = new Date();
      }
    }

    return this.prisma.paymentTransaction.update({
      where: { id },
      data: updateData,
    });
  }

  async getTotalAmountForPayment(paymentId: string): Promise<bigint> {
    const result = await this.prisma.paymentTransaction.aggregate({
      where: { paymentId },
      _sum: { amount: true },
    });

    return result._sum.amount ?? BigInt(0);
  }

  async getConfirmedAmountForPayment(paymentId: string): Promise<bigint> {
    const result = await this.prisma.paymentTransaction.aggregate({
      where: { paymentId, isConfirmed: true },
      _sum: { amount: true },
    });

    return result._sum.amount ?? BigInt(0);
  }
}
