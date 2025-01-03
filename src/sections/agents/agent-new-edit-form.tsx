/* eslint-disable spaced-comment */
import { z as zod } from 'zod';
import { useMemo, useEffect, useState, useCallback, Fragment } from 'react';
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
import type { IAgentType } from 'src/types/agent';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableRow
} from '@mui/material';
import { useBoolean } from 'src/hooks/use-boolean';
import type { IActionListType } from 'src/types/action';
import { LoadingScreen } from 'src/components/loading-screen';
import { TableHeadCustom, useTable } from 'src/components/table';
import { Iconify } from 'src/components/iconify';
import TriggerAction from 'src/components/agents/trigger-action';
import { Chip } from '@mui/material';
import VoiceDialog from 'src/components/agents/voice-dialog';
import TestDialog from 'src/components/agents/test-dialog';
import { useTranslate } from 'src/locales';

export type AgentSchemaType = zod.infer<ReturnType<typeof AgentSchema>>;

export const AgentSchema = (t: any) => zod.object({
  name: zod.string().min(1, { message: t('Name is required!') }),
  introduction: zod.string().min(1, { message: t('Introduction is required!') }),
  instructions: zod.string().min(1, { message: t('Prompt is required!') }),
  language: zod.string().min(1, { message: t('Language is required!') }),
  voiceId: zod.string().min(1, { message: t('Voice ID is required!') }),
  isInterruptible: zod.boolean(),
  endpointing: zod
    .number()
    .min(0, { message:  t('Silence Timeout must be greater than 0!') })
    .max(1001, { message: t('Silence Timeout must be less than 1000!') })
    .refine((value) => value % 1 === 0, { message: t('Silence Timeout must be an integer!') }),
  timezone: zod.string().min(1, { message: t('Timezone is required!') }),
  daylightSavings: zod.boolean(),
});

type Props = {
  currentAgent?: IAgentType;
};

export function AgentNewEditForm({ currentAgent }: Props) {
  const router = useRouter();
  const {t} = useTranslate();
  const defaultValues: AgentSchemaType = useMemo(
    () => ({
      name: currentAgent?.name || '',
      introduction: currentAgent?.introduction || '',
      instructions: currentAgent?.instructions || '',
      language: currentAgent?.language || 'en',
      voiceId: currentAgent?.voice?.voiceId || '',
      isInterruptible: currentAgent?.isInterruptible || false,
      endpointing: currentAgent?.endpointing || 500,
      timezone: currentAgent?.timezone || ' UTC-05:00',
      daylightSavings: currentAgent?.daylightSavings || false 
    }),
    [currentAgent]
  );

  const schema = AgentSchema(t);
  const methods = useForm<AgentSchemaType>({
    mode: 'all',
    resolver: zodResolver(schema),
    //@ts-ignore
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
    resetField,
    setValue,
    watch,
  } = methods;

  const values = watch();

  const [loaded, setLoaded] = useState(false);
  // this actions is the list of actions that are available for the user
  const [actions, setActions] = useState<IActionListType>([]);
  const [keywords, setKeywords] = useState<string[]>(currentAgent?.keywords || []);
  // this actionTriggers is the list of actions that are triggered by the agent
  const [actionTriggers, setActionTriggers] = useState<{ actionId: string; trigger: string }[]>(
    currentAgent?.actions || []
  );
  const [selectedVoice, setSelectedVoice] = useState<string | null>(
    currentAgent?.voice?.voiceId || null
  );

  const [openVoiceDialog, setOpenVoiceDialog] = useState(false);
  const [openTestDialog, setOpenTestDialog] = useState(false);

  const getData = useCallback(async () => {
    const {data} = await API.get<any>('/actionsList');
    console.log(data);
    setActions(data.actions);

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (currentAgent) {
      //@ts-ignore
      reset(defaultValues);
    }
  }, [currentAgent, defaultValues, reset]);

  useEffect(() => {
    getData();
  }, [getData]);

  const onSubmit = handleSubmit(async (data) => {
      try {
        const url = currentAgent ? `/agents/${currentAgent._id}` : '/agents/create';
        const method = currentAgent ? API.put : API.post;
        await method(url, {
          name: data.name,
          introduction: data.introduction,
          instructions: data.instructions,
          language: data.language,
          voice: {
            ttsProvider: 'AWS',
            voiceId: data.voiceId,
          },
          isInterruptible: data.isInterruptible,
          endpointing: data.endpointing,
          timezone: data.timezone,
          daylightSavings: data.daylightSavings,
          actions: actionTriggers,
          keywords: keywords          
        });
        reset();
        toast.success(currentAgent ? t('Update success!') : t('Create success!'));
        router.push('/agents');
      } catch (error) {
        const messages = Object.values(error.response.data.errors || {}) as string[];
        messages.forEach((m: string) => {
          toast.error(m);
        });
      }
  });

  const [keyWordInput, setKeyWordInput] = useState('');

  const renderDetails = (
    <Card>
      <CardHeader
        title={t("Details")}
        subheader={t("Agent name, introduction and prompt instructions")}
        sx={{ mb: 3 }}
      />

      <Divider />


      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">
            {t("Agent Name")}
          </Typography>
          <Field.Text name="name" placeholder={t("Eg: My AI agent")} />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">
            {t("Introduction Line")}
          </Typography>
          <Field.Text
            name="introduction"
            placeholder={t("Hi, I'm an AI agent that can assist you ...")}
          />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">
            {t("Prompt Instructions")}
          </Typography>
          <Field.TextareaWithMaximize
            // height={200}
            // showToolbar={false}
            // rows={6}
            name="instructions"
            placeholder={t("Enter the prompt instructions here")}
          />
        </Stack>
      </Stack>
    </Card>
  );

  const renderVoiceCapabilities = (
    <Card>
      <CardHeader
        title={t("Voice Capabilities")}
        subheader={t("Voice settings for the agent")}
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Stack spacing={1.5} direction="row" sx={{ gap: 4, width: '100%' }}>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <Typography variant="subtitle2">
                    {t("Language")}
                  </Typography>
                  <Field.Select
                    onChange={(e) => {
                      setValue('language', e.target.value as string);
                      setValue('voiceId', '');
                      setSelectedVoice(null);
                      // voiceRef.current?.focus();
                    }}
                    defaultValue={values.language}
                    name="language"
                  >
                    <MenuItem value="en">
                      {t("English")}
                    </MenuItem>
                    <MenuItem value="es">
                      {t("Spanish")}
                    </MenuItem>
                    <MenuItem value="ru">
                      {t("Russian")}
                    </MenuItem>
                    <MenuItem value="ar">
                      {t("Arabic")}
                    </MenuItem>
                  </Field.Select>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2">
                      {t("Voice ID")}

                    </Typography>
                    <Button
                      disabled={!values.language}
                      onClick={() => {
                        setOpenVoiceDialog(true);
                      }}
                      sx={{ 
                        minHeight: '55.99px',
                        backgroundColor: selectedVoice ? 'primary.main' : 'background.main',
                      }}
                      variant="contained"
                      size="large"
                    >
                      {values.voiceId || t("Select a voice ID")}
                      <Iconify icon="eva:arrow-ios-downward" />
                    </Button>
                    {/* error message when agentVoiceId is empty */}
                    {errors.voiceId && (
                      <Typography variant="caption" sx={{ color: 'error.main' }}>
                        {errors.voiceId.message}
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              </Grid>
            </Grid>

          </Stack>
        </Stack>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">
                {t("Interruptible")}
              </Typography>
              <Field.Switch
                name="isInterruptible"
                
                label={
                  values.isInterruptible
                    ? t('The agent stops speaking when the user interrupts the agent')
                    : t('The agent continues to speak even when the user interrupts the agent')
                }
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">
                {t("Silence Timeout")}
              </Typography>
              <Field.Text
                name="endpointing"
                type="number"
                sx={{
                  width: {
                    xs: '100%',
                    sm: 200,
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>
                        {t('ms')}
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </Grid>
        </Grid>
        <Grid container spacing={6}>

          <Grid item xs={12} sm={12}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">
                {t("Keywords")}
              </Typography>
              <Field.Text
                name="keywords"
                placeholder={t("Enter upto 20 keywords")}
                type="text"
                sx={{
                  width: {
                    xs: '100%',
                    sm: '100%',
                  },
                }}
                value={keyWordInput}
                disabled={keywords.length > 20}
                onKeyDown={(e: any) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if(keyWordInput.length > 0) {
                      setKeywords([...keywords, keyWordInput]);
                      setKeyWordInput('');
                    }
                  }
                }}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[\p{Script=Latin}\p{Script=Arabic}]+$/u.test(value)) {
                    setKeyWordInput(value);
                  }                  
                }}
              />
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  border: '1px solid',
                  borderColor: (keywords.length > 20) ? 'error.main' : 'background.neutral',
                  minHeight: 100,
                  padding: 1,
                  borderRadius: 1,
                }}
              >
                {keywords.map((keyword, index) => (
                  <Chip
                    key={index}
                    label={keyword}
                    variant='soft'
                    onDelete={() => {
                      const newKeywords = keywords.filter((_, i) => i !== index);
                      setKeywords(newKeywords);
                    }}
                  />
                ))} 
              </Box>
              <Typography variant="caption" sx={{ color: 'error.main' }}>
                {keywords.length > 20 ? t('Keywords limit reached') : ''}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Card>
  );

  const renderMisc = (
    <Card>
      <CardHeader title="Misc." subheader="Miscellaneous settings" sx={{ mb: 3 }} />

      <Divider />

      <Grid spacing={6} container sx={{ p: 3 }}>
        <Grid item xs={12} sm={6}>
          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Timezone</Typography>
            <Field.TimezoneSelect name="timezone" placeholder="Select a timezone" />
          </Stack>
        </Grid>
        <Grid alignSelf="center" item xs={12} sm={6}>
          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Daylight Savings</Typography>
            <Field.Switch name="daylightSavings" label="Daylight Savings" />
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );

  return (
    <>
      {loaded ? (
        <Form methods={methods} onSubmit={onSubmit}
        >
          <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: '1100px' }}>
            {renderDetails}

            {renderVoiceCapabilities}

            <TriggerAction
              actions={actions}
              instructions={values.instructions}
              actionTriggers={actionTriggers}
              setActionTriggers={setActionTriggers}
            />

            <Box
              display="flex"
              alignItems="center"
              // justifyContent={currentAgent ? 'space-between' : 'flex-end'}
              justifyContent='flex-end'
              flexWrap="wrap"
            >
              <LoadingButton
                type="submit"
                variant="contained"
                size="large"
                loading={isSubmitting}
                sx={{ ml: 2 }}
              >
                {!currentAgent ? t('Create') : t('Update')}
              </LoadingButton>
            </Box>
          </Stack>

        </Form>
      ) : (
        <LoadingScreen />
      )}
      <VoiceDialog
        open={openVoiceDialog}
        onClose={() => setOpenVoiceDialog(false)}
        // voices={voiceIDs[values.agentLanguage || 'en']}
        onSelect={(voiceId) => {
          setSelectedVoice(voiceId);
          setValue('voiceId', voiceId);
          setOpenVoiceDialog(false);
          errors.voiceId = undefined;
        }}
        selectedVoice={selectedVoice}
        setSelectedVoice={setSelectedVoice}
        language={values.language}
        onConfirm={(voiceId: string) => {
          setValue('voiceId', voiceId);
          setOpenVoiceDialog(false);
        }}
      />
      <TestDialog
        open={openTestDialog}
        onClose={() => setOpenTestDialog(false)}
      />
    </>
  );
}