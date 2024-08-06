import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

const IndexPage = lazy(() => import('src/pages/webhooks'));
const CreatePage = lazy(() => import('src/pages/webhooks/create'));
const EditPage = lazy(() => import('src/pages/webhooks/edit'));

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const webhooksRoutes = [
  {
    path: 'webhooks',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { element: <IndexPage />, index: true },
      {
        path: 'create',
        element: <CreatePage />,
      },
      {
        path: 'edit/:id',
        element: <EditPage />,
      },
    ],
  },
];
