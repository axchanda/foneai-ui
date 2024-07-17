

import { Suspense } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import { SplashScreen } from 'src/components/loading-screen';

import { authRoutes } from './auth';
import { botsRoutes } from './bots';
import { usersRoutes } from './users';
import { paymentsRoutes } from './payments';
import { dashboardRoutes } from './dashboard';
import { userRoutes } from './user';
import { campaignsRoutes } from './campaigns';

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
    ...paymentsRoutes,

    // Campaigns
    ...campaignsRoutes,

    ...userRoutes,

    // No match
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
