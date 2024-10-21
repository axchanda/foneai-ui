import { Suspense } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import { SplashScreen } from 'src/components/loading-screen';

import { authRoutes } from './auth';
import { botsRoutes } from './bots';
import { usersRoutes } from './users';
import { invoicesRoutes } from './invoices';
import { dashboardRoutes } from './dashboard';
import { userRoutes } from './user';
import { campaignsRoutes } from './campaigns';
import { mainRoutes } from './main';
import { setupRoutes } from './asterisk-setup';
import { apiEndpointsRoutes } from './api-endpoints';
import { knowledgeBasesRoutes } from './knowledge-base';
import { zapsRoutes } from './zaps';
import { billingRoutes } from './billing';
import { plansRoutes } from './plans';
import { subscribersRoutes } from './subscribers';

export function Router() {
  return useRoutes([
    {
      path: '/',

      element: (
        <Suspense fallback={<SplashScreen />}>
          <Navigate to="/dashboard" replace />
        </Suspense>
      ),
    },

    // Bots
    ...botsRoutes,

    // Auth
    ...authRoutes,

    // Dashboard
    ...dashboardRoutes,

    // Users
    ...usersRoutes,

    // Payments
    ...invoicesRoutes,

    // Campaigns
    ...campaignsRoutes,

    ...userRoutes,

    ...mainRoutes,

    ...setupRoutes,

    ...apiEndpointsRoutes,

    ...knowledgeBasesRoutes,

    ...zapsRoutes,
    ...billingRoutes,
    ...plansRoutes,
    ...subscribersRoutes,
    // No match
    { path: '*', element: <Navigate to="/page-not-found" replace /> },
  ]);
}
