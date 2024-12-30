import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ApiEndpointNewEditForm } from 'src/sections/api-endpoints/apiEndpoint-new-edit-form';
import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export default function ApiEndpointCreate() {
  const {t} = useTranslate();
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t("Create a new API Definition")}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <ApiEndpointNewEditForm />
    </DashboardContent>
  );
}
