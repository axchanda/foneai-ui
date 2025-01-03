import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';
import PermissionGuard from 'src/auth/guard/permission-guard';
import { UsageContextProvider } from 'src/context/usage.context';

// ----------------------------------------------------------------------

// Overview
const IndexPage = lazy(() => import('src/pages/dashboard'));
// Product
// Order
// Invoice
// User
// Blog
// Job
// Tour
// File manager
// App
// Test render page by role
// Blank page

// ----------------------------------------------------------------------

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: CONFIG.auth.skip ? (
      <>{layoutContent}</>
    ) : (
      <AuthGuard>
        <PermissionGuard permission="dashboard.view">
          <UsageContextProvider>{layoutContent}</UsageContextProvider>
        </PermissionGuard>
      </AuthGuard>
    ),
    children: [{ element: <IndexPage />, index: true }],
  },
];
