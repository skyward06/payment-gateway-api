import type { UserRole, AuthUser, AuthContextValue } from '../types';

import { useLazyQuery } from '@apollo/client';
import { useMemo, useState, useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { GET_MERCHANT_ME } from 'src/graphql';
import { STORAGE_ROLE_KEY, STORAGE_TOKEN_KEY } from 'src/consts';

import { toast } from 'src/components/SnackBar';

import { AuthContext } from './AuthContext';
import { isValidToken, setTokenTimer } from './utils';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const router = useRouter();

  // Get stored token and role
  const storedToken = localStorage.getItem(STORAGE_TOKEN_KEY);
  const storedRole = localStorage.getItem(STORAGE_ROLE_KEY) as UserRole | null;

  const [token, setToken] = useState<string | null>(storedToken);
  const [userRole, setUserRole] = useState<UserRole | null>(storedRole);
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch merchant profile
  const [fetchMerchant, { data: merchantData, error: merchantError }] = useLazyQuery(
    GET_MERCHANT_ME,
    {
      fetchPolicy: 'network-only',
    }
  );

  // Sign in handler
  const signIn = useCallback(
    (newToken: string, role: UserRole) => {
      // Store token and role
      localStorage.setItem(STORAGE_TOKEN_KEY, newToken);
      localStorage.setItem(STORAGE_ROLE_KEY, role);

      setToken(newToken);
      setUserRole(role);

      toast.success('Successfully logged in');

      // Redirect based on role
      if (role === 'ADMIN') {
        router.push(paths.admin.dashboard);
      } else {
        router.push(paths.merchant.dashboard);
      }
    },
    [router]
  );

  // Sign out handler
  const signOut = useCallback(() => {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_ROLE_KEY);

    setToken(null);
    setUserRole(null);
    setUser(null);

    router.push(paths.root);
  }, [router]);

  // Initialize auth state
  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;

    const initAuth = async () => {
      if (token && isValidToken(token)) {
        // Set token expiration timer
        const timer = setTokenTimer(token);
        if (timer) timerId = timer;

        // Fetch user data based on role
        if (userRole === 'MERCHANT') {
          fetchMerchant();
        } else if (userRole === 'ADMIN') {
          // For admin, we'll just verify the token is valid
          // Admin data is typically minimal
          setUser({ id: '', email: '', role: 'SUPER_ADMIN', isActive: true, createdAt: '' });
          setLoading(false);
        }
      } else if (token && !isValidToken(token)) {
        // Token expired
        signOut();
      } else {
        // No token
        setLoading(false);
      }
    };

    initAuth();

    return () => {
      if (timerId) clearTimeout(timerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, userRole]);

  // Handle merchant data
  useEffect(() => {
    if (merchantData?.merchantMe) {
      setUser(merchantData.merchantMe);
      setLoading(false);
    }
  }, [merchantData]);

  // Handle fetch errors
  useEffect(() => {
    if (merchantError) {
      toast.error('Session expired. Please login again.');
      signOut();
    }
  }, [merchantError, signOut]);

  // Memoized context value
  const memoizedValue: AuthContextValue = useMemo(
    () => ({
      user,
      userRole,
      loading,
      isAuthenticated: !!token && !!user,
      isAdmin: userRole === 'ADMIN',
      isMerchant: userRole === 'MERCHANT',
      signIn,
      signOut,
    }),
    [user, userRole, token, loading, signIn, signOut]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
