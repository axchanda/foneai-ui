import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { JobNewEditForm } from '../../sections/job/job-new-edit-form';

// ----------------------------------------------------------------------

export function BotsCreate() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new bot"
        // links={[
        //   { name: 'Dashboard', href: paths.dashboard.root },
        //   { name: 'Job', href: paths.dashboard.job.root },
        //   { name: 'New job' },
        // ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <JobNewEditForm />
    </DashboardContent>
  );
}
