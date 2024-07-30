import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CampaignNewEditForm } from 'src/sections/campaigns/campaign-new-edit-form';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

export default function CampaignCreate() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new campaign"
        // links={[
        //   { name: 'Dashboard', href: paths.dashboard.root },
        //   { name: 'User', href: paths.dashboard.user.root },
        //   { name: 'New user' },
        // ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Box width="100%" maxWidth="600px" mx="auto">
        <CampaignNewEditForm />
      </Box>
    </DashboardContent>
  );
}
