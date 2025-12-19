// User roles
export type UserRole = 'ADMIN' | 'MERCHANT';

// Admin user type
export interface Admin {
  id: string;
  email: string;
  name?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

// Merchant user type
export interface Merchant {
  id: string;
  name: string;
  email: string;
  website?: string;
  logoUrl?: string;
  description?: string;
  webhookUrl?: string;
  defaultExpirationMinutes: number;
  autoConfirmations: number;
  allowPartialPayments: boolean;
  collectCustomerEmail: boolean;
  isActive: boolean;
  verifiedAt?: string;
  createdAt: string;
  supportedNetworks?: MerchantNetwork[];
}

// Merchant supported network
export interface MerchantNetwork {
  id: string;
  network: string;
  currency: string;
  isActive: boolean;
  walletAddress: string;
}

// Auth user can be Admin or Merchant
export type AuthUser = Admin | Merchant | null;

// Type guard to check if user is Admin
export function isAdmin(user: AuthUser): user is Admin {
  return user !== null && 'role' in user;
}

// Type guard to check if user is Merchant
export function isMerchant(user: AuthUser): user is Merchant {
  return user !== null && 'supportedNetworks' in user;
}

// Auth context value
export type AuthContextValue = {
  user: AuthUser;
  userRole: UserRole | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isMerchant: boolean;
  signIn: (token: string, role: UserRole) => void;
  signOut: () => void;
};
