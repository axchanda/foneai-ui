import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { WebhookNewEditForm } from 'src/sections/webhooks/webhook-new-edit-form';

// ----------------------------------------------------------------------

export default function WebhookCreate() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new webhook"
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <WebhookNewEditForm />
    </DashboardContent>
  );
}
