import { Route, Routes, Navigate } from 'react-router-dom';

import { Bots } from 'src/pages/bots';
import { BotEdit } from 'src/pages/bots/edit';
import { Payments } from 'src/pages/payments';
import { BotsCreate } from 'src/pages/bots/create';
import { DashboardLayout } from 'src/layouts/dashboard';

import { UserEditView, UserListView, UserCreateView } from 'src/sections/user/view';

import Dashboard from '../../pages/dashboard';

export const Router = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route
      path="/dashboard"
      element={
        <DashboardLayout>
          <Dashboard />
        </DashboardLayout>
      }
    />
    <Route
      path="/"
      element={
        <DashboardLayout>
          <Dashboard />
        </DashboardLayout>
      }
    />
    <Route path="bots">
      <Route
        path=""
        index
        element={
          <DashboardLayout>
            <Bots />
          </DashboardLayout>
        }
      />

      <Route
        path="create"
        element={
          <DashboardLayout>
            <BotsCreate />
          </DashboardLayout>
        }
      />
      <Route
        path=":id"
        element={
          <DashboardLayout>
            <BotEdit />
          </DashboardLayout>
        }
      />
    </Route>
    <Route path="users">
      <Route
        path=""
        index
        element={
          <DashboardLayout>
            <UserListView />
          </DashboardLayout>
        }
      />

      <Route
        path="new"
        element={
          <DashboardLayout>
            <UserCreateView />
          </DashboardLayout>
        }
      />
      <Route
        path=":id/edit"
        element={
          <DashboardLayout>
            <UserEditView />
          </DashboardLayout>
        }
      />
    </Route>

    <Route path="payments">
      <Route
        path=""
        index
        element={
          <DashboardLayout>
            <Payments />
          </DashboardLayout>
        }
      />
    </Route>
  </Routes>
);
