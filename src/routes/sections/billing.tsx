import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';
import PermissionGuard from 'src/auth/guard/permission-guard';

const IndexPage = lazy(() => import('src/pages/billing'));

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const billingRoutes = [
  {
    path: 'billing',
    element: CONFIG.auth.skip ? (
      <>{layoutContent}</>
    ) : (
      <AuthGuard>
        <PermissionGuard permission="billing.view">{layoutContent}</PermissionGuard>
      </AuthGuard>
    ),
    children: [{ element: <IndexPage />, index: true }],
  },
];
