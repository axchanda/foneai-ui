/* eslint-disable spaced-comment */
import { z as zod } from 'zod';
import { useMemo, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Field, Form } from 'src/components/hook-form';
import { Button, MenuItem, Typography } from '@mui/material';
import type { IWebhookItem } from 'src/types/webhook';
import API from 'src/utils/API';

export type NewWebhookSchemaType = zod.infer<typeof NewWebhookSchema>;

export const NewWebhookSchema = zod.object({
  webhookName: zod.string().min(1, { message: 'Webhook Name is required!' }),
  webhookURI: zod.string().min(1, { message: 'Webhook URI is required!' }),
  webhookDescription: zod.string(),
  webhookMethod: zod.enum(['GET', 'POST', 'PUT', 'DELETE'], {
    required_error: 'Webhook method is required!',
  }),
  webhookTimeout: zod.number()
    .min(1, { message: 'timeout is required!' })
    .refine((value) => Number.isInteger(value), {
      message: 'Timeout must be a whole number!',
    }),
  webhookRequestsPerMinute: zod
    .number()
    .min(1, { message: 'Requests per minute must be a positive number!' })
    .refine((value) => Number.isInteger(value), {
      message: 'Requests per minute must be a whole number!',
    }),
  // TODO: HEADERS 
});

type Props = {
  currentWebhook?: IWebhookItem;
};

export function WebhookNewEditForm({ currentWebhook }: Props) {
  const router = useRouter();
  const [headers, setHeaders] = useState<
    {
      key: string;
      value: string;
    }[]
  >([]);

  const [key, setKey] = useState('');
  const [value, setValue] = useState('');

  const defaultValues = useMemo(
    () => ({
      webhookName: currentWebhook?.webhookName || '',
      webhookURI: currentWebhook?.webhookURI || '',
      webhookDescription: currentWebhook?.webhookDescription || '',
      webhookMethod: currentWebhook?.webhookMethod || 'GET',
      webhookTimeout: currentWebhook?.webhookTimeout || 60,
      webhookRequestsPerMinute: currentWebhook?.webhookRequestsPerMinute || 10,
    }),
    [currentWebhook]
  );

  const methods = useForm<NewWebhookSchemaType>({
    mode: 'all',
    resolver: zodResolver(NewWebhookSchema),
    //@ts-ignore
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentWebhook) {
      //@ts-ignore
      reset(defaultValues);
    }
  }, [currentWebhook, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const url = currentWebhook ? `/webhooks/${currentWebhook._id}` : '/webhooks/create';
      const method = currentWebhook ? API.put : API.post;
      await method(url, {
        webhookName: data.webhookName,
        webhookURI: data.webhookURI,
        webhookDescription: data.webhookDescription,
        webhookMethod: data.webhookMethod,
        webhookTimeout: data.webhookTimeout,
        webhookRequestsPerMinute: data.webhookRequestsPerMinute,
        // headers,
      });
      reset();
      toast.success(currentWebhook ? 'Update Webhook success!' : 'Create Webhook success!');
      router.push('/webhooks');
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = (
    <Card>
      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Webhook Name</Typography>
          <Field.Text label="Name" name="webhookName" />
        </Stack>

          <Stack sx={{ px: 1 }}
          >
            <Typography variant="subtitle2">Method</Typography>

            <Field.RadioGroup name="webhookMethod"
              sx={{ flexDirection: 'row' }} // Add this to make it horizontal
              options={[
                { label: 'GET', value: 'GET' },
                { label: 'POST', value: 'POST' },
                { label: 'PUT', value: 'PUT' },
                { label: 'DELETE', value: 'DELETE' }
              ]}
            >
            </Field.RadioGroup>
          </Stack>
          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Webhook URI</Typography>

            <Field.Text label="Webhook URI" name="webhookURI" />
          </Stack>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Webhook Description</Typography>

          <Field.Text fullWidth label="description" multiline rows={4} name="webhookDescription" />
        </Stack>
        <Stack spacing={4} direction="row">
          <Stack flex={1} spacing={1.5}>
            <Typography variant="subtitle2">Webhook Timeout</Typography>
            <Field.Text type="number" label="Timeout" name="webhookTimeout" />
          </Stack>
          <Stack flex={1} spacing={1.5}>
            <Typography variant="subtitle2">Requests Per Minute</Typography>
            <Field.Text type="number" label="RPS" name="webhookRequestsPerMinute" />
          </Stack>
        </Stack>
        {/* <Stack spacing={1.5}>
          <Typography variant="subtitle2">Headers</Typography>
          <Stack gap={2.5}>
            <Stack gap={4} direction="row">
              <Field.Text
                label="Key"
                name="key"
                onChange={(e) => setKey(e.target.value)}
                value={key}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && key && value) {
                    setHeaders([...headers, { key, value }]);
                    setKey('');
                    setValue('');
                  }
                }}
              />
              <Field.Text
                label="Value"
                name="value"
                onChange={(e) => setValue(e.target.value)}
                value={value}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && key && value) {
                    setHeaders([...headers, { key, value }]);
                    setKey('');
                    setValue('');
                  }
                }}
              />
              <IconButton disabled={Boolean(key) || Boolean(value)}>
                <Iconify icon="gg:add" />
              </IconButton> 
            </Stack>
            {headers.map((header, index) => (
              <Stack gap={4} direction="row" key={index}>
                <Field.Text name="" value={header.key} disabled label="Key" />
                <Field.Text name="" label="Value" value={header.value} disabled />
              </Stack>
            ))}
          </Stack>
        </Stack> */}
      </Stack>
    </Card>
  );

  const renderActions = (
    <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap">
      <LoadingButton
        type="submit"
        variant="contained"
        size="large"
        loading={isSubmitting}
        sx={{ 
          mr: 2,
          // make the button to appear on the right side
          marginLeft: 'auto',
        }}
      >
        {!currentWebhook ? 'Create Webhook' : 'Update Webhook'}
      </LoadingButton>
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderDetails}

        {renderActions}
      </Stack>
    </Form>
  );
}
