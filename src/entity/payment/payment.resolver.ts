import { PaymentCurrency, UserRole } from '@/generated/prisma/client';
import { GraphQLError, GraphQLResolveInfo } from 'graphql';
import {
  Arg,
  Args,
  Authorized,
  Ctx,
  FieldResolver,
  Info,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { Service } from 'typedi';

import { Context } from '@/context';
import { IDInput } from '@/graphql/common.type';

import { ApiKeyService } from '../apiKey/apiKey.service';
import { Merchant } from '../merchant/merchant.entity';
import { MerchantService } from '../merchant/merchant.service';
import { PaymentTransaction } from '../paymentTransaction/paymentTransaction.entity';
import { PaymentTransactionService } from '../paymentTransaction/paymentTransaction.service';

import { CoinMarketCapService } from '@/service/coinMarketCap';
import { AllExchangeRates, Payment, PaymentMethodInfo, TokenPriceInfo } from './payment.entity';
import { PaymentService } from './payment.service';
import { CreatePaymentInput, PaymentQueryArgs, PaymentsResponse } from './payment.type';
import graphqlFields from 'graphql-fields';

@Service()
@Resolver(() => Payment)
export class PaymentResolver {
  constructor(
    private readonly service: PaymentService,
    private readonly apiKeyService: ApiKeyService,
    private readonly merchantService: MerchantService,
    private readonly transactionService: PaymentTransactionService,
    private readonly coinMarketCapService: CoinMarketCapService
  ) {}

  // Public query - Get payment by ID (for payment page)
  @Query(() => Payment, { nullable: true })
  async payment(@Arg('data') data: IDInput): Promise<Payment | null> {
    const payment = await this.service.findById(data.id, true);
    return payment as unknown as Payment | null;
  }

  // API Key authenticated - Create payment
  @Mutation(() => Payment)
  async createPayment(
    @Arg('apiKey') apiKey: string,
    @Arg('data') data: CreatePaymentInput
  ): Promise<Payment> {
    const key = await this.apiKeyService.validatePublicKeyOnly(apiKey);
    if (!key) {
      throw new GraphQLError('Invalid API key');
    }

    const payment = await this.service.create(key.merchantId, data);
    return payment as unknown as Payment;
  }

  // API Key authenticated - Get payment by external ID
  @Query(() => Payment, { nullable: true })
  async paymentByExternalId(
    @Arg('apiKey') apiKey: string,
    @Arg('externalId') externalId: string
  ): Promise<Payment | null> {
    const key = await this.apiKeyService.validatePublicKeyOnly(apiKey);
    if (!key) {
      throw new GraphQLError('Invalid API key');
    }

    const payment = await this.service.findByExternalId(externalId, key.merchantId);
    return payment as unknown as Payment | null;
  }

  // API Key authenticated - List payments
  @Query(() => PaymentsResponse)
  async payments(
    @Arg('apiKey') apiKey: string,
    @Args() query: PaymentQueryArgs,
    @Info() info: GraphQLResolveInfo
  ): Promise<PaymentsResponse> {
    const key = await this.apiKeyService.validatePublicKeyOnly(apiKey);
    if (!key) {
      throw new GraphQLError('Invalid API key');
    }

    const fields = graphqlFields(info);

    const promises: { total?: Promise<number>; payments?: Promise<any[]> } = {};

    query.filter = {
      AND: [
        query.filter,
        {
          merchantId: key.merchantId,
        },
      ].filter(Boolean),
    };

    if ('total' in fields) {
      promises.total = this.service.getPaymentsCount(query);
    }

    if ('payments' in fields) {
      promises.payments = this.service.getPayments(query);
    }

    const result = await Promise.all([promises.total, promises.payments]);

    const response: { total?: number; payments?: Payment[] } = {};

    if (promises.total) {
      response.total = result[0];
    }

    if (promises.payments) {
      response.payments = result[1];
    }

    return response;
  }

  // API Key authenticated - Cancel payment
  @Mutation(() => Payment)
  async cancelPayment(@Arg('apiKey') apiKey: string, @Arg('data') data: IDInput): Promise<Payment> {
    const key = await this.apiKeyService.validatePublicKeyOnly(apiKey);
    if (!key) {
      throw new GraphQLError('Invalid API key');
    }

    const payment = await this.service.cancel(data.id, key.merchantId);
    return payment as unknown as Payment;
  }

  // Merchant authenticated - List own payments
  @Authorized([UserRole.MERCHANT])
  @Query(() => PaymentsResponse)
  async myPayments(
    @Ctx() ctx: Context,
    @Args() query: PaymentQueryArgs,
    @Info() info: GraphQLResolveInfo
  ): Promise<PaymentsResponse> {
    if (!ctx.user?.id) {
      throw new GraphQLError('Not authenticated');
    }

    const fields = graphqlFields(info);

    const promises: { total?: Promise<number>; payments?: Promise<any[]> } = {};

    query.filter = {
      AND: [
        query.filter,
        {
          memberId: ctx.user.id,
        },
      ].filter(Boolean),
    };

    if ('total' in fields) {
      promises.total = this.service.getPaymentsCount(query);
    }

    if ('payments' in fields) {
      promises.payments = this.service.getPayments(query);
    }

    const result = await Promise.all([promises.total, promises.payments]);

    const response: { total?: number; payments?: Payment[] } = {};

    if (promises.total) {
      response.total = result[0];
    }

    if (promises.payments) {
      response.payments = result[1];
    }

    return response;
  }

  // Admin - List all payments
  @Authorized([UserRole.ADMIN])
  @Query(() => PaymentsResponse)
  async adminPayments(
    @Args() query: PaymentQueryArgs,
    @Info() info: GraphQLResolveInfo
  ): Promise<PaymentsResponse> {
    const fields = graphqlFields(info);

    const promises: { total?: Promise<number>; payments?: Promise<any[]> } = {};

    if ('total' in fields) {
      promises.total = this.service.getPaymentsCount(query);
    }

    if ('payments' in fields) {
      promises.payments = this.service.getPayments(query);
    }

    const result = await Promise.all([promises.total, promises.payments]);

    const response: { total?: number; payments?: Payment[] } = {};

    if (promises.total) {
      response.total = result[0];
    }

    if (promises.payments) {
      response.payments = result[1];
    }

    return response;
  }

  // Public - Get supported payment methods
  @Query(() => [PaymentMethodInfo])
  async paymentMethods(
    @Arg('apiKey', { nullable: true }) apiKey?: string
  ): Promise<PaymentMethodInfo[]> {
    let merchantId: string | undefined;

    if (apiKey) {
      const key = await this.apiKeyService.validatePublicKeyOnly(apiKey);
      if (key) {
        merchantId = key.merchantId;
      }
    }

    const methods = await this.service.getSupportedPaymentMethods(merchantId);
    return methods as unknown as PaymentMethodInfo[];
  }

  // Public - Get token price
  @Query(() => TokenPriceInfo)
  async tokenPrice(
    @Arg('currency', () => PaymentCurrency) currency: PaymentCurrency
  ): Promise<TokenPriceInfo> {
    const priceUSD = await this.service.getExchangeRate(currency);
    return {
      currency,
      priceUSD,
      updatedAt: new Date(),
    };
  }

  // Public - Get all exchange rates
  @Query(() => AllExchangeRates)
  async allExchangeRates(): Promise<AllExchangeRates> {
    const prices = await this.coinMarketCapService.getAllPrices();
    const rates = Object.entries(prices).map(([currency, priceUSD]) => ({
      currency,
      priceUSD,
    }));
    return {
      rates,
      updatedAt: new Date(),
    };
  }

  // Field resolvers
  @FieldResolver(() => Merchant, { nullable: true })
  async merchant(@Root() payment: Payment): Promise<Merchant | null> {
    const merchant = await this.merchantService.findById(payment.merchantId);
    return merchant as Merchant;
  }

  @FieldResolver(() => [PaymentTransaction])
  async transactions(@Root() payment: Payment): Promise<PaymentTransaction[]> {
    const transactions = await this.transactionService.findByPayment(payment.id);
    return transactions as PaymentTransaction[];
  }
}
