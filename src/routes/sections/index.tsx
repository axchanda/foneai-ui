// import { Route, Routes, Navigate } from 'react-router-dom';

// import { Bots } from 'src/pages/bots';
// import { BotEdit } from 'src/pages/bots/edit';
// import { Payments } from 'src/pages/payments';
// import { BotsCreate } from 'src/pages/bots/create';
// import { DashboardLayout } from 'src/layouts/dashboard';
// import { AuthSplitLayout } from 'src/layouts/auth-split';

// import { JwtSignInView, JwtSignUpView } from 'src/sections/auth/jwt';
// import { UserEditView, UserListView, UserCreateView } from 'src/sections/user/view';

// import { AuthGuard, GuestGuard } from 'src/auth/guard';

// import Dashboard from '../../pages/dashboard';

// export const Router = () => (
//   <Routes>
//     <Route path="/" element={<Navigate to="/dashboard" replace />} />
//     <Route
//       path="/dashboard"
//       element={
//         <AuthGuard>
//           <DashboardLayout>
//             <Dashboard />
//           </DashboardLayout>
//         </AuthGuard>
//       }
//     />
//     <Route
//       path="/"
//       element={
//         <DashboardLayout>
//           <Dashboard />
//         </DashboardLayout>
//       }
//     />
//     <Route path="bots">
//       <Route
//         path=""
//         index
//         element={
//           <AuthGuard>
//             <DashboardLayout>
//               <Bots />
//             </DashboardLayout>
//           </AuthGuard>
//         }
//       />

//       <Route
//         path="create"
//         element={
//           <AuthGuard>
//             <DashboardLayout>
//               <BotsCreate />
//             </DashboardLayout>
//           </AuthGuard>
//         }
//       />
//       <Route
//         path=":id"
//         element={
//           <AuthGuard>
//             <DashboardLayout>
//               <BotEdit />
//             </DashboardLayout>
//           </AuthGuard>
//         }
//       />
//     </Route>
//     <Route path="users">
//       <Route
//         path=""
//         index
//         element={
//           <AuthGuard>
//             <DashboardLayout>
//               <UserListView />
//             </DashboardLayout>
//           </AuthGuard>
//         }
//       />

//       <Route
//         path="new"
//         element={
//           <AuthGuard>
//             <DashboardLayout>
//               <UserCreateView />
//             </DashboardLayout>
//           </AuthGuard>
//         }
//       />
//       <Route
//         path=":id/edit"
//         element={
//           <AuthGuard>
//             <DashboardLayout>
//               <UserEditView />
//             </DashboardLayout>
//           </AuthGuard>
//         }
//       />
//     </Route>
//     <Route path="payments">
//       <Route
//         path=""
//         index
//         element={
//           <AuthGuard>
//             <DashboardLayout>
//               <Payments />
//             </DashboardLayout>
//           </AuthGuard>
//         }
//       />
//     </Route>
//     <Route
//       path="login"
//       element={
//         <GuestGuard>
//           <AuthSplitLayout section={{ title: 'Hi, Welcome back' }}>
//             <JwtSignInView />
//           </AuthSplitLayout>
//         </GuestGuard>
//       }
//     />
//     <Route path="auth">
//       <Route
//         path="login"
//         element={
//           <GuestGuard>
//             <AuthSplitLayout section={{ title: 'Hi, Welcome back' }}>
//               <JwtSignInView />
//             </AuthSplitLayout>
//           </GuestGuard>
//         }
//       />
//       <Route
//         path="signup"
//         element={
//           <GuestGuard>
//             <AuthSplitLayout section={{ title: 'Hi, Welcome back' }}>
//               <JwtSignUpView />
//             </AuthSplitLayout>
//           </GuestGuard>
//         }
//       />
//     </Route>
//   </Routes>
// );

import { Suspense } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import { SplashScreen } from 'src/components/loading-screen';

import { authRoutes } from './auth';
import { botsRoutes } from './bots';
import { usersRoutes } from './users';
import { paymentsRoutes } from './payments';
import { dashboardRoutes } from './dashboard';

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

    // No match
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
