import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';
import { ComingSoonView } from 'src/sections/coming-soon/view';

const AsteriskPage = lazy(() => import('src/pages/integrations/asterisk-ari'));

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const integrationsRoutes = [
  {
    path: '/integrations/asterisk-ari',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [{ element: <AsteriskPage />, index: true }],
  },
  {
    path: '/integrations/sip-uri',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [{ element: <ComingSoonView/>, index: true }],
  },
  {
    path: '/integrations/did-forwarding',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [{ element: <ComingSoonView/>, index: true }],
  },
];
