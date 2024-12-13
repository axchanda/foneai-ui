import React from 'react';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DashboardContent } from 'src/layouts/dashboard';
import { SubscribersNewEditForm } from 'src/sections/subscribers/subscribers-new-edit-form';

const CreateSubscriber: React.FC = () => {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create Subscriber"
        // links={[
        //   { name: 'Dashboard', href: paths.dashboard.root },
        //   { name: 'Job', href: paths.dashboard.job.root },
        //   { name: job?.title },
        // ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <SubscribersNewEditForm />
    </DashboardContent>
  );
};

export default CreateSubscriber;
