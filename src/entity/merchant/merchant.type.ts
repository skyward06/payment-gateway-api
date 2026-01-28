import { PaymentCurrency, PaymentNetwork, Prisma } from '@/generated/prisma/client';
import { QueryArgsBase } from '@/graphql/queryArgs';
import { IsEmail, IsUrl, MinLength } from 'class-validator';
import { ArgsType, Field, InputType, Int, ObjectType } from 'type-graphql';
import { Merchant } from './merchant.entity';

@ArgsType()
export class MerchantQueryArgs extends QueryArgsBase<Prisma.MerchantWhereInput> {}

@ObjectType()
export class MerchantsResponse {
  @Field(() => [Merchant])
  merchants?: Merchant[];

  @Field(() => Number)
  total?: number;
}

@InputType()
export class MerchantLoginInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @MinLength(6)
  password!: string;
}

@InputType()
export class CreateMerchantInput {
  @Field()
  name!: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @MinLength(6)
  password!: string;

  @Field({ nullable: true })
  @IsUrl()
  website?: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class UpdateMerchantInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  @IsUrl()
  website?: string;

  @Field({ nullable: true })
  logoUrl?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  @IsUrl()
  webhookUrl?: string;

  @Field(() => Int, { nullable: true })
  defaultExpirationMinutes?: number;

  @Field(() => Int, { nullable: true })
  autoConfirmations?: number;

  @Field({ nullable: true })
  allowPartialPayments?: boolean;

  @Field({ nullable: true })
  collectCustomerEmail?: boolean;
}

@InputType()
export class AdminUpdateMerchantInput {
  @Field()
  id!: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  @IsUrl()
  website?: string;

  @Field({ nullable: true })
  logoUrl?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  @IsUrl()
  webhookUrl?: string;

  @Field(() => Int, { nullable: true })
  defaultExpirationMinutes?: number;

  @Field(() => Int, { nullable: true })
  autoConfirmations?: number;

  @Field({ nullable: true })
  allowPartialPayments?: boolean;

  @Field({ nullable: true })
  collectCustomerEmail?: boolean;
}

@InputType()
export class AddMerchantNetworkInput {
  @Field(() => PaymentNetwork)
  network!: PaymentNetwork;

  @Field(() => PaymentCurrency)
  currency!: PaymentCurrency;

  @Field()
  walletAddress!: string;
}

@InputType()
export class UpdateMerchantNetworkInput {
  @Field()
  id!: string;

  @Field({ nullable: true })
  walletAddress?: string;

  @Field({ nullable: true })
  isActive?: boolean;
}
