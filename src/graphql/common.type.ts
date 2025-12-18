import { ArgsType, Field, ID, InputType, Int, ObjectType } from 'type-graphql';

@InputType()
export class IDInput {
  @Field(() => ID)
  id!: string;
}
