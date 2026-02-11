import { UserRole } from '@/generated/prisma/client';
import { GraphQLResolveInfo } from 'graphql';
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
import graphqlFields from 'graphql-fields';

import { Context } from '@/context';
import { IDInput } from '@/graphql/common.type';

import { Merchant } from '../merchant/merchant.entity';
import { MerchantService } from '../merchant/merchant.service';
import { Payment } from '../payment/payment.entity';
import { PaymentService } from '../payment/payment.service';

import { Withdrawal } from './withdrawal.entity';
import { WithdrawalService } from './withdrawal.service';
import {
  WithdrawalQueryArgs,
  WithdrawalSummary,
  WithdrawalsResponse,
  WithdrawResult,
} from './withdrawal.type';
import { GraphQLError } from 'graphql';

@Service()
@Resolver(() => Withdrawal)
export class WithdrawalResolver {
  constructor(
    private readonly service: WithdrawalService,
    private readonly merchantService: MerchantService,
    private readonly paymentService: PaymentService
  ) {}

  // Merchant - Get withdrawal by ID
  @Authorized([UserRole.MERCHANT])
  @Query(() => Withdrawal)
  async withdrawal(
    @Ctx() ctx: Context,
    @Arg('data') data: IDInput
  ): Promise<Withdrawal> {
    const withdrawal = await this.service.findById(data.id);
    if (!withdrawal || withdrawal.merchantId !== ctx.user?.id) {
      throw new GraphQLError('Withdrawal not found');
    }
    return withdrawal as unknown as Withdrawal;
  }

  // Merchant - List own withdrawals
  @Authorized([UserRole.MERCHANT])
  @Query(() => WithdrawalsResponse)
  async myWithdrawals(
    @Ctx() ctx: Context,
    @Args() query: WithdrawalQueryArgs,
    @Info() info: GraphQLResolveInfo
  ): Promise<WithdrawalsResponse> {
    if (!ctx.user?.id) {
      throw new GraphQLError('Not authenticated');
    }

    const fields = graphqlFields(info);

    query.filter = {
      AND: [
        query.filter,
        { merchantId: ctx.user.id },
      ].filter(Boolean),
    };

    const promises: { total?: Promise<number>; withdrawals?: Promise<any[]> } = {};

    if ('total' in fields) {
      promises.total = this.service.getCount(query);
    }

    if ('withdrawals' in fields) {
      promises.withdrawals = this.service.findAll(query);
    }

    const result = await Promise.all([promises.total, promises.withdrawals]);

    const response: { total?: number; withdrawals?: Withdrawal[] } = {};

    if (promises.total) {
      response.total = result[0];
    }

    if (promises.withdrawals) {
      response.withdrawals = result[1];
    }

    return response;
  }

  // Merchant - Get withdrawal summary
  @Authorized([UserRole.MERCHANT])
  @Query(() => WithdrawalSummary)
  async withdrawalSummary(@Ctx() ctx: Context): Promise<WithdrawalSummary> {
    if (!ctx.user?.id) {
      throw new GraphQLError('Not authenticated');
    }
    return this.service.getSummary(ctx.user.id);
  }

  // Merchant - Trigger manual withdrawal for all pending payments
  @Authorized([UserRole.MERCHANT])
  @Mutation(() => WithdrawResult)
  async withdrawAll(@Ctx() ctx: Context): Promise<WithdrawResult> {
    if (!ctx.user?.id) {
      throw new GraphQLError('Not authenticated');
    }

    try {
      const result = await this.service.sweepMerchantPayments(ctx.user.id, true);
      return result as WithdrawResult;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Withdrawal failed',
      };
    }
  }

  // Merchant - Trigger manual withdrawal for a specific payment
  @Authorized([UserRole.MERCHANT])
  @Mutation(() => Withdrawal)
  async withdrawPayment(
    @Ctx() ctx: Context,
    @Arg('data') data: IDInput
  ): Promise<Withdrawal> {
    if (!ctx.user?.id) {
      throw new GraphQLError('Not authenticated');
    }

    // Verify the payment belongs to this merchant
    const payment = await this.paymentService.findById(data.id);
    if (!payment || payment.merchantId !== ctx.user.id) {
      throw new GraphQLError('Payment not found');
    }

    const withdrawal = await this.service.sweepPayment(data.id, true);
    return withdrawal as unknown as Withdrawal;
  }

  // Admin - List all withdrawals
  @Authorized([UserRole.ADMIN])
  @Query(() => WithdrawalsResponse)
  async adminWithdrawals(
    @Args() query: WithdrawalQueryArgs,
    @Info() info: GraphQLResolveInfo
  ): Promise<WithdrawalsResponse> {
    const fields = graphqlFields(info);

    const promises: { total?: Promise<number>; withdrawals?: Promise<any[]> } = {};

    if ('total' in fields) {
      promises.total = this.service.getCount(query);
    }

    if ('withdrawals' in fields) {
      promises.withdrawals = this.service.findAll(query);
    }

    const result = await Promise.all([promises.total, promises.withdrawals]);

    const response: { total?: number; withdrawals?: Withdrawal[] } = {};

    if (promises.total) {
      response.total = result[0];
    }

    if (promises.withdrawals) {
      response.withdrawals = result[1];
    }

    return response;
  }

  // Field resolvers
  @FieldResolver(() => Payment, { nullable: true })
  async payment(@Root() withdrawal: Withdrawal): Promise<Payment | null> {
    const payment = await this.paymentService.findById(withdrawal.paymentId);
    return payment as Payment | null;
  }

  @FieldResolver(() => Merchant, { nullable: true })
  async merchant(@Root() withdrawal: Withdrawal): Promise<Merchant | null> {
    const merchant = await this.merchantService.findById(withdrawal.merchantId);
    return merchant as Merchant | null;
  }
}
