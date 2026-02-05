import { UserRole } from '@/generated/prisma/client';
import { GraphQLError, GraphQLResolveInfo } from 'graphql';
import {
  Arg,
  Args,
  Authorized,
  Ctx,
  Field,
  Info,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';
import { Service } from 'typedi';

import { Context } from '@/context';
import { IDInput } from '@/graphql/common.type';

import { ApiKey, ApiKeyWithSecret } from './apiKey.entity';
import { ApiKeyService } from './apiKey.service';
import {
  ApiKeyListResponse,
  ApiKeyQueryArgs,
  CreateApiKeyInput,
  UpdateApiKeyInput,
} from './apiKey.type';
import graphqlFields from 'graphql-fields';

@Service()
@Resolver(() => ApiKey)
export class ApiKeyResolver {
  constructor(private readonly service: ApiKeyService) {}

  // Merchant can create API keys for themselves
  @Authorized([UserRole.MERCHANT])
  @Mutation(() => ApiKeyWithSecret)
  async createApiKey(
    @Ctx() ctx: Context,
    @Arg('data') data: CreateApiKeyInput
  ): Promise<ApiKeyWithSecret> {
    if (!ctx.user?.id) {
      throw new GraphQLError('Not authenticated');
    }
    const result = await this.service.create(ctx.user.id, data);
    return result as ApiKeyWithSecret;
  }

  @Authorized([UserRole.MERCHANT])
  @Query(() => ApiKeyListResponse)
  async myApiKeys(
    @Ctx() ctx: Context,
    @Args() query: ApiKeyQueryArgs,
    @Info() info: GraphQLResolveInfo
  ): Promise<ApiKeyListResponse> {
    if (!ctx.user?.id) {
      throw new GraphQLError('Not authenticated');
    }

    const fields = graphqlFields(info);

    const promises: { total?: Promise<number>; apiKeys?: Promise<any[]> } = {};

    query.filter = {
      AND: [
        query.filter,
        {
          merchantId: ctx.user.id,
        },
      ].filter(Boolean),
    };

    if ('total' in fields) {
      promises.total = this.service.getCount(query);
    }

    if ('apiKeys' in fields) {
      promises.apiKeys = this.service.findByMerchant(query);
    }

    const result = await Promise.all([promises.total, promises.apiKeys]);

    const response: { total?: number; apiKeys?: ApiKey[] } = {};

    if (promises.total) {
      response.total = result[0];
    }

    if (promises.apiKeys) {
      response.apiKeys = result[1];
    }

    return response;
  }

  @Authorized([UserRole.MERCHANT])
  @Mutation(() => ApiKey)
  async updateApiKey(@Ctx() ctx: Context, @Arg('data') data: UpdateApiKeyInput): Promise<ApiKey> {
    // Verify ownership
    const apiKey = await this.service.findById(data.id);
    if (!apiKey || apiKey.merchantId !== ctx.user?.id) {
      throw new GraphQLError('API key not found');
    }
    const updated = await this.service.update(data);
    return updated as ApiKey;
  }

  @Authorized([UserRole.MERCHANT])
  @Mutation(() => ApiKey)
  async revokeApiKey(@Ctx() ctx: Context, @Arg('data') data: IDInput): Promise<ApiKey> {
    // Verify ownership
    const apiKey = await this.service.findById(data.id);
    if (!apiKey || apiKey.merchantId !== ctx.user?.id) {
      throw new GraphQLError('API key not found');
    }
    const revoked = await this.service.revoke(data.id);
    return revoked as ApiKey;
  }

  @Authorized([UserRole.MERCHANT])
  @Mutation(() => ApiKeyWithSecret)
  async rotateApiKeySecret(
    @Ctx() ctx: Context,
    @Arg('data') data: IDInput
  ): Promise<ApiKeyWithSecret> {
    // Verify ownership
    const apiKey = await this.service.findById(data.id);
    if (!apiKey || apiKey.merchantId !== ctx.user?.id) {
      throw new GraphQLError('API key not found');
    }
    const result = await this.service.rotateSecret(data.id);
    return result as ApiKeyWithSecret;
  }

  // Admin queries
  @Authorized([UserRole.ADMIN])
  @Query(() => ApiKeyListResponse)
  async apiKeys(@Args() query: ApiKeyQueryArgs): Promise<ApiKeyListResponse> {
    const result = await this.service.findByMerchant(query);
    return result as ApiKeyListResponse;
  }

  @Authorized([UserRole.ADMIN])
  @Mutation(() => ApiKey)
  async adminRevokeApiKey(@Arg('data') data: IDInput): Promise<ApiKey> {
    const revoked = await this.service.revoke(data.id);
    return revoked as ApiKey;
  }
}
