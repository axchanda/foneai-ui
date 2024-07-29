import type { IUserItem } from 'src/types/user';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserNewEditForm } from '../../sections/user/user-new-edit-form';
import { CampaignNewEditForm } from 'src/sections/campaigns/campaign-new-edit-form';
import { Box, Stack } from '@mui/material';

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
            <Box className='test' width={'100%'} maxWidth={'880px'} mx={'auto'}>

                <CampaignNewEditForm currentUser={currentUser} />
            </Box>
        </DashboardContent>
    );
}
