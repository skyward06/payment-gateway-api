import { UserRole } from '@/generated/prisma/client';
import { GraphQLError } from 'graphql';
import {
  Arg,
  Args,
  Authorized,
  Ctx,
  Field,
  FieldResolver,
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

@ObjectType()
class MerchantLoginResponse {
  @Field(() => Merchant)
  merchant!: Merchant;

  @Field()
  token!: string;
}

@ObjectType()
class MerchantListResponse {
  @Field(() => [Merchant])
  merchants!: Merchant[];

  @Field()
  total!: number;
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
  @Query(() => MerchantListResponse)
  async merchants(@Args() args: MerchantQueryArgs): Promise<MerchantListResponse> {
    const result = await this.service.findAll(args.search, args.isActive, args.take, args.skip);
    return result as unknown as MerchantListResponse;
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
