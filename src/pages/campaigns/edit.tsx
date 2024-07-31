import type { IUserItem } from 'src/types/user';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CampaignNewEditForm } from 'src/sections/campaigns/campaign-new-edit-form';
import { useParams } from 'react-router';
import { useCallback, useEffect, useState } from 'react';
import API from 'src/utils/API';
import type { ICampaignType } from 'src/types/campaign';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

type Props = {
  user?: IUserItem;
};

export default function CampaignEdit({ user: currentUser }: Props) {
  const [loaded, setLoaded] = useState(false);
  const { id } = useParams();
  const [campaign, setCampaign] = useState<ICampaignType | null>(null);

  const getCampaigns = useCallback(async () => {
    const { data } = await API.get<ICampaignType>('/campaigns/' + id);
    setCampaign(data);
    setLoaded(true);
  }, [id]);

  useEffect(() => {
    getCampaigns();
  }, [getCampaigns]);

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
      {loaded ? <CampaignNewEditForm currentCampaign={campaign || undefined} /> : <LoadingScreen />}
    </DashboardContent>
  );
}
