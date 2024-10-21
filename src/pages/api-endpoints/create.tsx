import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ApiEndpointNewEditForm } from 'src/sections/api-endpoints/apiEndpoint-new-edit-form';

// ----------------------------------------------------------------------

export default function ApiEndpointCreate() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Define a new API Endpoint"
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <ApiEndpointNewEditForm />
    </DashboardContent>
  );
}
