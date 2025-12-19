import { lazy, Suspense } from 'react';

import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const PaymentPage = lazy(() => import('src/pages/pay'));

// ----------------------------------------------------------------------

export const payRoutes = [
  {
    path: 'pay/:id',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <PaymentPage />
      </Suspense>
    ),
  },
];
