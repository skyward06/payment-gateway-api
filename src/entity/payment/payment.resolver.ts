import { PaymentCurrency, UserRole } from '@prisma/client';
import { GraphQLError } from 'graphql';
import {
  Arg,
  Args,
  Authorized,
  Ctx,
  Field,
  FieldResolver,
  Mutation,
  ObjectType,
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

import { Payment, PaymentMethodInfo, TokenPriceInfo } from './payment.entity';
import { PaymentService } from './payment.service';
import { CreatePaymentInput, PaymentQueryArgs } from './payment.type';

@ObjectType()
class PaymentListResponse {
  @Field(() => [Payment])
  payments!: Payment[];

  @Field()
  total!: number;
}

@Service()
@Resolver(() => Payment)
export class PaymentResolver {
  constructor(
    private readonly service: PaymentService,
    private readonly apiKeyService: ApiKeyService,
    private readonly merchantService: MerchantService,
    private readonly transactionService: PaymentTransactionService
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
  @Query(() => PaymentListResponse)
  async payments(
    @Arg('apiKey') apiKey: string,
    @Args() args: PaymentQueryArgs
  ): Promise<PaymentListResponse> {
    const key = await this.apiKeyService.validatePublicKeyOnly(apiKey);
    if (!key) {
      throw new GraphQLError('Invalid API key');
    }

    const where = { ...args.where, merchantId: key.merchantId };
    const result = await this.service.findAll(where, args.take, args.skip);
    return result as unknown as PaymentListResponse;
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
  @Query(() => PaymentListResponse)
  async myPayments(
    @Ctx() ctx: Context,
    @Args() args: PaymentQueryArgs
  ): Promise<PaymentListResponse> {
    if (!ctx.user?.id) {
      throw new GraphQLError('Not authenticated');
    }

    const where = { ...args.where, merchantId: ctx.user.id };
    const result = await this.service.findAll(where, args.take, args.skip);
    return result as unknown as PaymentListResponse;
  }

  // Admin - List all payments
  @Authorized([UserRole.ADMIN])
  @Query(() => PaymentListResponse)
  async adminPayments(@Args() args: PaymentQueryArgs): Promise<PaymentListResponse> {
    const result = await this.service.findAll(args.where, args.take, args.skip);
    return result as unknown as PaymentListResponse;
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

  // Field resolvers
  @FieldResolver(() => Merchant, { nullable: true })
  async merchant(@Root() payment: Payment): Promise<Merchant | null> {
    const merchant = await this.merchantService.findById(payment.merchantId);
    return merchant as unknown as Merchant | null;
  }

  @FieldResolver(() => [PaymentTransaction])
  async transactions(@Root() payment: Payment): Promise<PaymentTransaction[]> {
    const transactions = await this.transactionService.findByPayment(payment.id);
    return transactions as unknown as PaymentTransaction[];
  }
}
