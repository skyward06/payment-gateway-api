import { UserRole } from '@/generated/prisma/client';
import { type AuthChecker } from 'type-graphql';

import { type Context } from './context';

export const authChecker: AuthChecker<Context> = async ({ context: { user, userRole } }, roles) => {
  try {
    // Check if user exists
    if (!user) {
      return false;
    }

    // Check if user is active
    if (!user.isActive) {
      return false;
    }

    // If no roles specified, just need authentication
    if (roles.length === 0) {
      return true;
    }

    // Check role-based access
    if (roles.includes(UserRole.ADMIN)) {
      return userRole === UserRole.ADMIN;
    }

    if (roles.includes(UserRole.MERCHANT)) {
      return userRole === UserRole.MERCHANT;
    }

    return true;
  } catch (err) {
    throw new Error('Not authenticated');
  }
};
