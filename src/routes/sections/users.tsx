import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

/** **************************************
 * Jwt
 *************************************** */
const UsersPages = {
  UserListPage: lazy(() => import('src/pages/dashboard/user/list')),
  UserCreatePage: lazy(() => import('src/pages/dashboard/user/new')),
  UserEditPage: lazy(() => import('src/pages/dashboard/user/edit')),
};

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const usersRoutes = [
  {
    path: 'users',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <>{layoutContent}</>,
    children: [
      { element: <UsersPages.UserListPage />, index: true },
      { path: 'create', element: <UsersPages.UserCreatePage /> },
      { path: ':id', element: <UsersPages.UserEditPage /> },
    ],
  },
];
