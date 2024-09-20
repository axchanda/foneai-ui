import React from 'react';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DashboardContent } from 'src/layouts/dashboard';
import { PlansNewEditForm } from 'src/sections/plans/plans-new-edit-form';

const Plans: React.FC = () => {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create Plan"
        // links={[
        //   { name: 'Dashboard', href: paths.dashboard.root },
        //   { name: 'Job', href: paths.dashboard.job.root },
        //   { name: job?.title },
        // ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <PlansNewEditForm />
    </DashboardContent>
  );
};

export default Plans;
