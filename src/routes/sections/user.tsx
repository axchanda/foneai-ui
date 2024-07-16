import { Navigate, Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';
import { AuthGuard } from 'src/auth/guard';


const UserPages = {
    AccountPage: lazy(() => import('src/pages/dashboard/user/account')),

};

const layoutContent = (
    <DashboardLayout>
        <Suspense fallback={<LoadingScreen />}>
            <Outlet />
        </Suspense>
    </DashboardLayout>
);

export const userRoutes = [
    {
        path: 'user',
        element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
        children: [
            { element: <Navigate to={'account'} replace />, index: true },
            { path: 'account', element: <UserPages.AccountPage /> },
        ],
    },
];
