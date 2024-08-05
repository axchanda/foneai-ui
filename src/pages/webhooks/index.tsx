import { Button } from '@mui/material';
import React from 'react';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import { RouterLink } from 'src/routes/components';
import WebhookTable from 'src/sections/webhooks/webhook-table';
import type { IWebhookItem } from 'src/types/webhook';

const webhooks: IWebhookItem[] = [
  {
    _id: '1',
    name: 'Webhook 1',
    description: 'Webhook 1 description',
    restMethod: 'GET',
    URL: 'https://webhook1.com/api/v1/getUsers/:id',
    headers: [],
    timeout: 1000,
  },
  {
    _id: '2',
    name: 'Webhook 2',
    description: 'Webhook 2 description',
    restMethod: 'POST',
    URL: 'https://webhook1.com/api/v1/leads/postLead',
    headers: [],
    timeout: 1000,
  },
  {
    _id: '3',
    name: 'Webhook 3',
    description: 'Webhook 3 description',
    restMethod: 'PUT',
    URL: 'https://webhook1.com/api/v1/leads/:id/update',
    headers: [],
    timeout: 1000,
  },
];

const Webhooks: React.FC = () => {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Webhooks"
        action={
          <Button
            component={RouterLink}
            // href="/bots/create"
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
