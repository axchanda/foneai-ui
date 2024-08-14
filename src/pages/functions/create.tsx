import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { FunctionsNewEditForm } from 'src/sections/functions/functions-new-edit-form';

// ----------------------------------------------------------------------

function FunctionsCreate() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new function"
        // links={[
        //   { name: 'Dashboard', href: paths.dashboard.root },
        //   { name: 'Job', href: paths.dashboard.job.root },
        //   { name: 'New job' },
        // ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <FunctionsNewEditForm />
    </DashboardContent>
  );
}

export default FunctionsCreate;
