import type { RouteObject } from 'react-router';

import { Navigate } from 'react-router';

import { paths } from '../paths';
import { payRoutes } from './pay';
import { authRoutes } from './auth';
import { adminRoutes } from './admin';
import { errorRoutes } from './error';
import { merchantRoutes } from './merchant';

// ----------------------------------------------------------------------

export const routesSection: RouteObject[] = [
  // Root redirects to merchant login
  {
    path: '/',
    element: <Navigate to={paths.auth.merchantLogin} replace />,
  },

  // Auth routes (login, register)
  ...authRoutes,

  // Admin dashboard routes
  ...adminRoutes,

  // Merchant dashboard routes
  ...merchantRoutes,

  // Public payment page
  ...payRoutes,

  // Error pages
  ...errorRoutes,

  // 404 catch-all
  { path: '*', element: <Navigate to="/404" replace /> },
];
