import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';
import { Helmet } from 'react-helmet-async';

// ----------------------------------------------------------------------

/** **************************************
 * Jwt
 *************************************** */
const InvoicesPages = {
  Index: lazy(() => import('src/pages/invoices/index')),
};

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const invoicesRoutes = [
  {
    path: 'invoices',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [{
      element: <>
        <Helmet>
          <title> {`${CONFIG.site.name}`}</title>
        </Helmet>
        <InvoicesPages.Index /></>, index: true
    }],
  },
];
