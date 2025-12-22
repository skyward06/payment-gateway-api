import { GraphQLError } from 'graphql';
import { Arg, Args, Authorized, Field, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';

import { UserRole } from '@/generated/prisma/client';

import { IDInput } from '@/graphql/common.type';

import { Admin } from './admin.entity';
import { AdminService } from './admin.service';
import { AdminLoginInput, AdminQueryArgs, CreateAdminInput, UpdateAdminInput } from './admin.type';

@ObjectType()
class AdminLoginResponse {
  @Field(() => Admin)
  admin!: Admin;

  @Field()
  token!: string;
}

@ObjectType()
class AdminListResponse {
  @Field(() => [Admin])
  admins!: Admin[];

  @Field()
  total!: number;
}

@Service()
@Resolver(() => Admin)
export class AdminResolver {
  constructor(private readonly service: AdminService) {}

  @Mutation(() => AdminLoginResponse)
  async adminLogin(@Arg('data') data: AdminLoginInput): Promise<AdminLoginResponse> {
    const result = await this.service.login(data.email, data.password);
    if (!result) {
      throw new GraphQLError('Invalid email or password');
    }
    return result as unknown as AdminLoginResponse;
  }

  @Authorized([UserRole.ADMIN])
  @Query(() => Admin)
  async admin(@Arg('data') data: IDInput): Promise<Admin | null> {
    const admin = await this.service.findById(data.id);
    return admin as Admin;
  }

  @Authorized([UserRole.ADMIN])
  @Query(() => AdminListResponse)
  async admins(@Args() args: AdminQueryArgs): Promise<AdminListResponse> {
    const result = await this.service.findAll(args.search, args.isActive, args.take, args.skip);
    return result as unknown as AdminListResponse;
  }

  @Authorized([UserRole.ADMIN])
  @Mutation(() => Admin)
  async createAdmin(@Arg('data') data: CreateAdminInput): Promise<Admin> {
    const existing = await this.service.findByEmail(data.email);
    if (existing) {
      throw new GraphQLError('Email already registered');
    }
    const admin = await this.service.create(data);
    return admin as unknown as Admin;
  }

  @Authorized([UserRole.ADMIN])
  @Mutation(() => Admin)
  async updateAdmin(@Arg('data') data: UpdateAdminInput): Promise<Admin> {
    const admin = await this.service.update(data);
    return admin as unknown as Admin;
  }

  @Authorized([UserRole.ADMIN])
  @Mutation(() => Admin)
  async removeAdmin(@Arg('data') data: IDInput): Promise<Admin> {
    const admin = await this.service.delete(data.id);
    return admin as unknown as Admin;
  }

  @Authorized([UserRole.ADMIN])
  @Mutation(() => Admin)
  async activateAdmin(@Arg('data') data: IDInput): Promise<Admin> {
    const admin = await this.service.update({ id: data.id, isActive: true });
    return admin as unknown as Admin;
  }

  @Authorized([UserRole.ADMIN])
  @Mutation(() => Admin)
  async deactivateAdmin(@Arg('data') data: IDInput): Promise<Admin> {
    const admin = await this.service.update({ id: data.id, isActive: false });
    return admin as unknown as Admin;
  }
}
