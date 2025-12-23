import { UserRole } from '@/generated/prisma/client';
import { GraphQLError, GraphQLResolveInfo } from 'graphql';
import {
  Arg,
  Args,
  Authorized,
  Ctx,
  Field,
  FieldResolver,
  Info,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { Service } from 'typedi';

import { Context } from '@/context';
import { IDInput } from '@/graphql/common.type';

import { Merchant } from './merchant.entity';
import { MerchantService } from './merchant.service';
import {
  AddMerchantNetworkInput,
  AdminUpdateMerchantInput,
  CreateMerchantInput,
  MerchantLoginInput,
  MerchantQueryArgs,
  UpdateMerchantInput,
  UpdateMerchantNetworkInput,
} from './merchant.type';
import { MerchantNetwork } from './merchantNetwork.entity';
import graphqlFields from 'graphql-fields';

@ObjectType()
class MerchantLoginResponse {
  @Field(() => Merchant)
  merchant!: Merchant;

  @Field()
  token!: string;
}

@ObjectType()
class MerchantsResponse {
  @Field(() => [Merchant])
  merchants?: Merchant[];
}

@Service()
@Resolver(() => Merchant)
export class MerchantResolver {
  constructor(private readonly service: MerchantService) {}

  // Public mutations
  @Mutation(() => Merchant)
  async registerMerchant(@Arg('data') data: CreateMerchantInput): Promise<Merchant> {
    const existing = await this.service.findByEmail(data.email);
    if (existing) {
      throw new GraphQLError('Email already registered');
    }
    const merchant = await this.service.register(data);
    return merchant as unknown as Merchant;
  }

  @Mutation(() => MerchantLoginResponse)
  async merchantLogin(@Arg('data') data: MerchantLoginInput): Promise<MerchantLoginResponse> {
    const result = await this.service.login(data.email, data.password);
    if (!result) {
      throw new GraphQLError('Invalid email or password');
    }
    return result as unknown as MerchantLoginResponse;
  }

  // Merchant queries (for logged-in merchant)
  @Authorized([UserRole.MERCHANT])
  @Query(() => Merchant)
  async merchantMe(@Ctx() ctx: Context): Promise<Merchant> {
    if (!ctx.user?.id) {
      throw new GraphQLError('Not authenticated');
    }
    const merchant = await this.service.findById(ctx.user.id, true);
    if (!merchant) {
      throw new GraphQLError('Merchant not found');
    }
    return merchant as unknown as Merchant;
  }

  @Authorized([UserRole.MERCHANT])
  @Mutation(() => Merchant)
  async updateMerchantProfile(
    @Ctx() ctx: Context,
    @Arg('data') data: UpdateMerchantInput
  ): Promise<Merchant> {
    if (!ctx.user?.id) {
      throw new GraphQLError('Not authenticated');
    }
    const merchant = await this.service.update(ctx.user.id, data);
    return merchant as unknown as Merchant;
  }

  @Authorized([UserRole.MERCHANT])
  @Mutation(() => MerchantNetwork)
  async addMerchantNetwork(
    @Ctx() ctx: Context,
    @Arg('data') data: AddMerchantNetworkInput
  ): Promise<MerchantNetwork> {
    if (!ctx.user?.id) {
      throw new GraphQLError('Not authenticated');
    }
    const network = await this.service.addNetwork(ctx.user.id, data);
    return network as unknown as MerchantNetwork;
  }

  @Authorized([UserRole.MERCHANT])
  @Mutation(() => MerchantNetwork)
  async updateMerchantNetwork(
    @Arg('data') data: UpdateMerchantNetworkInput
  ): Promise<MerchantNetwork> {
    const network = await this.service.updateNetwork(data);
    return network as unknown as MerchantNetwork;
  }

  @Authorized([UserRole.MERCHANT])
  @Mutation(() => MerchantNetwork)
  async removeMerchantNetwork(@Arg('data') data: IDInput): Promise<MerchantNetwork> {
    const network = await this.service.removeNetwork(data.id);
    return network as unknown as MerchantNetwork;
  }

  @Authorized([UserRole.MERCHANT])
  @Mutation(() => String)
  async regenerateWebhookSecret(@Ctx() ctx: Context): Promise<string> {
    if (!ctx.user?.id) {
      throw new GraphQLError('Not authenticated');
    }
    return this.service.regenerateWebhookSecret(ctx.user.id);
  }

  // Admin queries
  @Authorized([UserRole.ADMIN])
  @Query(() => Merchant, { nullable: true })
  async merchant(@Arg('data') data: IDInput): Promise<Merchant | null> {
    const merchant = await this.service.findById(data.id, true);
    return merchant as unknown as Merchant | null;
  }

  @Authorized([UserRole.ADMIN])
  @Query(() => MerchantsResponse)
  async merchants(
    @Args() query: MerchantQueryArgs,
    @Info() info: GraphQLResolveInfo
  ): Promise<MerchantsResponse> {
    const fields = graphqlFields(info);

    // TODO: Update array type any to Merchant
    const promises: { total?: Promise<number>; merchants?: Promise<any[]> } = {};

    if ('total' in fields) {
      promises.total = this.service.getMerchantsCount(query);
    }

    if ('merchants' in fields) {
      promises.merchants = this.service.getMerchants(query);
    }

    const result = await Promise.all([promises.total, promises.merchants]);

    const response: { total?: number; merchants?: Merchant[] } = {};

    if (promises.total) {
      response.total = result[0];
    }
    if (promises.merchants) {
      response.merchants = result[1];
    }

    return response;
  }

  @Authorized([UserRole.ADMIN])
  @Mutation(() => Merchant)
  async verifyMerchant(@Arg('data') data: IDInput): Promise<Merchant> {
    const merchant = await this.service.verify(data.id);
    return merchant as unknown as Merchant;
  }

  @Authorized([UserRole.ADMIN])
  @Mutation(() => Merchant)
  async unverifyMerchant(@Arg('data') data: IDInput): Promise<Merchant> {
    const merchant = await this.service.unverify(data.id);
    return merchant as unknown as Merchant;
  }

  @Authorized([UserRole.ADMIN])
  @Mutation(() => Merchant)
  async activateMerchant(@Arg('data') data: IDInput): Promise<Merchant> {
    const merchant = await this.service.activate(data.id);
    return merchant as unknown as Merchant;
  }

  @Authorized([UserRole.ADMIN])
  @Mutation(() => Merchant)
  async deactivateMerchant(@Arg('data') data: IDInput): Promise<Merchant> {
    const merchant = await this.service.deactivate(data.id);
    return merchant as unknown as Merchant;
  }

  @Authorized([UserRole.ADMIN])
  @Mutation(() => Merchant)
  async deleteMerchant(@Arg('data') data: IDInput): Promise<Merchant> {
    const merchant = await this.service.delete(data.id);
    return merchant as unknown as Merchant;
  }

  @Authorized([UserRole.ADMIN])
  @Mutation(() => Merchant)
  async adminUpdateMerchant(@Arg('data') data: AdminUpdateMerchantInput): Promise<Merchant> {
    const { id, ...updateData } = data;
    const merchant = await this.service.update(id, updateData);
    return merchant as unknown as Merchant;
  }

  // Field resolvers
  @FieldResolver(() => [MerchantNetwork])
  async supportedNetworks(@Root() merchant: Merchant): Promise<MerchantNetwork[]> {
    const networks = await this.service.getNetworks(merchant.id);
    return networks as unknown as MerchantNetwork[];
  }
}
