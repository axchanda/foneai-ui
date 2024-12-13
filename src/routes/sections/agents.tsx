import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';
import { Helmet } from 'react-helmet-async';
import PermissionGuard from 'src/auth/guard/permission-guard';
import { Button, Stack, Typography } from '@mui/material';
import { Iconify } from 'src/components/iconify';
// ----------------------------------------------------------------------

/** **************************************
 * Jwt
 *************************************** */
const AgentsPages = {
  AgentsPage: lazy(() => import('src/pages/agents/index')),
  AgentCreatePage: lazy(() => import('src/pages/agents/create')),
  AgentEditPage: lazy(() => import('src/pages/agents/edit')),
};

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>

  </DashboardLayout>
);

export const agentsRoutes = [
  {
    path: 'agents',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      {
        element: (
          <>
            <Helmet>
              <title> {`${CONFIG.site.name}`}</title>
            </Helmet>
            <PermissionGuard permission="agents.view">
              <AgentsPages.AgentsPage />
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
            <PermissionGuard permission="agents.create">
              <AgentsPages.AgentCreatePage />
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
            <PermissionGuard permission="agents.edit">
              <AgentsPages.AgentEditPage />
            </PermissionGuard>
          </>
        ),
      },
    ],
  },
];
