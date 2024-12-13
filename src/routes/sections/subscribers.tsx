import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';
import { AuthGuard } from 'src/auth/guard';

const SubscribersPages = {
  CreatePage: lazy(() => import('src/pages/subscribers/create')),
};

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const subscribersRoutes = [
  {
    path: 'subscribers/create',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      // { element: <Navigate to={'account'} replace />, index: true },
      { index: true, element: <SubscribersPages.CreatePage /> },
    ],
  },
];
