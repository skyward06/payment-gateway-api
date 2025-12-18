import { PaymentCurrency, PaymentNetwork, PaymentStatus, UserRole } from '@prisma/client';
import { registerEnumType } from 'type-graphql';

// Register Prisma enums
registerEnumType(UserRole, { name: 'UserRole' });
registerEnumType(PaymentStatus, { name: 'PaymentStatus' });
registerEnumType(PaymentNetwork, { name: 'PaymentNetwork' });
registerEnumType(PaymentCurrency, { name: 'PaymentCurrency' });

// Note: GraphQLBigInt from graphql-scalars is automatically registered when used in Field decorators
