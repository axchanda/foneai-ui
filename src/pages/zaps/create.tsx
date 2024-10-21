import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ZapsNewEditForm } from 'src/sections/zaps/zaps-new-edit-form';

// ----------------------------------------------------------------------

function ZapsCreate() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new zap"
        // links={[
        //   { name: 'Dashboard', href: paths.dashboard.root },
        //   { name: 'Job', href: paths.dashboard.job.root },
        //   { name: 'New job' },
        // ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ZapsNewEditForm />
    </DashboardContent>
  );
}

export default ZapsCreate;
