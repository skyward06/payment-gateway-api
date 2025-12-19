import { lazy, Suspense } from 'react';

import { SimpleLayout } from 'src/layouts/simple';

import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const Page404 = lazy(() => import('src/pages/error/404'));
const Page500 = lazy(() => import('src/pages/error/500'));

// ----------------------------------------------------------------------

export const errorRoutes = [
  {
    path: '404',
    element: (
      <SimpleLayout
        slotProps={{
          content: { compact: true },
        }}
      >
        <Suspense fallback={<SplashScreen />}>
          <Page404 />
        </Suspense>
      </SimpleLayout>
    ),
  },
  {
    path: '500',
    element: (
      <SimpleLayout>
        <Suspense fallback={<SplashScreen />}>
          <Page500 />
        </Suspense>
      </SimpleLayout>
    ),
  },
];
