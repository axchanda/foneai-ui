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
const CheckoutPages = {
    CheckoutPage: lazy(() => import('src/pages/checkout/index')),
};

const layoutContent = (
    <DashboardLayout>
        <Suspense fallback={<LoadingScreen />}>
            <Outlet />
        </Suspense>
    </DashboardLayout>
);

export const checkoutRoutes = [
    {
        path: 'checkout',
        element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
        children: [
            {
                element: <>
                        <Helmet>
                            <title> {`${CONFIG.site.name}`}</title>
                        </Helmet>
                        <CheckoutPages.CheckoutPage />
                    </>
                    , index: true
            }
        ],
    },
];
