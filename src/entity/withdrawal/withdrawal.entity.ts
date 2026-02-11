import {
  PaymentCurrency,
  PaymentNetwork,
  WithdrawalStatus,
} from '@/generated/prisma/client';
import { GraphQLBigInt } from 'graphql-scalars';
import { Field, ID, Int, ObjectType } from 'type-graphql';

import { BaseEntity } from '@/graphql/baseEntity';

import { Merchant } from '../merchant/merchant.entity';
import { Payment } from '../payment/payment.entity';

@ObjectType()
export class Withdrawal extends BaseEntity {
  @Field(() => ID)
  id!: string;

  @Field()
  paymentId!: string;

  @Field()
  merchantId!: string;

  @Field()
  fromAddress!: string;

  @Field()
  toAddress!: string;

  @Field(() => GraphQLBigInt)
  amount!: bigint;

  @Field(() => GraphQLBigInt)
  fee!: bigint;

  @Field(() => PaymentNetwork)
  network!: PaymentNetwork;

  @Field(() => PaymentCurrency)
  currency!: PaymentCurrency;

  @Field({ nullable: true })
  txHash?: string;

  @Field(() => WithdrawalStatus)
  status!: WithdrawalStatus;

  @Field({ nullable: true })
  errorMessage?: string;

  @Field(() => Int)
  attempts!: number;

  @Field()
  isManual!: boolean;

  @Field({ nullable: true })
  broadcastAt?: Date;

  @Field({ nullable: true })
  confirmedAt?: Date;

  // Relations
  @Field(() => Payment, { nullable: true })
  payment?: Payment;

  @Field(() => Merchant, { nullable: true })
  merchant?: Merchant;
}
