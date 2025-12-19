import { UserRole } from '@/generated/prisma/client';
import { Field, ID, ObjectType } from 'type-graphql';

import { BaseEntity } from '@/graphql/baseEntity';

@ObjectType()
export class Admin extends BaseEntity {
  @Field(() => ID)
  id!: string;

  @Field()
  email!: string;

  password?: string;

  @Field({ nullable: true })
  name?: string;

  @Field(() => UserRole)
  role!: UserRole;

  @Field()
  isActive!: boolean;
}
