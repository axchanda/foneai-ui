import type { IJobItem } from 'src/types/job';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { JobNewEditForm } from '../../sections/job/job-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  job?: IJobItem;
};

export function BotEdit({ job }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit bot"
        // links={[
        //   { name: 'Dashboard', href: paths.dashboard.root },
        //   { name: 'Job', href: paths.dashboard.job.root },
        //   { name: job?.title },
        // ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <JobNewEditForm currentJob={job} />
    </DashboardContent>
  );
}
