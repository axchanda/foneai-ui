import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CampaignNewEditForm } from 'src/sections/campaigns/campaign-new-edit-form';
import { useParams } from 'react-router';
import { useCallback, useEffect, useState } from 'react';
import API from 'src/utils/API';
import type { ICampaignType } from 'src/types/campaign';
import { LoadingScreen } from 'src/components/loading-screen';
import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

// type Props = {
//   user?: IUserItem;
// };

export default function CampaignEdit() {
  const [loaded, setLoaded] = useState(false);
  const { id } = useParams();
  const [campaign, setCampaign] = useState<ICampaignType | null>(null);
  const { t } = useTranslate();

  const getCampaignById = useCallback(async () => {
    const { data } = await API.get<ICampaignType>('/campaigns/' + id);
    setCampaign(data);
    setLoaded(true);
  }, [id]);

  useEffect(() => {
    getCampaignById();
  }, [getCampaignById]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t("Edit campaign")}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {loaded ? <CampaignNewEditForm currentCampaign={campaign || undefined} /> : <LoadingScreen />}
    </DashboardContent>
  );
}
