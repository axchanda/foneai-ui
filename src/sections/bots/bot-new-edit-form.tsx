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
import type { IBotType } from 'src/types/bot';
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
import type { IZapListType } from 'src/types/zap';
import { LoadingScreen } from 'src/components/loading-screen';
import { TableHeadCustom, useTable } from 'src/components/table';
import { Iconify } from 'src/components/iconify';
import TriggerZap from 'src/components/bots/trigger-zap';

export type NewBotSchemaType = zod.infer<typeof NewBotSchema>;

export const NewBotSchema = zod.object({
  botName: zod.string().min(1, { message: 'Bot name is required!' }),
  botIntroduction: zod.string().min(1, { message: 'Bot Introduction is required!' }),
  botInstructions: zod.string().min(1, { message: 'Bot Instructions is required!' }),
  botVoiceId: zod.string().min(1, { message: 'Voice ID is required!' }),
  botIsInterruptable: zod.boolean(),
  botKnowledgeBase: zod.string(),
  botEndpointing: zod
    .number()
    .min(0, { message: 'Endpointing must be a positive number!' })
    .max(3000, { message: 'Endpointing must be less than 3000!' })
    .refine((value) => value % 1 === 0, { message: 'Endpointing must be an integer!' }),
  botTimezone: zod.string().min(1, { message: 'Bot Timezone is required!' }),
  botDaylightSavings: zod.boolean(),
  botLanguage: zod.string().min(1, { message: 'Bot Language is required!' }),
});

type Props = {
  currentBot?: IBotType;
};

export function BotNewEditForm({ currentBot }: Props) {
  const router = useRouter();
  const defaultValues = useMemo(
    () => ({
      botName: currentBot?.botName || '',
      botIntroduction: currentBot?.botIntroduction || '',
      botInstructions: currentBot?.botInstructions || '',
      botLanguage: currentBot?.botLanguage || 'en',
      botVoiceId: currentBot?.botVoice?.voiceId || '',
      botIsInterruptable: currentBot?.botIsInterruptable || false,
      botEndpointing: currentBot?.botEndpointing || 20,
      botKnowledgeBase: currentBot?.botKnowledgeBaseId || '',
      botTimezone: currentBot?.botTimezone || 'UTC-05:00',
      botDaylightSavings: currentBot?.botDaylightSavings || false,
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
    formState: { isSubmitting, errors },
    resetField,
    setValue,
    watch,
  } = methods;

  const values = watch();

  const [loaded, setLoaded] = useState(false);
  // this zaps is the list of zaps that are available for the user
  const [zaps, setZaps] = useState<IZapListType>([]);

  // this zapTriggers is the list of zaps that are triggered by the bot
  const [zapTriggers, setZapTriggers] = useState<{ zapId: string; trigger: string }[]>(
    currentBot?.botZaps || []
  );
  const [selectedVoice, setSelectedVoice] = useState<string | null>(
    currentBot?.botVoice?.voiceId || null
  );
  const [openVoiceDialog, setOpenVoiceDialog] = useState(false);

  const getData = useCallback(async () => {
    const {data} = await API.get<any>('/zapsList');
    console.log(data);
    setZaps(data.zaps);

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (currentBot) {
      //@ts-ignore
      reset(defaultValues);
    }
  }, [currentBot, defaultValues, reset]);

  useEffect(() => {
    getData();
  }, [getData]);

  const onSubmit = handleSubmit(async (data) => {
      try {
        console.log('Zap Triggers 141: ', zapTriggers);
        const url = currentBot ? `/bots/${currentBot._id}` : '/bots/create';
        const method = currentBot ? API.put : API.post;
        await method(url, {
          botName: data.botName,
          botIntroduction: data.botIntroduction,
          botInstructions: data.botInstructions,
          botLanguage: data.botLanguage,
          botVoice: {
            ttsProvider: 'AWS',
            voiceId: data.botVoiceId
          },
          botIsInterruptable: data.botIsInterruptable,
          botEndpointing: data.botEndpointing,
          botTimezone: data.botTimezone,
          botDaylightSavings: data.botDaylightSavings,
          botZaps: zapTriggers,
        });
        reset();
        toast.success(currentBot ? 'Update success!' : 'Create success!');
        router.push('/bots');
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
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Voice</Typography>
          <Stack spacing={1.5} direction="row" sx={{ gap: 4, width: '100%' }}>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <Typography variant="subtitle2">Language</Typography>
                  <Field.Select
                    onChange={(e) => {
                      setValue('botLanguage', e.target.value as 'en' | 'es');
                      setValue('botVoiceId', '');
                      setSelectedVoice(null);
                      // voiceRef.current?.focus();
                    }}
                    defaultValue={values.botLanguage}
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
                      disabled={!values.botLanguage}
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
                      {values.botVoiceId || 'Select Voice'}
                      <Iconify icon="eva:arrow-ios-downward" />
                    </Button>
                    {/* error message when botVoiceId is empty */}
                    {errors.botVoiceId && (
                      <Typography variant="caption" sx={{ color: 'error.main' }}>
                        {errors.botVoiceId.message}
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
                name="botIsInterruptable"
                label={
                  values.botIsInterruptable
                    ? 'The bot stops speaking when the user interrupts the bot'
                    : 'The bot continues to speak even when the user interrupts the bot'
                }
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Endpointing</Typography>
              <Field.Text
                name="botEndpointing"
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
            <Field.TimezoneSelect name="botTimezone" placeholder="Select a timezone" />
          </Stack>
        </Grid>
        <Grid alignSelf="center" item xs={12} sm={6}>
          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Daylight Savings</Typography>
            <Field.Switch name="botDaylightSavings" label="Daylight Savings" />
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

            <TriggerZap
              zaps={zaps}
              botInstructions={values.botInstructions}
              zapTriggers={zapTriggers}
              setZapTriggers={setZapTriggers}
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
                {!currentBot ? 'Create Bot' : 'Update Bot'}
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
        // voices={voiceIDs[values.botLanguage || 'en']}
        onSelect={(voice) => {
          setSelectedVoice(voice);
          setValue('botVoiceId', voice);
          setOpenVoiceDialog(false);
          errors.botVoiceId = undefined;
        }}
        selectedVoice={selectedVoice}
        setSelectedVoice={setSelectedVoice}
        language={values.botLanguage}
        onConfirm={(voiceId: string) => {
          setValue('botVoiceId', voiceId);
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
