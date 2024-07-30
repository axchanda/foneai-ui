import type { IUserItem } from 'src/types/user';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CampaignNewEditForm } from 'src/sections/campaigns/campaign-new-edit-form';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  user?: IUserItem;
};

export default function CampaignEdit({ user: currentUser }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Campaign"
        // links={[
        //   { name: 'Dashboard', href: paths.dashboard.root },
        //   { name: 'User', href: paths.dashboard.user.root },
        //   { name: currentUser?.name },
        // ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Box className="test" width="100%" maxWidth="720px" mx="auto">
        <CampaignNewEditForm currentUser={currentUser} />
      </Box>
    </DashboardContent>
  );
}
