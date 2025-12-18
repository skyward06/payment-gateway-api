import { ArgsType, Field, InputType, Int } from 'type-graphql';

@InputType()
export class CreateApiKeyInput {
  @Field()
  name!: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [String], { nullable: true })
  permissions?: string[];

  @Field(() => [String], { nullable: true })
  allowedIPs?: string[];

  @Field(() => Int, { nullable: true })
  rateLimit?: number;

  @Field({ nullable: true })
  expiresAt?: Date;
}

@InputType()
export class UpdateApiKeyInput {
  @Field()
  id!: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [String], { nullable: true })
  permissions?: string[];

  @Field(() => [String], { nullable: true })
  allowedIPs?: string[];

  @Field(() => Int, { nullable: true })
  rateLimit?: number;

  @Field({ nullable: true })
  isActive?: boolean;

  @Field({ nullable: true })
  expiresAt?: Date;
}

@ArgsType()
export class ApiKeyQueryArgs {
  @Field({ nullable: true })
  merchantId?: string;

  @Field({ nullable: true })
  isActive?: boolean;

  @Field(() => Int, { nullable: true, defaultValue: 20 })
  take?: number;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  skip?: number;
}
