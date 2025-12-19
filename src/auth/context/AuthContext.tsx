import type { AuthContextValue } from '../types';

import { createContext } from 'react';

// ----------------------------------------------------------------------

const defaultValue: AuthContextValue = {
  user: null,
  userRole: null,
  loading: true,
  isAuthenticated: false,
  isAdmin: false,
  isMerchant: false,
  signIn: () => {},
  signOut: () => {},
};

export const AuthContext = createContext<AuthContextValue>(defaultValue);
