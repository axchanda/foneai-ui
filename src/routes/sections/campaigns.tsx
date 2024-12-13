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
const CampaignsPages = {
    CampaignsPage: lazy(() => import('src/pages/campaigns/index')),
    CampaignCreate: lazy(() => import('src/pages/campaigns/create')),
    CampaignEdit: lazy(() => import('src/pages/campaigns/edit'))
};

const layoutContent = (
    <DashboardLayout>
        <Suspense fallback={<LoadingScreen />}>
            <Outlet />
        </Suspense>
    </DashboardLayout>
);

export const campaignsRoutes = [
    {
        path: 'campaigns',
        element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
        children: [
            {
                element: <>
                    <Helmet>
                        <title> {`${CONFIG.site.name}`}</title>
                    </Helmet>
                    <CampaignsPages.CampaignsPage /></>, index: true
            },
            {
                path: 'create', element: <>
                    <Helmet>
                        <title> {`${CONFIG.site.name}`}</title>
                    </Helmet>
                    <CampaignsPages.CampaignCreate /></>
            },
            {
                path: ':id/edit', element: <>
                    <Helmet>
                        <title> {`${CONFIG.site.name}`}</title>
                    </Helmet><CampaignsPages.CampaignEdit /></>
            }
        ],
    },
];
