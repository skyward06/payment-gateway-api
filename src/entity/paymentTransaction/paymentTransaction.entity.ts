import { PaymentNetwork } from '@prisma/client';
import { GraphQLBigInt } from 'graphql-scalars';
import { Field, ID, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class PaymentTransaction {
  @Field(() => ID)
  id!: string;

  @Field()
  txHash!: string;

  @Field(() => PaymentNetwork)
  network!: PaymentNetwork;

  @Field({ nullable: true })
  fromAddress?: string;

  @Field()
  toAddress!: string;

  @Field(() => GraphQLBigInt)
  amount!: bigint;

  @Field(() => Int)
  confirmations!: number;

  @Field(() => GraphQLBigInt, { nullable: true })
  blockNumber?: bigint;

  @Field({ nullable: true })
  blockHash?: string;

  @Field()
  isConfirmed!: boolean;

  @Field({ nullable: true })
  confirmedAt?: Date;

  @Field()
  paymentId!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
