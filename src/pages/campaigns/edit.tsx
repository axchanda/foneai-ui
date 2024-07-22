import type { IUserItem } from 'src/types/user';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserNewEditForm } from '../../sections/user/user-new-edit-form';

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

            <UserNewEditForm currentUser={currentUser} />
        </DashboardContent>
    );
}
