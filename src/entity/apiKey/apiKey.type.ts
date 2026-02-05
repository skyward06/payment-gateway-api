import { QueryArgsBase } from '@/graphql/queryArgs';
import { ArgsType, Field, InputType, Int, ObjectType } from 'type-graphql';
import { Prisma } from '@/generated/prisma/client';
import { ApiKey } from './apiKey.entity';

@ArgsType()
export class ApiKeyQueryArgs extends QueryArgsBase<Prisma.ApiKeyWhereInput> {}

@ObjectType()
export class ApiKeyListResponse {
  @Field(() => [ApiKey])
  apiKeys?: ApiKey[];

  @Field(() => Number)
  total?: number;
}

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
