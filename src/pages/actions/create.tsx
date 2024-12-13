import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ActionsNewEditForm } from 'src/sections/actions/actions-new-edit-form';

// ----------------------------------------------------------------------

function ActionsCreate() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new action"
        // links={[
        //   { name: 'Dashboard', href: paths.dashboard.root },
        //   { name: 'Job', href: paths.dashboard.job.root },
        //   { name: 'New job' },
        // ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ActionsNewEditForm />
    </DashboardContent>
  );
}

export default ActionsCreate;
