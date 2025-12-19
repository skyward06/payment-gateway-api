import { lazy, Suspense } from 'react';
import { Outlet, Navigate } from 'react-router';

import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AdminGuard } from 'src/auth/guard';

import { paths } from '../paths';
import { adminNavData } from '../../layouts/nav-config-dashboard';

// ----------------------------------------------------------------------

const AdminDashboardPage = lazy(() => import('src/pages/admin/dashboard'));
const AdminMerchantsPage = lazy(() => import('src/pages/admin/merchants'));
const AdminMerchantEditPage = lazy(() => import('src/pages/admin/merchant-edit'));
const AdminPaymentsPage = lazy(() => import('src/pages/admin/payments'));
const AdminsViewPage = lazy(() => import('src/pages/admin/Admin/List'));
const AdminCreatePage = lazy(() => import('src/pages/admin/Admin/Create'));

// ----------------------------------------------------------------------

export const adminRoutes = [
  {
    path: 'admin',
    element: (
      <AdminGuard>
        <DashboardLayout slotProps={{ nav: { data: adminNavData } }}>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AdminGuard>
    ),
    children: [
      { element: <Navigate to={paths.admin.dashboard} replace />, index: true },
      { path: 'dashboard', element: <AdminDashboardPage /> },
      { path: 'merchants', element: <AdminMerchantsPage /> },
      { path: 'merchants/:id', element: <AdminMerchantEditPage /> },
      { path: 'payments', element: <AdminPaymentsPage /> },
      {
        path: 'admins',
        children: [
          { index: true, element: <AdminsViewPage /> },
          { path: 'new', element: <AdminCreatePage /> },
        ],
      },
    ],
  },
];
