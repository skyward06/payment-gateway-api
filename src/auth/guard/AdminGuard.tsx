import { useState, useEffect } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

/**
 * AdminGuard - Protects routes that require admin authentication
 * Redirects to admin login if not authenticated as admin
 */
export function AdminGuard({ children }: Props) {
  const router = useRouter();
  const { isAuthenticated, isAdmin, loading } = useAuthContext();
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!isAuthenticated || !isAdmin) {
      router.replace(paths.auth.adminLogin);
      return;
    }

    setIsChecking(false);
  }, [isAuthenticated, isAdmin, loading, router]);

  if (isChecking || loading) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
