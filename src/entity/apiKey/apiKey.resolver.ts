import { UserRole } from '@prisma/client';
import { GraphQLError } from 'graphql';
import {
  Arg,
  Args,
  Authorized,
  Ctx,
  Field,
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
import { ApiKeyQueryArgs, CreateApiKeyInput, UpdateApiKeyInput } from './apiKey.type';

@ObjectType()
class ApiKeyListResponse {
  @Field(() => [ApiKey])
  apiKeys!: ApiKey[];

  @Field()
  total!: number;
}

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
    return result as unknown as ApiKeyWithSecret;
  }

  @Authorized([UserRole.MERCHANT])
  @Query(() => ApiKeyListResponse)
  async myApiKeys(@Ctx() ctx: Context, @Args() args: ApiKeyQueryArgs): Promise<ApiKeyListResponse> {
    if (!ctx.user?.id) {
      throw new GraphQLError('Not authenticated');
    }
    const result = await this.service.findByMerchant(
      ctx.user.id,
      args.isActive,
      args.take,
      args.skip
    );
    return result as unknown as ApiKeyListResponse;
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
    return updated as unknown as ApiKey;
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
    return revoked as unknown as ApiKey;
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
    return result as unknown as ApiKeyWithSecret;
  }

  // Admin queries
  @Authorized([UserRole.ADMIN])
  @Query(() => ApiKeyListResponse)
  async apiKeys(@Args() args: ApiKeyQueryArgs): Promise<ApiKeyListResponse> {
    if (!args.merchantId) {
      throw new GraphQLError('merchantId is required');
    }
    const result = await this.service.findByMerchant(
      args.merchantId,
      args.isActive,
      args.take,
      args.skip
    );
    return result as unknown as ApiKeyListResponse;
  }

  @Authorized([UserRole.ADMIN])
  @Mutation(() => ApiKey)
  async adminRevokeApiKey(@Arg('data') data: IDInput): Promise<ApiKey> {
    const revoked = await this.service.revoke(data.id);
    return revoked as unknown as ApiKey;
  }
}
