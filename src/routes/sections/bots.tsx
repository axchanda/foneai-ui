import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

/** **************************************
 * Jwt
 *************************************** */
const BotsPages = {
  BotsPage: lazy(() => import('src/pages/bots/index')),
  BotCreatePage: lazy(() => import('src/pages/bots/create')),
  BotEditPage: lazy(() => import('src/pages/bots/edit')),
};

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const botsRoutes = [
  {
    path: 'bots',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <>{layoutContent}</>,
    children: [
      { element: <BotsPages.BotsPage />, index: true },
      { path: 'create', element: <BotsPages.BotCreatePage /> },
      { path: ':id', element: <BotsPages.BotEditPage /> },
    ],
  },
];
