import { Field, ID, ObjectType } from 'type-graphql';

import { BaseEntity } from '@/graphql/baseEntity';

@ObjectType()
export class ApiKey extends BaseEntity {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  publicKey!: string;

  // secretHash is never exposed

  @Field({ nullable: true })
  description?: string;

  @Field(() => [String])
  permissions!: string[];

  @Field(() => [String])
  allowedIPs!: string[];

  @Field()
  rateLimit!: number;

  @Field()
  isActive!: boolean;

  @Field({ nullable: true })
  lastUsedAt?: Date;

  @Field({ nullable: true })
  expiresAt?: Date;

  @Field()
  merchantId!: string;
}

@ObjectType()
export class ApiKeyWithSecret {
  @Field(() => ApiKey)
  apiKey!: ApiKey;

  @Field()
  secretKey!: string;
}
