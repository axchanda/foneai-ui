import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';
import { Helmet } from 'react-helmet-async';
import PermissionGuard from 'src/auth/guard/permission-guard';

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
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      {
        element: (
          <>
            <Helmet>
              <title> {`${CONFIG.site.name}`}</title>
            </Helmet>
            <PermissionGuard permission="bots.view">
              <BotsPages.BotsPage />
            </PermissionGuard>
          </>
        ),
        index: true,
      },
      {
        path: 'create',
        element: (
          <>
            <Helmet>
              <title> {`${CONFIG.site.name}`}</title>
            </Helmet>
            <PermissionGuard permission="bots.create">
              <BotsPages.BotCreatePage />
            </PermissionGuard>
          </>
        ),
      },
      {
        path: ':id',
        element: (
          <>
            <Helmet>
              <title> {`${CONFIG.site.name}`}</title>
            </Helmet>
            <PermissionGuard permission="bots.edit">
              <BotsPages.BotEditPage />
            </PermissionGuard>
          </>
        ),
      },
    ],
  },
];
