import { PaymentCurrency, PaymentNetwork } from '@prisma/client';
import { IsEmail, IsUrl, MinLength } from 'class-validator';
import { ArgsType, Field, InputType, Int } from 'type-graphql';

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

@ArgsType()
export class MerchantQueryArgs {
  @Field({ nullable: true })
  search?: string;

  @Field({ nullable: true })
  isActive?: boolean;

  @Field(() => Int, { nullable: true, defaultValue: 20 })
  take?: number;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  skip?: number;
}
