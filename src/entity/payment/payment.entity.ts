import { PaymentCurrency, PaymentNetwork, PaymentStatus } from '@/generated/prisma/client';
import { GraphQLBigInt } from 'graphql-scalars';
import { Field, Float, ID, Int, ObjectType } from 'type-graphql';

import { BaseEntity } from '@/graphql/baseEntity';

import { Merchant } from '../merchant/merchant.entity';
import { PaymentTransaction } from '../paymentTransaction/paymentTransaction.entity';

@ObjectType()
export class Payment extends BaseEntity {
  @Field(() => ID)
  id!: string;

  @Field({ nullable: true })
  externalId?: string;

  @Field(() => GraphQLBigInt)
  amountRequested!: bigint;

  @Field(() => GraphQLBigInt)
  amountPaid!: bigint;

  @Field(() => GraphQLBigInt, { nullable: true })
  fiatAmount?: bigint;

  @Field({ nullable: true })
  fiatCurrency?: string;

  @Field(() => GraphQLBigInt, { nullable: true })
  exchangeRate?: bigint;

  @Field(() => PaymentNetwork)
  network!: PaymentNetwork;

  @Field(() => PaymentCurrency)
  currency!: PaymentCurrency;

  @Field()
  paymentAddress!: string;

  @Field(() => PaymentStatus)
  status!: PaymentStatus;

  @Field(() => Int)
  requiredConfirmations!: number;

  @Field(() => Int)
  currentConfirmations!: number;

  @Field()
  expiresAt!: Date;

  @Field({ nullable: true })
  detectedAt?: Date;

  @Field({ nullable: true })
  confirmedAt?: Date;

  @Field({ nullable: true })
  completedAt?: Date;

  @Field({ nullable: true })
  customerEmail?: string;

  @Field({ nullable: true })
  customerName?: string;

  @Field({ nullable: true })
  successUrl?: string;

  @Field({ nullable: true })
  cancelUrl?: string;

  @Field()
  merchantId!: string;

  @Field(() => Merchant, { nullable: true })
  merchant?: Merchant;

  @Field(() => [PaymentTransaction], { nullable: true })
  transactions?: PaymentTransaction[];
}

@ObjectType()
export class PaymentMethodInfo {
  @Field(() => PaymentNetwork)
  network!: PaymentNetwork;

  @Field(() => [PaymentCurrency])
  currencies!: PaymentCurrency[];

  @Field()
  enabled!: boolean;
}

@ObjectType()
export class TokenPriceInfo {
  @Field(() => PaymentCurrency)
  currency!: PaymentCurrency;

  @Field(() => Float)
  priceUSD!: number;

  @Field()
  updatedAt!: Date;
}

@ObjectType()
export class ExchangeRateInfo {
  @Field()
  currency!: string;

  @Field(() => Float)
  priceUSD!: number;
}

@ObjectType()
export class AllExchangeRates {
  @Field(() => [ExchangeRateInfo])
  rates!: ExchangeRateInfo[];

  @Field()
  updatedAt!: Date;
}
