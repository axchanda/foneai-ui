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
import type { IKnowledgeBaseItem } from 'src/types/knowledge-base';
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import API from 'src/utils/API';
import type { IBotType } from 'src/types/bot';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
} from '@mui/material';
import { deleteBot } from 'src/utils/api/bots';
import { useBoolean } from 'src/hooks/use-boolean';
import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------
const voiceIDs = ['Joanna', 'Joey', 'Justin', 'Raveena'];

export type NewBotSchemaType = zod.infer<typeof NewBotSchema>;

export const NewBotSchema = zod.object({
  botName: zod.string().min(1, { message: 'Bot name is required!' }),
  botIntroduction: zod.string().min(1, { message: 'Bot Introduction is required!' }),
  botInstructions: zod.string(),
  botVoiceId: zod.string().min(1, { message: 'Voice ID is required!' }),
  botIsInterruptable: zod.boolean(),
  botKnowledgeBase: zod.string(),
  endpointing: zod
    .number()
    .min(0, { message: 'Endpointing must be a positive number!' })
    .max(3000, { message: 'Endpointing must be less than 3000!' })
    .refine((value) => value % 1 === 0, { message: 'Endpointing must be an integer!' }),
  botTimezone: zod.string().min(1, { message: 'Bot Timezone is required!' }),
  daylightSavings: zod.boolean(),
});

type Props = {
  currentBot?: IBotType;
  isUsed?: boolean;
};

export function BotNewEditForm({ currentBot, isUsed }: Props) {
  const router = useRouter();
  const alertDialog = useBoolean();
  const actionDialog = useBoolean();
  const defaultValues = useMemo(
    () => ({
      botName: currentBot?.botName || '',
      botIntroduction: currentBot?.botIntroduction || '',
      botInstructions: currentBot?.botInstructions || '',
      botLanguage: currentBot?.botLanguage || 'en',
      botVoiceId: currentBot?.botVoiceId || 'Joanna',
      botIsInterruptable: currentBot?.botIsInterruptable || false,
      endpointing: currentBot?.endpointing || 20,
      botKnowledgeBase: currentBot?.botKnowledgeBase || '',
      botTimezone: currentBot?.botTimezone || 'UTC-05:00',
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

  const [loaded, setLoaded] = useState(false);
  const [kbs, setKbs] = useState<{ label: string; value: string }[]>([]);

  const getKbs = useCallback(async () => {
    const { data } = await API.get<{
      knowledgeBases: IKnowledgeBaseItem[];
      count: number;
    }>('/knowledgeBases');
    const kbOptions = data.knowledgeBases.map((kb) => ({
      key: kb._id,
      label: kb.knowledgeBaseName,
      value: kb._id,
    }));
    setKbs(kbOptions);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (currentBot) {
      //@ts-ignore
      reset(defaultValues);
    }
  }, [currentBot, defaultValues, reset]);

  useEffect(() => {
    getKbs();
  }, [getKbs]);

  // values.botLanguage = values.botLanguage || 'en';

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    try {
      console.log(data);
      const url = currentBot ? `/bots/${currentBot._id}` : '/bots/create';
      const method = currentBot ? API.put : API.post;
      await method(url, {
        botName: data.botName,
        botIntroduction: data.botIntroduction,
        botInstructions: data.botInstructions,
        botLanguage: 'en',
        botVoiceId: data.botVoiceId,
        botKnowledgeBase: data.botKnowledgeBase,
        botIsInterruptable: data.botIsInterruptable,
        endpointing: data.endpointing,
        botTimezone: data.botTimezone,
        daylightSavings: data.daylightSavings,
      });
      reset();
      toast.success(currentBot ? 'Update success!' : 'Create success!');
      router.push('/bots');
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = (
    <Card>
      <CardHeader
        title="Details"
        subheader="Bot name, introduction and prompt instructions"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Bot Name</Typography>
          <Field.Text name="botName" placeholder="Ex: Sales bot..." />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Introduction Line</Typography>
          <Field.Text
            name="botIntroduction"
            placeholder="Hi, I'm an AI assistant that would like to ..."
          />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Bot Instructions</Typography>
          <Field.TextareaWithMaximize
            // height={200}
            // showToolbar={false}
            // rows={6}
            name="botInstructions"
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
        subheader="Speech functions and attributes"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        {/* <Stack spacing={1}>
          <Typography variant="subtitle2">Language</Typography>
          <Field.RadioGroup
            row

            onChange={(e) => {
              setValue('botLanguage', e.target.value as 'en' | 'es');
              resetField('botVoice.provider');
              resetField('botVoice.voiceId');
              // voiceRef.current?.focus();
            }}
            name="language"
            options={[
              {
                label: 'English',
                value: 'en',
              }
            ]}
            sx={{ gap: 4 }}
          />
        </Stack> */}
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Voice</Typography>
          <Stack spacing={1.5} direction="row" sx={{ gap: 4, width: '100%' }}>
            <Grid container spacing={1.5}>
              {/* <Grid item xs={12} sm={4}>
                <Field.Autocomplete
                  name="voiceProvider"
                  label='Provider'
                  options={
                    voiceProviders[values.botLanguage || 'en']
                  }
                  placeholder="Select a voice provider"
                  defaultValue="AWS"
                  fullWidth
                />
              </Grid> */}
              <Grid item xs={12} sm={8}>
                <Field.Autocomplete
                  name="botVoiceId"
                  // label='Voice ID'
                  options={voiceIDs}
                  placeholder="Select a voice ID"
                  defaultValue=""
                  fullWidth
                />
              </Grid>
            </Grid>
          </Stack>
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Interruptable</Typography>
          <Field.Switch
            name="botIsInterruptable"
            label={
              values.botIsInterruptable
                ? 'The bot stops speaking when the user interrupts the bot'
                : 'The bot continues to speak even when the user interrupts the bot'
            }
          />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Endpointing</Typography>
          <Field.Text
            name="endpointing"
            placeholder="Enter endpointing value"
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
                  <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>ms</Box>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Stack>
    </Card>
  );

  const renderKnowledgeBase = (
    <Card>
      <CardHeader title="Knowledge Base" subheader="Knowledge base settings" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        {/* when the switch is active then a select should be present with 'x', 'y', 'z' as options */}
        <Stack spacing={1.5}>
          {/* <Field.Autocomplete
            name="botKnowledgeBase"
            autoHighlight
            options={kbs.map((option) => option)}
            getOptionLabel={(option) => option.label || ''}
            renderOption={(props, option) => (
              <li {...props} key={option.value}>
                {option.label}
              </li>
            )}
          /> */}
          <Field.Select name="botKnowledgeBase" label="Knowledge Base">
            {kbs.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Field.Select>
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
          <Field.TimezoneSelect name="botTimezone" placeholder="Select a timezone" />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Daylight Savings</Typography>
          <Field.Switch name="daylightSavings" label="Daylight Savings" />
        </Stack>
      </Stack>
      <Box p={3}>
        <Button
          onClick={() => {
            actionDialog.setValue(true);
          }}
          variant="contained"
          color="primary"
          disabled={!values.botInstructions || values.botInstructions.trim().length === 0}
        >
          Add Action
        </Button>
      </Box>
    </Card>
  );

  // const renderActions = ();

  return (
    <>
      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
          {renderDetails}

          {renderProperties}

          {renderKnowledgeBase}

          {renderMisc}

          <Box
            display="flex"
            alignItems="center"
            justifyContent={currentBot ? 'space-between' : 'end'}
            flexWrap="wrap"
          >
            {/* <FormControlLabel
        control={<Switch defaultChecked inputProps={{ id: 'publish-switch' }} />}
        label="Publish"
        sx={{ flexGrow: 1, pl: 3 }}
      /> */}
            {currentBot && (
              <Button
                onClick={async () => {
                  if (isUsed) {
                    alertDialog.setValue(true);
                  } else {
                    await deleteBot(currentBot._id, () => {
                      router.push('/bots');
                    });
                  }
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
              {/* Ji */}
            </LoadingButton>
          </Box>
        </Stack>
      </Form>
      <ConfirmDialog
        title="Unable to delete bot"
        content="This bot is currently being used in some campaign(s). Please remove it from the linked campaign(s) before deleting."
        open={alertDialog.value}
        action={<></>}
        onClose={() => {
          alertDialog.setValue(false);
        }}
      />
      {actionDialog.value && (
        <ActionDialog
          open={actionDialog.value}
          onClose={() => {
            actionDialog.setValue(false);
          }}
          botInstrunctions={values.botInstructions}
        />
      )}
    </>
  );
}

const ActionDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  botInstrunctions: string;
}> = ({ open, onClose, botInstrunctions }) => {
  const actions = botInstrunctions.split('.').filter((line) => line.trim().length > 0);
  const [selectedAction, setSelectedAction] = useState<string | undefined>(undefined);
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select action</DialogTitle>
      <Divider />
      <DialogContent>
        <Box
          my={2}
          border="2px solid"
          borderRadius="12px"
          borderColor="background.neutral"
          sx={{
            '#action': {
              cursor: 'pointer',
              ':hover': {
                backgroundColor: 'primary.main',
              },
              '&.selected': {
                backgroundColor: 'primary.main',
              },
            },
          }}
          p={2}
        >
          <Typography variant="subtitle1">
            {actions.map((action, index) => (
              <Fragment key={index}>
                <Typography
                  component="span"
                  id="action"
                  className={selectedAction === action ? 'selected' : ''}
                  onClick={() =>
                    setSelectedAction((prev) => (prev === action ? undefined : action))
                  }
                >
                  {action}
                </Typography>
                <Typography component="span"> . </Typography>
              </Fragment>
            ))}
          </Typography>
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="error">
          Close
        </Button>
        <Button disabled={!selectedAction} onClick={onClose} variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
