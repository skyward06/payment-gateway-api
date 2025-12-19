import { useState, useEffect } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

type GuestGuardProps = {
  children: React.ReactNode;
  redirectTo?: string;
};

/**
 * GuestGuard - Protects routes that should only be accessible to non-authenticated users
 * Redirects to appropriate dashboard if already authenticated
 */
export function GuestGuard({ children, redirectTo }: GuestGuardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { loading, isAuthenticated, isAdmin, isMerchant } = useAuthContext();
  const [isChecking, setIsChecking] = useState<boolean>(true);

  const returnTo = searchParams.get('returnTo');

  useEffect(() => {
    if (loading) {
      return;
    }

    if (isAuthenticated) {
      // Determine redirect path
      let targetPath = redirectTo || returnTo;

      if (!targetPath) {
        // Default redirect based on role
        if (isAdmin) {
          targetPath = paths.admin.dashboard;
        } else if (isMerchant) {
          targetPath = paths.merchant.dashboard;
        } else {
          targetPath = paths.root;
        }
      }

      router.replace(targetPath);
      return;
    }

    setIsChecking(false);
  }, [isAuthenticated, isAdmin, isMerchant, loading, router, returnTo, redirectTo]);

  if (isChecking || loading) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
