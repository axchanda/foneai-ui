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

export type NewAgentSchemaType = zod.infer<typeof NewAgentSchema>;

export const NewAgentSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  introduction: zod.string().min(1, { message: 'Introduction is required!' }),
  instructions: zod.string().min(1, { message: 'Instructions are required!' }),
  voiceId: zod.string().min(1, { message: 'Voice ID is required!' }),
  isInterruptable: zod.boolean(),
  endpointing: zod
    .number()
    .min(0, { message: 'Endpointing must be a positive number!' })
    .max(3000, { message: 'Endpointing must be less than 3000!' })
    .refine((value) => value % 1 === 0, { message: 'Endpointing must be an integer!' }),
  timezone: zod.string().min(1, { message: 'Timezone is required!' }),
  daylightSavings: zod.boolean(),
  language: zod.string().min(1, { message: 'Language is required!' }),
});

type Props = {
  currentAgent?: IAgentType;
};

export function AgentNewEditForm({ currentAgent }: Props) {
  const router = useRouter();
  const defaultValues = useMemo(
    () => ({
      name: currentAgent?.name || '',
      introduction: currentAgent?.introduction || '',
      instructions: currentAgent?.instructions || '',
      language: currentAgent?.language || 'en',
      voiceId: currentAgent?.voice?.voiceId || '',
      isInterruptable: currentAgent?.isInterruptable || false,
      endpointing: currentAgent?.endpointing || 20,
      timezone: currentAgent?.timezone || 'UTC-05:00',
      daylightSavings: currentAgent?.daylightSavings || false      
    }),
    [currentAgent]
  );
  const methods = useForm<NewAgentSchemaType>({
    mode: 'all',
    resolver: zodResolver(NewAgentSchema),
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

  // this actionTriggers is the list of actions that are triggered by the agent
  const [actionTriggers, setActionTriggers] = useState<{ actionId: string; trigger: string }[]>(
    currentAgent?.actions || []
  );
  const [selectedVoice, setSelectedVoice] = useState<string | null>(
    currentAgent?.voice?.voiceId || null
  );
  const [openVoiceDialog, setOpenVoiceDialog] = useState(false);

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
        console.log('data', data)
        console.log('Action Triggers 141: ', actionTriggers);
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
          isInterruptable: data.isInterruptable,
          endpointing: data.endpointing,
          timezone: data.timezone,
          daylightSavings: data.daylightSavings,
          actions: actionTriggers,
          
        });
        reset();
        toast.success(currentAgent ? 'Update success!' : 'Create success!');
        router.push('/agents');
      } catch (error) {
        const messages = Object.values(error.response.data.errors || {}) as string[];
        messages.forEach((m: string) => {
          toast.error(m);
        });
      }
  });

  const renderDetails = (
    <Card>
      <CardHeader
        title="Details"
        subheader="Agent name, introduction and prompt instructions"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Agent Name</Typography>
          <Field.Text name="name" placeholder="Ex: Sales agent..." />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Introduction Line</Typography>
          <Field.Text
            name="introduction"
            placeholder="Hi, I'm an AI assistant that would like to ..."
          />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Agent Instructions</Typography>
          <Field.TextareaWithMaximize
            // height={200}
            // showToolbar={false}
            // rows={6}
            name="instructions"
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
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Voice</Typography>
          <Stack spacing={1.5} direction="row" sx={{ gap: 4, width: '100%' }}>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <Typography variant="subtitle2">Language</Typography>
                  <Field.Select
                    onChange={(e) => {
                      setValue('language', e.target.value as 'en' | 'es');
                      setValue('voiceId', '');
                      setSelectedVoice(null);
                      // voiceRef.current?.focus();
                    }}
                    defaultValue={values.language}
                    name="language"
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Spanish</MenuItem>
                    <MenuItem value="ru">Russian</MenuItem>
                  </Field.Select>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2">Voice Id</Typography>
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
                      {values.voiceId || 'Select Voice'}
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
              <Typography variant="subtitle2">Interruptable</Typography>
              <Field.Switch
                name="isInterruptable"
                label={
                  values.isInterruptable
                    ? 'The agent stops speaking when the user interrupts the agent'
                    : 'The agent continues to speak even when the user interrupts the agent'
                }
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
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
        <Form methods={methods} onSubmit={onSubmit}>
          <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: '1100px' }}>
            {renderDetails}

            {renderProperties}

            <TriggerAction
              actions={actions}
              instructions={values.instructions}
              actionTriggers={actionTriggers}
              setActionTriggers={setActionTriggers}
            />
            {renderMisc}

            <Box
              display="flex"
              alignItems="center"
              justifyContent='end'
              flexWrap="wrap"
            >
              <LoadingButton
                type="submit"
                variant="contained"
                size="large"
                loading={isSubmitting}
                sx={{ ml: 2 }}
              >
                {!currentAgent ? 'Create Agent' : 'Update Agent'}
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
        onSelect={(voice) => {
          setSelectedVoice(voice);
          setValue('voiceId', voice);
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
    </>
  );
}


const voicesEn: {
  provider: 'AWS' | 'GCP' | 'Azure';
  gender: 'M' | 'F';
  accent: string;
  voice: string;
  price: 'free' | 'paid';
  file: string;
}[] = [
  {
    provider: 'AWS',
    gender: 'F',
    accent: 'US',
    voice: 'Joanna',
    price: 'free',
    file: '/voices/joanna.mp3',
  },
  {
    provider: 'AWS',
    gender: 'M',
    accent: 'US',
    voice: 'Joey',
    price: 'free',
    file: '/voices/joey.mp3',
  },
  {
    provider: 'AWS',
    gender: 'M',
    accent: 'US',
    voice: 'Matthew',
    price: 'paid',
    file: '/voices/matthew.mp3',
  },
];

const voicesEs: {
  provider: 'AWS' | 'GCP' | 'Azure';
  gender: 'M' | 'F';
  accent: string;
  voice: string;
  price: 'free' | 'paid';
  file: string;
}[] = [
  {
    provider: 'AWS',
    gender: 'M',
    accent: 'US',
    voice: 'Miguel',
    price: 'free',
    file: '/voices/miguel.mp3',
  },
  {
    provider: 'AWS',
    gender: 'M',
    accent: 'MX',
    voice: 'Mia',
    price: 'free',
    file: '/voices/mia.mp3',
  },
  {
    provider: 'AWS',
    gender: 'F',
    accent: 'ES',
    voice: 'Lucia',
    price: 'free',
    file: '/voices/lucia.mp3',
  },
];

const voicesRu: {
  provider: 'AWS' | 'GCP' | 'Azure';
  gender: 'M' | 'F';
  accent: string;
  voice: string;
  price: 'free' | 'paid';
  file: string;
}[] = [
  {
    provider: 'AWS',
    gender: 'F',
    accent: 'RU',
    voice: 'Tatyana',
    price: 'free',
    file: '/voices/tatyana.mp3',
  },
  {
    provider: 'AWS',
    gender: 'M',
    accent: 'RU',
    voice: 'Maxim',
    price: 'free',
    file: '/voices/maxim.mp3',
  },
];

const voiceTableHead = [
  { id: 'provider', label: 'Provider', width: 100 },
  { id: 'gender', label: 'Gender', width: 100 },
  { id: 'accent', label: 'Accent', width: 100 },
  { id: 'voiceId', label: 'Voice ID', width: 200, align: 'center' },
  { id: 'price', label: 'Price', width: 120, align: 'center' },
  { id: 'preview', label: 'Preview', width: 150 },
  { id: '', width: 80 },
];
const VoiceDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  // voices: string[];
  onSelect: (voice: string) => void;
  selectedVoice: string | null;
  setSelectedVoice: React.Dispatch<React.SetStateAction<string | null>>;
  language: string;
  onConfirm: (voice: string) => void;
}> = ({ open, onClose, onSelect, language, selectedVoice, setSelectedVoice }) => {
  const table = useTable();
  const [selected, setSelected] = useState<string | null>(selectedVoice);
  const voices = useMemo(() => {
    switch (language) {
      case 'en':
        return voicesEn;
      case 'es':
        return voicesEs;
      case 'ru':
        return voicesRu;
      default:
        return voicesEn;
    }
  }, [language]);

  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  const handleClose = (event: {}, reason: string) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      setSelected(selectedVoice);
    }
    setCurrentlyPlaying(null);
    onClose();
  };

  return (
    <Dialog maxWidth="md" open={open} onClose={handleClose}>
      <DialogTitle>Select Voice</DialogTitle>
      <Divider />
      <DialogContent>
        <Card
          sx={{
            my: 2,
          }}
        >
          <Table>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={voiceTableHead}
              numSelected={table.selected.length}
            />
            <TableBody>
              {voices.map((voice) => (
                <VoicesTableRow
                  key={voice.voice}
                  voice={voice}
                  selected={selected}
                  setSelected={setSelected}
                  currentlyPlaying={currentlyPlaying}
                  setCurrentlyPlaying={setCurrentlyPlaying}
                />
              ))}
            </TableBody>
          </Table>
        </Card>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button
          onClick={() => {
            setSelectedVoice(null);
            setSelected(selectedVoice);
            onClose();
          }}
          variant="outlined"
          color="error"
        >
          Close
        </Button>
        <Button
          onClick={() => {
            if (selected) {
              setCurrentlyPlaying(null);
              onSelect(selected);
            }
          }}
          variant="contained"
          disabled={!selected}
          color="primary"
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const VoicesTableRow: React.FC<{
  voice: {
    provider: 'AWS' | 'GCP' | 'Azure';
    gender: 'M' | 'F';
    accent: string;
    voice: string;
    price: 'free' | 'paid';
    file: string;
  };
  selected: string | null;
  setSelected: React.Dispatch<React.SetStateAction<string | null>>;
  currentlyPlaying: string | null;
  setCurrentlyPlaying: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ voice, selected, setSelected, currentlyPlaying, setCurrentlyPlaying }) => {
  const audio = useMemo(() => {
    return new Audio(voice.file);
  }, [voice.file]);

  const iconMap = {
    US: 'twemoji:flag-united-states',
    UK: 'twemoji:flag-united-kingdom',
    ES: 'twemoji:flag-spain',
    AU: 'twemoji:flag-australia',
    RU: 'twemoji:flag-russia',
    MX: 'twemoji:flag-mexico',
  };

  const AccentNamesMap = {
    US: 'American',
    UK: 'British',
    ES: 'Castilian',
    AU: 'Australian',
    RU: 'Russian',
    MX: 'Mexican',
  };

  // Narrow the type of accent to only valid keys
  type Accent = keyof typeof iconMap;

  useEffect(() => {
    if (currentlyPlaying === voice.file) {
      audio.play();
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [audio, currentlyPlaying, voice.file]);

  return (
    <TableRow
      sx={{
        backgroundColor: selected === voice.voice ? 'var(--palette-primary-main)' : 'transparent',
        color: selected === voice.voice ? 'white' : 'inherit',
        // '&:hover': {
        //   backgroundColor:
        //     selected === voice.voice ? 'var(--palette-primary-light)' : 'background.neutral',
        // },
        cursor: 'pointer',
      }}
      onClick={() => {
        setSelected(voice.voice);
      }}
      key={voice.voice}
    >
      <TableCell
        sx={{
          textTransform: 'capitalize',
        }}
        // width={80}
      >
        <Stack justifyContent="center" alignItems="center" spacing={1.5}>
          <Iconify
            icon={voice.provider === 'AWS' ? 'skill-icons:aws-dark' : 'skill-icons:gcp-dark'}
            width="2.5rem"
          />
          <Typography variant="subtitle2">{voice.provider}</Typography>
        </Stack>
      </TableCell>
      <TableCell>
        <Stack justifyContent="center" alignItems="center" spacing={1.5}>
          <Iconify
            icon={voice.gender === 'M' ? 'noto:male-sign' : 'noto:female-sign'}
            width="2.5rem"
          />
          <Typography variant="subtitle2" textAlign="center">
            {voice.gender === 'F' ? 'Female' : 'Male'}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell>
        <Stack spacing={1.5} justifyContent="center" alignItems="center">
          <Iconify
            icon={iconMap[voice.accent as Accent] || 'twemoji:flag-world'} // Fallback
            width="2.5rem"
          />
          <Typography variant="subtitle2">
            {AccentNamesMap[voice.accent as Accent] || 'English'}{' '}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell>
        <Stack>
          <Typography fontWeight="bold" textAlign="center">
            {voice.voice}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell align="center">
        <Stack spacing={1.5}>
          <Stack height="40px" justifyContent="center">
            <Typography
              sx={{
                textTransform: 'capitalize',
                transform: voice.price !== 'free' ? 'translateY(16px)' : '',
              }}
            >
              {voice.price}
            </Typography>
          </Stack>
          {voice.price !== 'free' && <Typography variant="subtitle2">+ $0.012/min</Typography>}
        </Stack>
      </TableCell>
      <TableCell>
        <IconButton
          onClick={() => {
            setCurrentlyPlaying((prev) => (prev === voice.file ? null : voice.file));
          }}
        >
          <Iconify
            icon={currentlyPlaying !== voice.file ? 'gravity-ui:play-fill' : 'solar:pause-bold'}
          />
        </IconButton>
      </TableCell>
      <TableCell>
        <Iconify
          icon={
            selected === voice.voice
              ? 'mdi:checkbox-marked-circle'
              : 'ri:checkbox-blank-circle-line'
          }
        />
      </TableCell>
    </TableRow>
  );
};
