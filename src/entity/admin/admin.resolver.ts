import { GraphQLError, GraphQLResolveInfo } from 'graphql';
import {
  Arg,
  Args,
  Authorized,
  Field,
  Info,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';
import { Service } from 'typedi';

import { UserRole } from '@/generated/prisma/client';

import { IDInput } from '@/graphql/common.type';

import { Admin } from './admin.entity';
import { AdminService } from './admin.service';
import {
  AdminLoginInput,
  AdminQueryArgs,
  AdminsResponse,
  CreateAdminInput,
  UpdateAdminInput,
} from './admin.type';
import graphqlFields from 'graphql-fields';

@ObjectType()
class AdminLoginResponse {
  @Field(() => Admin)
  admin!: Admin;

  @Field()
  token!: string;
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
  async admin(@Arg('data') data: IDInput): Promise<Admin> {
    const admin = await this.service.findById(data.id);
    return admin as Admin;
  }

  @Authorized([UserRole.ADMIN])
  @Query(() => AdminsResponse)
  async admins(
    @Args() query: AdminQueryArgs,
    @Info() info: GraphQLResolveInfo
  ): Promise<AdminsResponse> {
    const fields = graphqlFields(info);

    const promises: { total?: Promise<number>; admins?: Promise<any> } = {};

    if ('total' in fields) {
      promises.total = this.service.getCount(query);
    }

    if ('admins' in fields) {
      promises.admins = this.service.findAll(query);
    }

    const result = await Promise.all([promises.total, promises.admins]);

    const response: { total?: number; admins?: Admin[] } = {};

    if (promises.total) {
      response.total = result[0];
    }

    if (promises.admins) {
      response.admins = result[1];
    }

    return response;
  }

  @Authorized([UserRole.ADMIN])
  @Mutation(() => Admin)
  async createAdmin(@Arg('data') data: CreateAdminInput): Promise<Admin> {
    const existing = await this.service.findByEmail(data.email);
    if (existing) {
      throw new GraphQLError('Email already registered');
    }
    const admin = await this.service.create(data);
    return admin as Admin;
  }

  @Authorized([UserRole.ADMIN])
  @Mutation(() => Admin)
  async updateAdmin(@Arg('data') data: UpdateAdminInput): Promise<Admin> {
    const admin = await this.service.update(data);
    return admin as Admin;
  }

  @Authorized([UserRole.ADMIN])
  @Mutation(() => Admin)
  async removeAdmin(@Arg('data') data: IDInput): Promise<Admin> {
    const admin = await this.service.delete(data.id);
    return admin as Admin;
  }

  @Authorized([UserRole.ADMIN])
  @Mutation(() => Admin)
  async activateAdmin(@Arg('data') data: IDInput): Promise<Admin> {
    const admin = await this.service.update({ id: data.id, isActive: true });
    return admin as Admin;
  }

  @Authorized([UserRole.ADMIN])
  @Mutation(() => Admin)
  async deactivateAdmin(@Arg('data') data: IDInput): Promise<Admin> {
    const admin = await this.service.update({ id: data.id, isActive: false });
    return admin as Admin;
  }
}
