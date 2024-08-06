import { Button } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import { RouterLink } from 'src/routes/components';
import WebhookTable from 'src/sections/webhooks/webhook-table';
import type { IWebhookItem } from 'src/types/webhook';
import API from 'src/utils/API';

// const webhooks: IWebhookItem[] = [
//   {
//     _id: '1',
//     name: 'Webhook 1',
//     description: 'Webhook 1 description',
//     restMethod: 'GET',
//     URL: 'https://webhook1.com/api/v1/getUsers/:id',
//     headers: [],
//     timeout: 1000,
//     requestsPerMinute: 30,
//   },
//   {
//     _id: '2',
//     name: 'Webhook 2',
//     description: 'Webhook 2 description',
//     restMethod: 'POST',
//     URL: 'https://webhook1.com/api/v1/leads/postLead',
//     headers: [],
//     timeout: 1000,
//     requestsPerMinute: 30,
//   },
//   {
//     _id: '3',
//     name: 'Webhook 3',
//     description: 'Webhook 3 description',
//     restMethod: 'PUT',
//     URL: 'https://webhook1.com/api/v1/leads/:id/update',
//     headers: [],
//     timeout: 1000,
//     requestsPerMinute: 30,
//   },
// ];

const Webhooks: React.FC = () => {
  const [webhooks, setWebhooks] = useState<IWebhookItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  const getWebhooks = useCallback(async () => {
    const { data } = await API.get<IWebhookItem[]>('/webhooks');
    console.log(data);
    setWebhooks(data);
    setLoaded(true);
  }, []);

  useEffect(() => {
    getWebhooks();
  }, [getWebhooks]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Webhooks"
        action={
          <Button
            component={RouterLink}
            href="/webhooks/create"
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New webhook
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <WebhookTable webhooks={webhooks} />
    </DashboardContent>
  );
};

export default Webhooks;
