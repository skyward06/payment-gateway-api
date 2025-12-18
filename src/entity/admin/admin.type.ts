import { IsEmail, MinLength } from 'class-validator';
import { ArgsType, Field, InputType, Int } from 'type-graphql';

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
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  @MinLength(6)
  password?: string;

  @Field({ nullable: true })
  isActive?: boolean;
}

@ArgsType()
export class AdminQueryArgs {
  @Field({ nullable: true })
  search?: string;

  @Field({ nullable: true })
  isActive?: boolean;

  @Field(() => Int, { nullable: true, defaultValue: 20 })
  take?: number;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  skip?: number;
}
