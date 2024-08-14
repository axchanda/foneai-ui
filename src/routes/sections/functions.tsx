import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';
import { Helmet } from 'react-helmet-async';

const FunctionsPages = {
  FunctionsPage: lazy(() => import('src/pages/functions/index')),
  FunctionsCreatePage: lazy(() => import('src/pages/functions/create')),
  FunctionsEditPage: lazy(() => import('src/pages/functions/edit')),
};

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const functionsRoutes = [
  {
    path: 'functions',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      {
        element: (
          <>
            <Helmet>
              <title> {`${CONFIG.site.name}`}</title>
            </Helmet>
            <FunctionsPages.FunctionsPage />
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
            <FunctionsPages.FunctionsCreatePage />
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
            <FunctionsPages.FunctionsEditPage />
          </>
        ),
        path: ':id',
      },
    ],
  },
];
