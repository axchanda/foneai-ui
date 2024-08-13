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
const KnowledgeBasesPages = {
  KnowledgeBasesPage: lazy(() => import('src/pages/knowledge-bases/index')),
  KnowledgeBaseCreatePage: lazy(() => import('src/pages/knowledge-bases/create')),
  KnowledgeBaseEditPage: lazy(() => import('src/pages/knowledge-bases/edit')),
};

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const knowledgeBasesRoutes = [
  {
    path: 'knowledge-bases',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      {
        element: (
          <>
            <Helmet>
              <title> {`${CONFIG.site.name}`}</title>
            </Helmet>
            <KnowledgeBasesPages.KnowledgeBasesPage />
          </>
        ),
        index: true,
      },
      {
        path: 'create',
        element: (
          <>
            <Helmet>
              <title> {`${CONFIG.site.name}`}</title>
            </Helmet>
            <KnowledgeBasesPages.KnowledgeBaseCreatePage />
          </>
        ),
      },
      {
        path: ':id',
        element: (
          <>
            <Helmet>
              <title> {`${CONFIG.site.name}`}</title>
            </Helmet>
            <KnowledgeBasesPages.KnowledgeBaseEditPage />
          </>
        ),
      },
    ],
  },
];
