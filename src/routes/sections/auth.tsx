import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { AuthCenteredLayout } from 'src/layouts/auth-centered';

import { SplashScreen } from 'src/components/loading-screen';

import { GuestGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

// Admin
const AdminLoginPage = lazy(() => import('src/pages/admin/login'));

// Merchant
const MerchantLoginPage = lazy(() => import('src/pages/merchant/login'));
const MerchantRegisterPage = lazy(() => import('src/pages/merchant/register'));

// ----------------------------------------------------------------------

export const authRoutes = [
  {
    path: 'admin',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [
      {
        path: 'login',
        element: (
          <GuestGuard>
            <AuthCenteredLayout>
              <AdminLoginPage />
            </AuthCenteredLayout>
          </GuestGuard>
        ),
      },
    ],
  },
  {
    path: 'login',
    element: (
      <GuestGuard>
        <AuthCenteredLayout>
          <MerchantLoginPage />
        </AuthCenteredLayout>
      </GuestGuard>
    ),
  },
  {
    path: 'register',
    element: (
      <GuestGuard>
        <AuthCenteredLayout>
          <MerchantRegisterPage />
        </AuthCenteredLayout>
      </GuestGuard>
    ),
  },
];
