import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthSplitLayout } from 'src/layouts/auth-split';

import { SplashScreen } from 'src/components/loading-screen';

import { GuestGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

/** **************************************
 * Jwt
 *************************************** */
const Jwt = {
  SignInPage: lazy(() => import('src/pages/auth/jwt/sign-in')),
  SignUpPage: lazy(() => import('src/pages/auth/jwt/sign-up')),
  ForgotPassword: lazy(() => import('src/pages/auth/jwt/forgot-password')),
  UpdatePassword: lazy(() => import('src/pages/auth/jwt/update-password')),
};

const authJwt = {
  path: '',
  children: [
    {
      path: 'login',
      element: (
        <GuestGuard>
          <AuthSplitLayout section={{ title: 'Hello there 👋' }}>
            <Jwt.SignInPage />
          </AuthSplitLayout>
        </GuestGuard>
      ),
    },
    {
      path: 'signup',
      element: (
        <GuestGuard>
          <AuthSplitLayout>
            <Jwt.SignUpPage />
          </AuthSplitLayout>
        </GuestGuard>
      ),
    },
    {
      path: 'forgot-password',
      element: (
        <GuestGuard>
          <AuthSplitLayout>
            <Jwt.ForgotPassword />
          </AuthSplitLayout>
        </GuestGuard>
      ),
    },
    {
      path: 'update-password',
      element: (
        <GuestGuard>
          <AuthSplitLayout>
            <Jwt.UpdatePassword />
          </AuthSplitLayout>
        </GuestGuard>
      ),
    },
  ],
};

export const authRoutes = [
  {
    path: 'auth',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [authJwt],
  },
];
