import { IsEmail, MinLength } from 'class-validator';
import { ArgsType, Field, ID, InputType, Int, ObjectType } from 'type-graphql';
import { Admin } from './admin.entity';
import { QueryArgsBase } from '@/graphql/queryArgs';
import { Prisma } from '@/generated/prisma/client';

@InputType()
export class AdminLoginInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @MinLength(6)
  password!: string;
}

@InputType()
export class CreateAdminInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @MinLength(6)
  password!: string;

  @Field({ nullable: true })
  name?: string;
}

@InputType()
export class UpdateAdminInput {
  @Field(() => ID)
  id!: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  @MinLength(6)
  password?: string;

  @Field({ nullable: true })
  isActive?: boolean;
}

@ArgsType()
export class AdminQueryArgs extends QueryArgsBase<Prisma.AdminWhereInput> {}

@ObjectType()
export class AdminsResponse {
  @Field(() => [Admin])
  admins?: Admin[];

  @Field(() => Number)
  total?: number;
}
