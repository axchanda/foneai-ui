import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

/** **************************************
 * Jwt
 *************************************** */
const PaymentsPages = {
  Index: lazy(() => import('src/pages/payments/index')),
};

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const paymentsRoutes = [
  {
    path: 'payments',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <>{layoutContent}</>,
    children: [{ element: <PaymentsPages.Index />, index: true }],
  },
];
