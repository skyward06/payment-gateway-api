import { Field, ID, Int, ObjectType } from 'type-graphql';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class WebhookLog {
  @Field(() => ID)
  id!: string;

  @Field()
  event!: string;

  @Field(() => GraphQLJSON)
  payload!: any;

  @Field()
  url!: string;

  @Field(() => Int, { nullable: true })
  httpStatus?: number;

  @Field({ nullable: true })
  response?: string;

  @Field(() => Int)
  attempts!: number;

  @Field()
  isDelivered!: boolean;

  @Field({ nullable: true })
  nextRetryAt?: Date;

  @Field()
  merchantId!: string;

  @Field({ nullable: true })
  paymentId?: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
