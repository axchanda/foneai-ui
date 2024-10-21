import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

const ApiEndpointIndexPage = lazy(() => import('src/pages/api-endpoints'));
const ApiEndpointCreatePage = lazy(() => import('src/pages/api-endpoints/create'));
const ApiEndpointEditPage = lazy(() => import('src/pages/api-endpoints/edit'));

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const apiEndpointsRoutes = [
  {
    path: 'apiEndpoints',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { element: <ApiEndpointIndexPage />, index: true },
      {
        path: 'create',
        element: <ApiEndpointCreatePage />,
      },
      {
        path: ':id',
        element: <ApiEndpointEditPage />,
      },
    ],
  },
];
