import { PaymentCurrency, PaymentNetwork } from '@prisma/client';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class MerchantNetwork {
  @Field(() => ID)
  id!: string;

  @Field(() => PaymentNetwork)
  network!: PaymentNetwork;

  @Field(() => PaymentCurrency)
  currency!: PaymentCurrency;

  @Field()
  isActive!: boolean;

  @Field()
  walletAddress!: string;

  @Field()
  merchantId!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
