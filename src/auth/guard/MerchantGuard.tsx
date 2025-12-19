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
 * MerchantGuard - Protects routes that require merchant authentication
 * Redirects to merchant login if not authenticated as merchant
 */
export function MerchantGuard({ children }: Props) {
  const router = useRouter();
  const { isAuthenticated, isMerchant, loading } = useAuthContext();
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!isAuthenticated || !isMerchant) {
      router.replace(paths.auth.merchantLogin);
      return;
    }

    setIsChecking(false);
  }, [isAuthenticated, isMerchant, loading, router]);

  if (isChecking || loading) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
