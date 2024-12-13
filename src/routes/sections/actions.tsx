import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';
import { Helmet } from 'react-helmet-async';

const ActionsPages = {
  ActionsPage: lazy(() => import('src/pages/actions/index')),
  ActionCreatePage: lazy(() => import('src/pages/actions/create')),
  ActionEditPage: lazy(() => import('src/pages/actions/edit')),
};

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const actionsRoutes = [
  {
    path: 'actions',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      {
        element: (
          <>
            <Helmet>
              <title> {`${CONFIG.site.name}`}</title>
            </Helmet>
            <ActionsPages.ActionsPage />
          </>
        ),
        index: true,
      },
      {
        element: (
          <>
            <Helmet>
              <title> {`${CONFIG.site.name}`}</title>
            </Helmet>
            <ActionsPages.ActionCreatePage />
          </>
        ),
        path: 'create',
      },
      {
        element: (
          <>
            <Helmet>
              <title> {`${CONFIG.site.name}`}</title>
            </Helmet>
            <ActionsPages.ActionEditPage />
          </>
        ),
        path: ':id',
      },
    ],
  },
];
