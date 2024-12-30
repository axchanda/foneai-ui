import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CampaignNewEditForm } from 'src/sections/campaigns/campaign-new-edit-form';
import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export default function CampaignCreate() {
  const { t } = useTranslate();
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t("Create a new campaign")}
        // links={[
        //   { name: 'Dashboard', href: paths.dashboard.root },
        //   { name: 'User', href: paths.dashboard.user.root },
        //   { name: 'New user' },
        // ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <CampaignNewEditForm />
    </DashboardContent>
  );
}
