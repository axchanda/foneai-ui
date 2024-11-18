import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { Box } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { IAgentListType } from 'src/types/agent';
import API from 'src/utils/API';
import type { ICampaignType } from 'src/types/campaign';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  campaignName: zod.string().min(3, { message: 'Campaign Name must be at least 3 characters' }),
  campaignDescription: zod.string(),
  linkedAppId: zod.string(),
});

// ----------------------------------------------------------------------

type Props = {
  currentCampaign?: ICampaignType;
};

export function CampaignNewEditForm({ currentCampaign }: Props) {
  const router = useRouter();

  const [loaded, setLoaded] = useState(false);

  const [agents, setAgents] = useState<{ label: string; value: string }[]>([]);

  const getAgents = useCallback(async () => {
    const { data } = await API.get<{
      agents: IAgentListType[];
      count: number;
    }>('/agentsList');
    const agentOptions = data.agents.map((agent) => ({ label: agent.name, value: agent._id }));
    setAgents(agentOptions);
    setLoaded(true);
  }, []);

  useEffect(() => {
    getAgents();
  }, [getAgents]);
  
  const defaultValues = useMemo(
    () => ({
      campaignName: currentCampaign?.campaignName || '',
      campaignDescription: currentCampaign?.description || '',
      linkedAppId: currentCampaign?.linkedAppId || '',
    }),
    [currentCampaign]
  );

  const methods = useForm<NewUserSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    watch,
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const method = currentCampaign ? API.put : API.post;
      const url = currentCampaign
        ? `/campaigns/${currentCampaign._id}/updateCampaign`
        : '/campaigns';

      await method(url, data);
      reset();
      toast.success(currentCampaign ? 'Update success!' : 'Create success!');
      router.push('/campaigns');
      // console.info('DATA', data);
    } catch (error) {
      // console.error(error);
      const messages = Object.values(error.response.data.errors || {}) as string[];
      messages.forEach((m: string) => {
        toast.error(m);
      });
    }
  });

  // console.log({ defaultValues });

  return (
    <>
      {!loaded ? (
        <LoadingScreen />
      ) : (
        <Form methods={methods} onSubmit={onSubmit}>
          <Stack
            spacing={{ xs: 3, md: 5 }}
            sx={{ mx: 'auto', maxWidth: { xs: 720, xl: '1100px' } }}
          >
            <Card sx={{ p: 3 }}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)' }}
              >
                <Field.Text name="campaignName" label="Campaign name" />
                <Field.Text
                  multiline
                  rows={7}
                  name="campaignDescription"
                  placeholder="Campaign Description"
                />

                <Field.Autocomplete
                  fullWidth
                  name="linkedAppId"
                  label="Linked Agent"
                  placeholder="Choose a agent to link"
                  autoHighlight
                  options={agents}
                  onChange={(event, newValue) => {
                    setValue('linkedAppId', newValue.value);
                  }}
                  value={agents.find((agent) => agent.value === values.linkedAppId)?.label}
                />
              </Box>

              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {!currentCampaign ? 'Create campaign' : 'Update campaign'}
                </LoadingButton>
              </Stack>
            </Card>
          </Stack>
        </Form>
      )}
    </>
  );
}
