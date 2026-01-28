import { PaymentCurrency, PaymentNetwork, PaymentStatus, Prisma } from '@/generated/prisma/client';
import { QueryArgsBase } from '@/graphql/queryArgs';
import { IsEmail, IsUrl } from 'class-validator';
import { GraphQLBigInt } from 'graphql-scalars';
import GraphQLJSON from 'graphql-type-json';
import { ArgsType, Field, InputType, Int, ObjectType } from 'type-graphql';
import { Payment } from './payment.entity';

/**
 * SMALLEST UNIT CONVENTION:
 *
 * All monetary amounts in this API use SMALLEST UNITS:
 * - USD: cents (1 dollar = 100 cents)
 * - TXC: cros (1 TXC = 100,000,000 cros)
 * - ETH: wei (1 ETH = 10^18 wei)
 * - USDC/USDT: micro (1 USDC = 1,000,000 micro)
 *
 * Exchange rates are in BIG UNITS (e.g., 2.88 USD per 1 TXC)
 */

@InputType()
export class CreatePaymentInput {
  @Field({ nullable: true })
  externalId?: string;

  /**
   * Amount in SMALLEST UNITS:
   * - If fiatCurrency is set: amount in cents (e.g., $10.50 = 1050)
   * - If no fiatCurrency: amount in crypto smallest unit (e.g., cros for TXC)
   */
  @Field(() => GraphQLBigInt)
  amount!: bigint;

  @Field({ nullable: true, defaultValue: 'USD' })
  fiatCurrency?: string;

  @Field(() => PaymentNetwork)
  network!: PaymentNetwork;

  @Field(() => PaymentCurrency)
  currency!: PaymentCurrency;

  @Field({ nullable: true })
  @IsEmail()
  customerEmail?: string;

  @Field({ nullable: true })
  customerName?: string;

  @Field({ nullable: true })
  @IsUrl()
  successUrl?: string;

  @Field({ nullable: true })
  @IsUrl()
  cancelUrl?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  metadata?: Record<string, any>;

  @Field(() => Int, { nullable: true })
  expirationMinutes?: number;
}

@InputType()
export class PaymentWhereInput {
  @Field({ nullable: true })
  merchantId?: string;

  @Field(() => PaymentStatus, { nullable: true })
  status?: PaymentStatus;

  @Field(() => PaymentNetwork, { nullable: true })
  network?: PaymentNetwork;

  @Field(() => PaymentCurrency, { nullable: true })
  currency?: PaymentCurrency;

  @Field({ nullable: true })
  externalId?: string;

  @Field({ nullable: true })
  customerEmail?: string;

  @Field({ nullable: true })
  fromDate?: Date;

  @Field({ nullable: true })
  toDate?: Date;
}

@ArgsType()
export class PaymentQueryArgs extends QueryArgsBase<Prisma.PaymentWhereInput> {}

@ObjectType()
export class PaymentsResponse {
  @Field(() => [Payment])
  payments?: Payment[];

  @Field(() => Number)
  total?: number;
}

@InputType()
export class CheckPaymentInput {
  @Field()
  paymentId!: string;
}
