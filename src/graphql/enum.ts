import {
  PaymentCurrency,
  PaymentNetwork,
  PaymentStatus,
  UserRole,
  WithdrawalStatus,
} from '@/generated/prisma/client';
import { registerEnumType } from 'type-graphql';

// Register Prisma enums
registerEnumType(UserRole, { name: 'UserRole' });
registerEnumType(PaymentStatus, { name: 'PaymentStatus' });
registerEnumType(PaymentNetwork, { name: 'PaymentNetwork' });
registerEnumType(PaymentCurrency, { name: 'PaymentCurrency' });
registerEnumType(WithdrawalStatus, { name: 'WithdrawalStatus' });
