import { Prisma } from '@/generated/prisma/client';
import { ArgsType, Field } from 'type-graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import _ from 'lodash';

interface OrderBy {
  [key: string]: Prisma.SortOrder;
}

@ArgsType()
export abstract class QueryArgsBase<WhereType> {
  @Field({ nullable: true })
  sort?: string;

  @Field({ nullable: true })
  page?: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  filter?: Record<string, any>;

  get orderBy(): OrderBy | OrderBy[] | undefined {
    return this.sort?.split(',').map((field) => {
      const order: Prisma.SortOrder = field.startsWith('-') ? 'asc' : 'desc';
      return {
        [field.replace('-', '')]: order,
      };
    });
  }

  get parsePage(): { take: number; skip: number } {
    const [page = 1, limit = 50] = (this.page || '1,50').split(',').map((value) => parseInt(value));

    return {
      take: limit,
      skip: page * limit - limit,
    };
  }

  // This is for type generation, does not validate any actual inputs
  get where(): WhereType | undefined {
    const filter = _.keys(this.filter).reduce((prev, key) => {
      if (key.includes('_')) {
        prev['OR'] = key.split('_').map((field) => ({ [field]: this.filter[key] }));
      } else {
        prev[key] = this.filter[key];
      }

      return prev;
    }, {});
    return Prisma.validator<WhereType>()(filter as any);
  }
}
