import { lazy, Suspense } from 'react';
import { Outlet, Navigate } from 'react-router';

import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { MerchantGuard } from 'src/auth/guard';

import { paths } from '../paths';
import { merchantNavData } from '../../layouts/nav-config-dashboard';

// ----------------------------------------------------------------------

const MerchantDashboardPage = lazy(() => import('src/pages/merchant/dashboard'));
const MerchantPaymentsPage = lazy(() => import('src/pages/merchant/payments'));
const MerchantPaymentDetailPage = lazy(() => import('src/pages/merchant/payment-detail'));
const MerchantApiKeysPage = lazy(() => import('src/pages/merchant/api-keys'));
const MerchantNetworksPage = lazy(() => import('src/pages/merchant/networks'));
const MerchantSettingsPage = lazy(() => import('src/pages/merchant/settings'));

// ----------------------------------------------------------------------

export const merchantRoutes = [
  {
    path: 'merchant',
    element: (
      <MerchantGuard>
        <DashboardLayout slotProps={{ nav: { data: merchantNavData } }}>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </MerchantGuard>
    ),
    children: [
      { element: <Navigate to={paths.merchant.dashboard} replace />, index: true },
      { path: 'dashboard', element: <MerchantDashboardPage /> },
      { path: 'payments', element: <MerchantPaymentsPage /> },
      { path: 'payments/:id', element: <MerchantPaymentDetailPage /> },
      { path: 'api-keys', element: <MerchantApiKeysPage /> },
      { path: 'networks', element: <MerchantNetworksPage /> },
      { path: 'settings', element: <MerchantSettingsPage /> },
    ],
  },
];
