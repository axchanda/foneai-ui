import type { IUserItem } from 'src/types/user';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CampaignNewEditForm } from 'src/sections/campaigns/campaign-new-edit-form';
import { useParams } from 'react-router';
import { useCallback, useEffect, useState } from 'react';
import API from 'src/utils/API';
import type { ICampaignType } from 'src/types/campaign';
import { LoadingScreen } from 'src/components/loading-screen';
import { IWebhookItem } from 'src/types/webhook';
import { WebhookNewEditForm } from 'src/sections/webhooks/webhook-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  webhook?: IWebhookItem;
};

export default function WebhookEdit({ webhook: currentWebhook }: Props) {
  const [loaded, setLoaded] = useState(false);
  
  const { id } = useParams();
  const [webhook, setWebhook] = useState<IWebhookItem | null>(null);

  const getWebhookById = useCallback(async () => {
    const { data } = await API.get<IWebhookItem>('/webhooks/' + id);
    setWebhook(data);
    setLoaded(true);
  }, [id]);

  useEffect(() => {
    getWebhookById();
  }, [getWebhookById]);


  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Webhook"
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {loaded ? 
        <WebhookNewEditForm currentWebhook={webhook || undefined} /> : <LoadingScreen />}
    </DashboardContent>
  );
}
