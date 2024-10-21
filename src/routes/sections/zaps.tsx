import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';
import { Helmet } from 'react-helmet-async';

const ZapsPages = {
  ZapsPage: lazy(() => import('src/pages/zaps/index')),
  ZapCreatePage: lazy(() => import('src/pages/zaps/create')),
  ZapEditPage: lazy(() => import('src/pages/zaps/edit')),
};

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const zapsRoutes = [
  {
    path: 'zaps',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      {
        element: (
          <>
            <Helmet>
              <title> {`${CONFIG.site.name}`}</title>
            </Helmet>
            <ZapsPages.ZapsPage />
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
            <ZapsPages.ZapCreatePage />
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
            <ZapsPages.ZapEditPage />
          </>
        ),
        path: ':id',
      },
    ],
  },
];
