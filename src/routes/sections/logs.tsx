import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';
import PermissionGuard from 'src/auth/guard/permission-guard';
import { UsageContextProvider } from 'src/context/usage.context';
import { Helmet } from 'react-helmet-async';
import path from 'path';

// ----------------------------------------------------------------------

// Overview
const LogsPage = {
  LogsPage: lazy(() => import('src/pages/logs/index')),
  LogView: lazy(() => import('src/pages/logs/view')),
};

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const logsRoutes = [
  {
    path: 'logs',
    element: CONFIG.auth.skip ? (
      <>{layoutContent}</>
    ) : (
      <AuthGuard>
        <PermissionGuard permission="logs.view">
          <UsageContextProvider>{layoutContent}</UsageContextProvider>
        </PermissionGuard>
      </AuthGuard>
    ),
    children: [
      { element: <>
        <Helmet>
          <title> {`${CONFIG.site.name}`}</title>
        </Helmet>
      <LogsPage.LogsPage /></>, index: true },
      {
        path: ':id',
        element: <>
          <Helmet>
            <title> {`${CONFIG.site.name}`}</title>
          </Helmet>
          <LogsPage.LogView /> 
        </>,
      },
    ],
  },
];
