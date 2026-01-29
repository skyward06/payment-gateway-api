import { Admin, UserRole } from '@/generated/prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Service } from 'typedi';

import { PrismaService } from '@/service/prisma';

import { AdminQueryArgs, CreateAdminInput, UpdateAdminInput } from './admin.type';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

@Service()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: AdminQueryArgs) {
    return this.prisma.admin.findMany({
      where: params.where,
      orderBy: params.orderBy,
      ...params.parsePage,
    });
  }

  async findByEmail(email: string): Promise<Admin | null> {
    return this.prisma.admin.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<Admin | null> {
    return this.prisma.admin.findUnique({
      where: { id },
    });
  }

  async getCount({ where }: Pick<AdminQueryArgs, 'where'>) {
    return this.prisma.admin.count({ where });
  }

  async login(email: string, password: string): Promise<{ admin: Admin; token: string } | null> {
    const admin = await this.findByEmail(email);
    if (!admin || !admin.isActive) {
      return null;
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return null;
    }

    const token = jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return { admin, token };
  }

  async create(data: CreateAdminInput): Promise<Admin> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.admin.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: UserRole.ADMIN,
      },
    });
  }

  async update({ id, ...data }: UpdateAdminInput): Promise<Admin> {
    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    return this.prisma.admin.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string): Promise<Admin> {
    return this.prisma.admin.delete({ where: { id } });
  }

  verifyToken(token: string): { id: string; email: string; role: UserRole } | null {
    try {
      return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: UserRole };
    } catch {
      return null;
    }
  }
}
