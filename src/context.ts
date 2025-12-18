import { Admin, Merchant, PrismaClient, UserRole } from '@prisma/client';
import type { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import Container from 'typedi';

import { PrismaService } from './service/prisma';
import { verifyTokenAuth } from './utils/auth';

const prisma = Container.get(PrismaService);

export interface Context {
  user?: Admin | Merchant;
  userRole?: UserRole;
  prisma: PrismaClient;
  req: Request;
  apiKey?: string;
  [key: string]: any;
}

interface ContextParams {
  req: Request;
}

export const context = async ({ req }: ContextParams): Promise<Context> => {
  const token = req.headers.authorization?.split(' ')[1];
  const apiKey = req.headers['x-api-key'] as string | undefined;

  let user: Admin | Merchant | undefined = undefined;
  let userRole: UserRole | undefined = undefined;

  if (token) {
    try {
      const decoded = verifyTokenAuth(token) as JwtPayload;
      const { id, role } = decoded;

      if (role === UserRole.ADMIN) {
        const admin = await prisma.admin.findUnique({
          where: { id },
        });
        if (admin && admin.isActive) {
          user = admin;
          userRole = UserRole.ADMIN;
        }
      } else if (role === UserRole.MERCHANT) {
        const merchant = await prisma.merchant.findUnique({
          where: { id },
        });
        if (merchant && merchant.isActive) {
          user = merchant;
          userRole = UserRole.MERCHANT;
        }
      }
    } catch (error) {
      // Invalid token, proceed without user
    }
  }

  return {
    user,
    userRole,
    prisma: prisma as unknown as PrismaClient,
    req,
    apiKey,
  };
};
