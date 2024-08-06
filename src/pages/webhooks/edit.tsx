import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { WebhookNewEditForm } from 'src/sections/webhooks/webhook-new-edit-form';

// ----------------------------------------------------------------------

function BotsEdit() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new webhook"
        // links={[
        //   { name: 'Dashboard', href: paths.dashboard.root },
        //   { name: 'Job', href: paths.dashboard.job.root },
        //   { name: 'New job' },
        // ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <WebhookNewEditForm />
    </DashboardContent>
  );
}

export default BotsEdit;
