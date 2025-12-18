import { Payment, PaymentCurrency, PaymentNetwork, PaymentStatus, Prisma } from '@prisma/client';
import { Service } from 'typedi';

import { CHAIN_CONFIG } from '@/consts';
import { PrismaService } from '@/service/prisma';
import { TXCService, AddressType } from '@/service/txc';
import { croToTxc } from '@/utils/currency';

import { CreatePaymentInput, PaymentWhereInput } from './payment.type';
import { CoinMarketCapService } from '@/service/coinMarketCap';

type PaymentWithRelations = Payment & {
  merchant?: any;
  transactions?: any[];
};

@Service()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly txcService: TXCService,
    private readonly coinMarketCapService: CoinMarketCapService
  ) {}

  async create(merchantId: string, data: CreatePaymentInput): Promise<Payment> {
    // Get merchant settings
    const merchant = await this.prisma.merchant.findUnique({
      where: { id: merchantId },
      include: { supportedNetworks: true },
    });

    if (!merchant) {
      throw new Error('Merchant not found');
    }

    // Check if network/currency is supported by merchant
    const supportedNetwork = merchant.supportedNetworks.find(
      (n) => n.network === data.network && n.currency === data.currency && n.isActive
    );

    if (!supportedNetwork) {
      throw new Error(`Network ${data.network} with currency ${data.currency} is not supported`);
    }

    // Generate payment address with private key
    const { address, privateKey } = await this.generatePaymentAddress(data.network, data.currency);

    // Amount is expected in smallest unit (cros for TXC)
    // If fiat amount provided, convert using exchange rate
    let amountRequested = BigInt(data.amount);
    let exchangeRate: bigint | null = null;
    let fiatAmount: bigint | null = null;

    if (data.fiatCurrency && data.fiatCurrency !== data.currency) {
      // Rate is stored as rate * 10^8 for precision
      const rate = await this.getExchangeRate(data.currency);
      exchangeRate = BigInt(Math.round(rate * 1e8));
      fiatAmount = amountRequested; // fiatAmount in cents
      // Convert: amountRequested = fiatAmount * 10^8 / exchangeRate
      amountRequested = (fiatAmount * BigInt(1e8)) / exchangeRate;
    }

    // Calculate expiration based on chain config or merchant override
    const chainConfig = CHAIN_CONFIG[data.network];
    const expirationMinutes =
      data.expirationMinutes || merchant.defaultExpirationMinutes || chainConfig.expirationMinutes;
    const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);
    const requiredConfirmations = merchant.autoConfirmations || chainConfig.confirmationsRequired;

    return this.prisma.payment.create({
      data: {
        merchantId,
        externalId: data.externalId,
        amountRequested,
        fiatAmount,
        fiatCurrency: data.fiatCurrency,
        exchangeRate,
        network: data.network,
        currency: data.currency,
        paymentAddress: address,
        paymentAddressPrivateKey: privateKey, // Store encrypted in production
        expiresAt,
        customerEmail: data.customerEmail,
        customerName: data.customerName,
        successUrl: data.successUrl,
        cancelUrl: data.cancelUrl,
        metadata: data.metadata || undefined,
        requiredConfirmations,
      },
    });
  }

  async findById(id: string, includeRelations = false): Promise<PaymentWithRelations | null> {
    return this.prisma.payment.findUnique({
      where: { id },
      include: includeRelations
        ? {
            merchant: true,
            transactions: true,
          }
        : undefined,
    });
  }

  async findByAddress(paymentAddress: string): Promise<Payment | null> {
    return this.prisma.payment.findFirst({
      where: { paymentAddress },
    });
  }

  async findByExternalId(externalId: string, merchantId: string): Promise<Payment | null> {
    return this.prisma.payment.findFirst({
      where: { externalId, merchantId },
    });
  }

  async findAll(
    where: PaymentWhereInput = {},
    take = 20,
    skip = 0
  ): Promise<{ payments: PaymentWithRelations[]; total: number }> {
    const prismaWhere: any = {
      deletedAt: null,
    };

    if (where.merchantId) prismaWhere.merchantId = where.merchantId;
    if (where.status) prismaWhere.status = where.status;
    if (where.network) prismaWhere.network = where.network;
    if (where.currency) prismaWhere.currency = where.currency;
    if (where.externalId) prismaWhere.externalId = where.externalId;
    if (where.customerEmail)
      prismaWhere.customerEmail = { contains: where.customerEmail, mode: 'insensitive' };

    if (where.fromDate || where.toDate) {
      prismaWhere.createdAt = {};
      if (where.fromDate) prismaWhere.createdAt.gte = where.fromDate;
      if (where.toDate) prismaWhere.createdAt.lte = where.toDate;
    }

    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where: prismaWhere,
        take,
        skip,
        orderBy: { createdAt: 'desc' },
        include: { transactions: true },
      }),
      this.prisma.payment.count({ where: prismaWhere }),
    ]);

    return { payments, total };
  }

  async updateStatus(
    id: string,
    status: PaymentStatus,
    additionalData: Partial<Payment> = {}
  ): Promise<Payment> {
    const updateData: any = { status, ...additionalData };

    if (status === PaymentStatus.DETECTED && !additionalData.detectedAt) {
      updateData.detectedAt = new Date();
    }
    if (status === PaymentStatus.COMPLETED && !additionalData.completedAt) {
      updateData.completedAt = new Date();
    }
    if (
      (status === PaymentStatus.CONFIRMING || status === PaymentStatus.COMPLETED) &&
      !additionalData.confirmedAt
    ) {
      updateData.confirmedAt = new Date();
    }

    return this.prisma.payment.update({
      where: { id },
      data: updateData,
    });
  }

  async cancel(id: string, merchantId: string): Promise<Payment> {
    const payment = await this.findById(id);
    if (!payment) {
      throw new Error('Payment not found');
    }
    if (payment.merchantId !== merchantId) {
      throw new Error('Unauthorized');
    }
    if (payment.status !== PaymentStatus.PENDING) {
      throw new Error('Only pending payments can be cancelled');
    }

    return this.updateStatus(id, PaymentStatus.CANCELLED);
  }

  async expirePendingPayments(): Promise<number> {
    const result = await this.prisma.payment.updateMany({
      where: {
        status: PaymentStatus.PENDING,
        expiresAt: { lt: new Date() },
      },
      data: { status: PaymentStatus.EXPIRED },
    });

    return result.count;
  }

  private async generatePaymentAddress(
    network: PaymentNetwork,
    _currency: PaymentCurrency
  ): Promise<{ address: string; privateKey: string }> {
    if (network === PaymentNetwork.TXC) {
      // Generate new TXC address locally using BECH32 (native segwit)
      return this.txcService.generateNewAddress(AddressType.BECH32);
    }

    // For EVM chains, we'll implement later
    throw new Error(`Address generation for ${network} not yet implemented`);
  }

  async getExchangeRate(currency: PaymentCurrency): Promise<number> {
    // TODO: Implement real price fetching from exchange APIs
    const prices: Record<PaymentCurrency, number> = {
      [PaymentCurrency.TXC]: await this.coinMarketCapService.getLatestTXCPrice(),
      [PaymentCurrency.ETH]: await this.coinMarketCapService.getLatestETHPrice(),
      [PaymentCurrency.USDC]: await this.coinMarketCapService.getLatestUSDCPrice(),
      [PaymentCurrency.USDT]: await this.coinMarketCapService.getLatestUSDTPrice(),
    };

    return prices[currency] || 1;
  }

  async getPendingPayments(): Promise<Payment[]> {
    return this.prisma.payment.findMany({
      where: {
        status: {
          in: [PaymentStatus.PENDING, PaymentStatus.DETECTED, PaymentStatus.CONFIRMING],
        },
        expiresAt: { gt: new Date() },
      },
      include: { merchant: true },
    });
  }

  // Check payment address for incoming transactions using Mempool API
  async checkPaymentAddress(payment: Payment): Promise<{
    balance: { confirmed: number; unconfirmed: number; total: number };
    transactions: Array<{
      txid: string;
      amount: number;
      confirmations: number;
      confirmed: boolean;
    }>;
  }> {
    if (payment.network !== PaymentNetwork.TXC) {
      throw new Error('Only TXC network is supported');
    }

    const balance = await this.txcService.getAddressBalance(payment.paymentAddress);
    const txs = await this.txcService.getAddressChainTransactions(payment.paymentAddress);
    const blockHeight = await this.txcService.getBlockHeight();

    // Find incoming transactions to this address
    const incomingTxs = txs
      .map((tx) => {
        let amount = 0;
        for (const vout of tx.vout) {
          if (vout.scriptpubkey_address === payment.paymentAddress) {
            amount += vout.value;
          }
        }

        const confirmations = tx.status.confirmed
          ? blockHeight - (tx.status.block_height || blockHeight) + 1
          : 0;

        return {
          txid: tx.txid,
          amount: croToTxc(amount), // Convert from cro to TXC
          confirmations,
          confirmed: tx.status.confirmed,
        };
      })
      .filter((tx) => tx.amount > 0);

    return {
      balance: {
        confirmed: croToTxc(balance.confirmed),
        unconfirmed: croToTxc(balance.unconfirmed),
        total: croToTxc(balance.total),
      },
      transactions: incomingTxs,
    };
  }

  async getSupportedPaymentMethods(
    merchantId?: string
  ): Promise<Array<{ network: PaymentNetwork; currencies: PaymentCurrency[]; enabled: boolean }>> {
    if (merchantId) {
      const networks = await this.prisma.merchantNetwork.findMany({
        where: { merchantId, isActive: true },
      });

      const grouped = networks.reduce(
        (acc, n) => {
          if (!acc[n.network]) {
            acc[n.network] = [];
          }
          acc[n.network].push(n.currency);
          return acc;
        },
        {} as Record<PaymentNetwork, PaymentCurrency[]>
      );

      return Object.entries(grouped).map(([network, currencies]) => ({
        network: network as PaymentNetwork,
        currencies,
        enabled: true,
      }));
    }

    // Return all possible payment methods
    return [
      { network: PaymentNetwork.TXC, currencies: [PaymentCurrency.TXC], enabled: true },
      {
        network: PaymentNetwork.ETH,
        currencies: [PaymentCurrency.ETH, PaymentCurrency.USDC, PaymentCurrency.USDT],
        enabled: false,
      },
      {
        network: PaymentNetwork.BASE,
        currencies: [PaymentCurrency.ETH, PaymentCurrency.USDC],
        enabled: false,
      },
    ];
  }
}
