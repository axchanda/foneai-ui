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

// ----------------------------------------------------------------------

const voices = {
  English: ['Joanna', 'Mark', 'Joe'],
  Spanish: ['Manuel', 'Marco', 'Andrea'],
};

export type NewWebhookSchemaType = zod.infer<typeof NewWebhookSchema>;

export const NewWebhookSchema = zod.object({
  name: zod.string().min(1, { message: 'Webhook name is required!' }),
  url: zod.string().min(1, { message: 'url is required!' }),
  description: zod.string(),
  restMethod: zod.enum(['GET', 'POST', 'PUT', 'DELETE'], {
    required_error: 'Rest method is required!',
  }),
  timeout: zod.number().min(1, { message: 'timeout is required!' }),
  requestsPerMinute: zod
    .number()
    .min(1, { message: 'Requests per minute must be a positive number!' }),
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
      name: currentWebhook?.name || '',
      url: currentWebhook?.URL || '',
      description: currentWebhook?.description || '',
      restMethod: currentWebhook?.restMethod || 'GET',
      timeout: currentWebhook?.timeout || 0,
      requestsPerMinute: currentWebhook?.requestsPerMinute || 0,
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
        name: data.name,
        URL: data.url,
        description: data.description,
        restMethod: data.restMethod,
        timeout: data.timeout,
        requestsPerMinute: data.requestsPerMinute,
        headers,
      });
      reset();
      toast.success(currentWebhook ? 'Update success!' : 'Create success!');
      router.push('/webhooks');
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = (
    <Card>
      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Webhook Name</Typography>
          <Field.Text label="Name" name="name" />
        </Stack>

        <Box display="grid" gridTemplateColumns="150px 1fr" gap={2}>
          <Stack
            sx={{
              alignSelf: 'start',
            }}
            spacing={1.5}
          >
            <Typography variant="subtitle2">Method</Typography>

            <Field.Select name="restMethod">
              <MenuItem value="GET">GET</MenuItem>
              <MenuItem value="POST">POST</MenuItem>
              <MenuItem value="PUT">PUT</MenuItem>
              <MenuItem value="DELETE">DELETE</MenuItem>
            </Field.Select>
          </Stack>
          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Webhook URL</Typography>

            <Field.Text label="URL" name="url" />
          </Stack>
        </Box>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Webhook Description</Typography>

          <Field.Text fullWidth label="description" multiline rows={4} name="description" />
        </Stack>
        <Stack spacing={4} direction="row">
          <Stack flex={1} spacing={1.5}>
            <Typography variant="subtitle2">Webhook Timeout</Typography>
            <Field.Text type="number" label="Timeout" name="timeout" />
          </Stack>
          <Stack flex={1} spacing={1.5}>
            <Typography variant="subtitle2">Requests Per Minute</Typography>
            <Field.Text type="number" label="RPS" name="requestsPerMinute" />
          </Stack>
        </Stack>
        <Stack spacing={1.5}>
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
              {/* <IconButton disabled={Boolean(key) || Boolean(value)}>
                <Iconify icon="gg:add" />
              </IconButton> */}
            </Stack>
            {headers.map((header, index) => (
              <Stack gap={4} direction="row" key={index}>
                <Field.Text name="" value={header.key} disabled label="Key" />
                <Field.Text name="" label="Value" value={header.value} disabled />
                {/* <div style={{ minWidth: '36px', width: '36px', height: '1px' }} /> */}
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );

  const renderActions = (
    <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap">
      {/* <FormControlLabel
        control={<Switch defaultChecked inputProps={{ id: 'publish-switch' }} />}
        label="Publish"
        sx={{ flexGrow: 1, pl: 3 }}
      /> */}
      {currentWebhook && (
        <Button
          // onClick={async () => {
          //   await deleteBot(currentBot._id, () => {
          //     router.push('/bots');
          //   });
          // }}
          variant="contained"
          size="large"
          color="error"
        >
          Delete bot
        </Button>
      )}
      <LoadingButton
        type="submit"
        variant="contained"
        size="large"
        loading={isSubmitting}
        sx={{ ml: 2 }}
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
