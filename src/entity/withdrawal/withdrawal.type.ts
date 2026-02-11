import {
  PaymentCurrency,
  PaymentNetwork,
  Prisma,
  WithdrawalStatus,
} from '@/generated/prisma/client';
import { PaginatedResponse } from '@/graphql/paginatedResponse';
import { QueryArgsBase } from '@/graphql/queryArgs';
import { GraphQLBigInt } from 'graphql-scalars';
import { ArgsType, Field, InputType, ObjectType } from 'type-graphql';

import { Withdrawal } from './withdrawal.entity';

@InputType()
export class WithdrawalWhereInput {
  @Field({ nullable: true })
  merchantId?: string;

  @Field(() => WithdrawalStatus, { nullable: true })
  status?: WithdrawalStatus;

  @Field(() => PaymentNetwork, { nullable: true })
  network?: PaymentNetwork;

  @Field(() => PaymentCurrency, { nullable: true })
  currency?: PaymentCurrency;

  @Field({ nullable: true })
  paymentId?: string;

  @Field({ nullable: true })
  fromDate?: Date;

  @Field({ nullable: true })
  toDate?: Date;
}

@ArgsType()
export class WithdrawalQueryArgs extends QueryArgsBase<Prisma.WithdrawalWhereInput> {}

@ObjectType()
export class WithdrawalsResponse extends PaginatedResponse {
  @Field(() => [Withdrawal], { nullable: true })
  withdrawals?: Withdrawal[];
}

@ObjectType()
export class WithdrawResult {
  @Field()
  success!: boolean;

  @Field()
  message!: string;

  @Field(() => [Withdrawal], { nullable: true })
  withdrawals?: Withdrawal[];

  @Field({ nullable: true })
  totalAmount?: string;

  @Field({ nullable: true })
  count?: number;
}

@ObjectType()
export class WithdrawalSummary {
  @Field(() => GraphQLBigInt)
  totalWithdrawn!: bigint;

  @Field(() => GraphQLBigInt)
  pendingAmount!: bigint;

  @Field()
  totalCount!: number;

  @Field()
  pendingCount!: number;
}
