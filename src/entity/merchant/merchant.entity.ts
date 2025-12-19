import { Field, ID, ObjectType } from 'type-graphql';

import { BaseEntity } from '@/graphql/baseEntity';

import { ApiKey } from '../apiKey/apiKey.entity';
import { MerchantNetwork } from './merchantNetwork.entity';

@ObjectType()
export class Merchant extends BaseEntity {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  email!: string;

  password?: string;

  @Field({ nullable: true })
  website?: string;

  @Field({ nullable: true })
  logoUrl?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  webhookUrl?: string;

  @Field({ nullable: true, description: 'Only visible to authenticated merchant or admin' })
  webhookSecret?: string;

  @Field()
  defaultExpirationMinutes!: number;

  @Field()
  autoConfirmations!: number;

  @Field()
  allowPartialPayments!: boolean;

  @Field()
  collectCustomerEmail!: boolean;

  @Field()
  isActive!: boolean;

  @Field({ nullable: true })
  verifiedAt?: Date;

  @Field(() => [ApiKey], { nullable: true })
  apiKeys?: ApiKey[];

  @Field(() => [MerchantNetwork], { nullable: true })
  supportedNetworks?: MerchantNetwork[];
}
