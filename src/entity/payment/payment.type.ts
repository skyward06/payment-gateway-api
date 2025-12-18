import { PaymentCurrency, PaymentNetwork, PaymentStatus } from '@prisma/client';
import { IsEmail, IsUrl } from 'class-validator';
import { ArgsType, Field, Float, InputType, Int } from 'type-graphql';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class CreatePaymentInput {
  @Field({ nullable: true })
  externalId?: string;

  @Field(() => Float)
  amount!: number; // Amount in fiat or crypto depending on context

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
export class PaymentQueryArgs {
  @Field(() => PaymentWhereInput, { nullable: true })
  where?: PaymentWhereInput;

  @Field(() => Int, { nullable: true, defaultValue: 20 })
  take?: number;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  skip?: number;

  @Field({ nullable: true })
  orderBy?: string;
}

@InputType()
export class CheckPaymentInput {
  @Field()
  paymentId!: string;
}
