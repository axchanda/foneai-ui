/* eslint-disable spaced-comment */
import { z as zod } from 'zod';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import API from 'src/utils/API';
import type { IBotType } from 'src/types/bot';
import { Button } from '@mui/material';
import { deleteBot } from 'src/utils/api/bots';

// ----------------------------------------------------------------------

const voices = {
  English: ['Joanna', 'Mark', 'Joe'],
  Spanish: ['Manuel', 'Marco', 'Andrea'],
};

export type NewBotSchemaType = zod.infer<typeof NewBotSchema>;

export const NewBotSchema = zod.object({
  botName: zod.string().min(1, { message: 'Bot name is required!' }),
  promptInstructions: zod.string(),
  language: zod.enum(['English', 'Spanish'], { required_error: 'Language is required!' }),
  voice: zod.string().min(1, { message: 'Voice is required!' }),
  interruptable: zod.boolean(),
  endpointing: zod.number().min(0, { message: 'Endpointing must be a positive number!' }),
  timezone: zod.string().min(1, { message: 'Timezone is required!' }),
  daylightSavings: zod.boolean(),
});

type Props = {
  currentBot?: IBotType;
};

export function BotNewEditForm({ currentBot }: Props) {
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      botName: currentBot?.name || '',
      promptInstructions: currentBot?.promptInstructions || '',
      language: currentBot?.language || 'English',
      voice: currentBot?.voice?.voiceId || '',
      interruptable: currentBot?.interruptable || false,
      endpointing: currentBot?.endpointing || 0,
      timezone: currentBot?.timezone || '',
      daylightSavings: currentBot?.daylightSavings || false,
    }),
    [currentBot]
  );

  const methods = useForm<NewBotSchemaType>({
    mode: 'all',
    resolver: zodResolver(NewBotSchema),
    //@ts-ignore
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    resetField,
    setValue,
    watch,
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentBot) {
      //@ts-ignore
      reset(defaultValues);
    }
  }, [currentBot, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const url = currentBot ? `/bots/${currentBot._id}` : '/bots/create';
      const method = currentBot ? API.put : API.post;
      await method(url, {
        name: data.botName,
        promptInstructions: data.promptInstructions,
        language: data.language,
        voiceProvider: '',
        voiceId: data.voice,
        interruptable: data.interruptable,
        endpointing: data.endpointing,
        timezone: data.timezone,
        daylightSavings: data.daylightSavings,
      });
      reset();
      toast.success(currentBot ? 'Update success!' : 'Create success!');
      router.push('/bots');
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = (
    <Card>
      <CardHeader title="Details" subheader="Bot name, prompt instructions..." sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Bot Name</Typography>
          <Field.Text name="botName" placeholder="Ex: Sales bot..." />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Prompt Instructions</Typography>
          <Field.TextareaWithMaximize
            // height={200}
            // showToolbar={false}
            // rows={6}
            name="promptInstructions"
            placeholder="Enter detailed instructions..."
          />
        </Stack>
      </Stack>
    </Card>
  );

  const renderProperties = (
    <Card>
      <CardHeader
        title="Speech settings"
        subheader="Additional functions and attributes..."
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1}>
          <Typography variant="subtitle2">Language</Typography>
          <Field.RadioGroup
            row
            onChange={(e) => {
              setValue('language', e.target.value as 'English' | 'Spanish');
              resetField('voice');
              // voiceRef.current?.focus();
            }}
            name="language"
            options={[
              {
                label: 'English',
                value: 'English',
              },
              {
                label: 'Spanish',
                value: 'Spanish',
              },
            ]}
            sx={{ gap: 4 }}
          />
        </Stack>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Voice</Typography>
          <Field.Autocomplete
            name="voice"
            options={voices[values.language || 'English']}
            placeholder="Select a voice"
            defaultValue=""
          />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Interruptable</Typography>
          <Field.Switch
            name="interruptable"
            label={
              values.interruptable
                ? 'The speech get interrupted'
                : 'The speech does not get interrupted'
            }
          />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Endpointing</Typography>
          <Field.Text
            name="endpointing"
            placeholder="Enter endpointing value"
            type="number"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>ms</Box>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Stack>
    </Card>
  );
  const renderMisc = (
    <Card>
      <CardHeader title="Misc." subheader="Miscellaneous settings" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Timezone</Typography>
          <Field.TimezoneSelect name="timezone" placeholder="Select a timezone" />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Daylight Savings</Typography>
          <Field.Switch name="daylightSavings" label="Daylight Savings" />
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
      {currentBot && (
        <Button
          onClick={async () => {
            await deleteBot(currentBot._id, () => {
              router.push('/bots');
            });
          }}
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
        {!currentBot ? 'Create Bot' : 'Update Bot'}
      </LoadingButton>
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderDetails}

        {renderProperties}
        {renderMisc}
        {renderActions}
      </Stack>
    </Form>
  );
}
