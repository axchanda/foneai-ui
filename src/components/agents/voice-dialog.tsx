import React, { useEffect, useMemo, useState } from 'react';
import { useTable } from 'src/components/table';
import {
Button,
Card,
Dialog,
DialogActions,
DialogContent,
Divider,
Stack,
Table,
TableCell,
TableBody,
TableRow,
Typography,
TextField,
} from '@mui/material';
import {
FormControl,
InputLabel,
MenuItem,
Select,
} from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';

import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { TableHeadCustom } from 'src/components/table';
import { Iconify } from '../iconify';
import { Form, Field } from '../hook-form';
import { useTranslate } from 'src/locales';

const voicesEn: {
    provider: 'AWS' | 'GCP' | 'Azure';
    gender: 'M' | 'F';
    accent: string;
    voiceId: string;
    price: 'free' | 'paid';
    file: string;
}[] = [
{
    provider: 'AWS',
    gender: 'F',
    accent: 'US',
    voiceId: 'Joanna',
    price: 'free',
    file: '/voices/joanna.mp3',
},
{
    provider: 'AWS',
    gender: 'M',
    accent: 'US',
    voiceId: 'Joey',
    price: 'free',
    file: '/voices/joey.mp3',
},
{
    provider: 'AWS',
    gender: 'M',
    accent: 'US',
    voiceId: 'Matthew',
    price: 'paid',
    file: '/voices/matthew.mp3',
},
];

const voicesEs: {
provider: 'AWS' | 'GCP' | 'Azure';
gender: 'M' | 'F';
accent: string;
voiceId: string;
price: 'free' | 'paid';
file: string;
}[] = [
{
    provider: 'AWS',
    gender: 'M',
    accent: 'US',
    voiceId: 'Miguel',
    price: 'free',
    file: '/voices/miguel.mp3',
},
{
    provider: 'AWS',
    gender: 'M',
    accent: 'MX',
    voiceId: 'Mia',
    price: 'free',
    file: '/voices/mia.mp3',
},
{
    provider: 'AWS',
    gender: 'F',
    accent: 'ES',
    voiceId: 'Lucia',
    price: 'free',
    file: '/voices/lucia.mp3',
},
];

const voicesRu: {
provider: 'AWS' | 'GCP' | 'Azure';
gender: 'M' | 'F';
accent: string;
voiceId: string;
price: 'free' | 'paid';
file: string;
}[] = [
{
    provider: 'AWS',
    gender: 'F',
    accent: 'RU',
    voiceId: 'Tatyana',
    price: 'free',
    file: '/voices/tatyana.mp3',
},
{
    provider: 'AWS',
    gender: 'M',
    accent: 'RU',
    voiceId: 'Maxim',
    price: 'free',
    file: '/voices/maxim.mp3',
},
];

const voicesAr: {
    provider: 'AWS' | 'GCP' | 'Azure';
    gender: 'M' | 'F';
    accent: string;
    voiceId: string;
    price: 'free' | 'paid';
    file: string;
}[] = [
    {
        provider: 'AWS',
        gender: 'F',
        accent: 'ARB',
        voiceId: 'Zeina',
        price: 'free',
        file: '/voices/zeina.mp3',
    },
    {
        provider: 'AWS',
        gender: 'F',
        accent: 'AE',
        voiceId: 'Hala',
        price: 'paid',
        file: '/voices/hala.mp3',
    },
    {
        provider: 'AWS',
        gender: 'M',
        accent: 'AE',
        voiceId: 'Zayd',
        price: 'paid',
        file: '/voices/zayd.mp3',
    },
];


const VoicesTableRow: React.FC<{
    voice: {
        provider: 'AWS' | 'GCP' | 'Azure';
        gender: 'M' | 'F';
        accent: string;
        voiceId: string;
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
const { t } = useTranslate();
const iconMap = {
    US: 'twemoji:flag-united-states',
    UK: 'twemoji:flag-united-kingdom',
    ES: 'twemoji:flag-spain',
    AU: 'twemoji:flag-australia',
    RU: 'twemoji:flag-russia',
    MX: 'twemoji:flag-mexico',
    ARB: 'twemoji:flag-saudi-arabia',
    AE: 'twemoji:flag-united-arab-emirates',
};

const AccentNamesMap = {
    US: t('American'),
    UK: t('British'),
    ES: t('Spanish'),
    AU: t('Australian'),
    RU: t('Russian'),
    MX: t('Mexican'),
    ARB: t('Arabic'),
    AE: t('Arabic (Gulf)'),
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
        backgroundColor: selected === voice.voiceId ? 'var(--palette-primary-main)' : 'transparent',
        color: selected === voice.voiceId ? 'white' : 'inherit',
        // '&:hover': {
        //   backgroundColor:
        //     selected === voice.voice ? 'var(--palette-primary-light)' : 'background.neutral',
        // },
        cursor: 'pointer',
    }}
    onClick={() => {
        setSelected(voice.voiceId);
    }}
    key={voice.voiceId}
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
            width="1.5rem"
        />
        {/* <Typography variant="subtitle2">{voice.provider}</Typography> */}
        </Stack>
    </TableCell>
    <TableCell>
        <Stack justifyContent="center" alignItems="center" spacing={1.5}>
        <Iconify
            icon={voice.gender === 'M' ? 'noto:male-sign' : 'noto:female-sign'}
            width="1.5rem"
        />
        {/* <Typography variant="subtitle2" textAlign="center">
            {voice.gender === 'F' ? 'Female' : 'Male'}
        </Typography> */}
        </Stack>
    </TableCell>
    <TableCell>
        <Stack spacing={1.5} justifyContent="center" alignItems="center" direction={'row'}>
        <Iconify
            icon={iconMap[voice.accent as Accent] || 'twemoji:flag-world'} // Fallback
            width="1.5rem"
        />
        <Typography>
            {AccentNamesMap[voice.accent as Accent] || 'English'}{' '}
        </Typography>
        </Stack>
    </TableCell>
    <TableCell>
        <Stack>
        <Typography fontWeight="bold" textAlign="center">
            {voice.voiceId}
        </Typography>
        </Stack>
    </TableCell>
    <TableCell align="center">
        <Stack spacing={1.5}>
            {/* <Typography
            sx={{
                textTransform: 'capitalize',
                transform: voice.price !== 'free' ? 'translateY(16px)' : '',
            }}
            >
            {voice.price}
            </Typography> */}
        {voice.price !== 'free' && <Typography variant="subtitle2">0.12</Typography>}
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
            selected === voice.voiceId
            ? 'mdi:checkbox-marked-circle'
            : 'ri:checkbox-blank-circle-line'
        }
        />
    </TableCell>
    </TableRow>
);
};


const VoiceDialog: React.FC<{
    open: boolean;
    onClose: () => void;
    onSelect: (voiceId: string) => void;
    selectedVoice: string | null;
    setSelectedVoice: React.Dispatch<React.SetStateAction<string | null>>;
    language: string;
    onConfirm?: (voiceId: string) => void; 
  }> = ({ open, onClose, onSelect, selectedVoice, setSelectedVoice, language, onConfirm }) => {
    const [selected, setSelected] = useState<string | null>(selectedVoice);
    const [filterVoiceId, setFilterVoiceId] = useState('');
    const [filterProvider, setFilterProvider] = useState('');
    const [filterGender, setFilterGender] = useState('');
    const [filterAccent, setFilterAccent] = useState('');
    const [filterPrice, setFilterPrice] = useState('');
    
    const methods = useForm();

    const resetFilters = () => {
        setFilterVoiceId('');
        setFilterProvider('');
        setFilterGender('');
        setFilterAccent('');
        setFilterPrice('');
    }

    const voices = useMemo(() => {
      // Example filter logic, adjust as needed for your data structure
      const voiceList = {
        en: voicesEn,
        es: voicesEs,
        ru: voicesRu,
        ar: voicesAr,
      }[language] || voicesEn;
  
      return voiceList.filter((voice) =>
        (filterVoiceId ? voice.voiceId.toLowerCase().includes(filterVoiceId.toLowerCase()) : true) &&
        (filterProvider ? voice.provider === filterProvider : true) &&
        (filterGender ? voice.gender === filterGender : true) &&
        (filterAccent ? voice.accent === filterAccent : true) &&
        (filterPrice ? voice.price === filterPrice : true)
      );
    }, [language, filterVoiceId, filterProvider, filterGender, filterAccent, filterPrice]);
  
    useEffect(() => {
      if (open) setSelected(selectedVoice);
    }, [selectedVoice, open]);
  
    const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
    const { t } = useTranslate();

    const handleClose = () => {
        setCurrentlyPlaying(null);
        resetFilters();
        onClose();
    };

    const TABLE_HEAD = [
        { id: 'provider', label: t('Provider'), width: 70 },
        { id: 'gender', label: t('Gender'), width: 70 },
        { id: 'accent', label: t('Accent'), width: 100 },
        { id: 'voiceId', label: t('Voice ID'), width: 150, align: 'center' },
        { id: 'price', label: t('Extra Credits / minute'), width: 150, align: 'center' },
        { id: 'preview', label: t('Preview'), width: 70 },
        { id: '', width: 80 },
    ];
    
  
    return (
      <Dialog maxWidth="md" open={open} onClose={(event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
          setSelected(selectedVoice);
        }
        setCurrentlyPlaying(null);
        resetFilters();
        onClose();
      }}>
        <DialogTitle>
            {t('Select a voice')}
        </DialogTitle>
        <Divider />
        <DialogContent 
        sx={{
            scrollBehavior: 'smooth',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            padding: 2,
            width: "800px",
            height: "500px",
        }}
        >
          <Stack sx={{ p: 1 }} direction="row" spacing={2}>
            <FormProvider {...methods}>
            {/* Filters Section */}
                <Field.Select
                    name="provider"
                    label={t('Provider')}
                    value={filterProvider}
                    onChange={(e) => setFilterProvider(e.target.value)}
                >
                    <MenuItem value="">
                        {t('All')}
                    </MenuItem>
                    <MenuItem value="AWS">AWS Polly</MenuItem>
                    <MenuItem value="GCP">GCP TTS</MenuItem>
                    <MenuItem value="Azure">Azure</MenuItem>
                    {/* Add more options as needed */}
                </Field.Select>
                <Field.Select
                    name="gender"
                    label={t("Gender")}
                    value={filterGender}
                    onChange={(e) => setFilterGender(e.target.value)}
                >
                    <MenuItem value="">
                        {t('All')}
                    </MenuItem>
                    <MenuItem value="M">
                        {t("Male")}
                    </MenuItem>
                    <MenuItem value="F">
                        {t("Female")}
                    </MenuItem>
                </Field.Select>
                <Field.Select
                    name="accent"
                    label={t("Accent")}
                    value={filterAccent}
                    onChange={(e) => setFilterAccent(e.target.value)}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="US">
                        {t("American")}
                    </MenuItem>
                    <MenuItem value="UK">
                        {t("British")}
                    </MenuItem>
                    <MenuItem value="AU">
                        {t("Australian")}
                    </MenuItem>
                </Field.Select>
                <Field.Text
                    name="voiceId"
                    label={t("Voice ID")}
                    value={filterVoiceId}
                    onChange={(e) => setFilterVoiceId(e.target.value)}
                />
                <Field.Select
                    name="price"
                    label={t("Price")}
                    value={filterPrice}
                    onChange={(e) => setFilterPrice(e.target.value)}
                >
                    <MenuItem value="">
                        {t('All')}
                    </MenuItem>
                    <MenuItem value="free">
                        {t("Free")}
                    </MenuItem>
                    <MenuItem value="paid">
                        {t("Paid")}
                    </MenuItem>
                </Field.Select>
            </FormProvider>
          </Stack>
          <Card>
            {/* Voices Table */}
            <Table>
                <TableHeadCustom headLabel={TABLE_HEAD} />
              <TableBody>
                {voices.map((voice) => (
                  <VoicesTableRow
                    key={voice.voiceId}
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
          <Button onClick={handleClose} variant="outlined" color="error">
            {t('Cancel')}
          </Button>
          <Button
            onClick={() => selected && onSelect(selected)}
            variant="contained"
            color="primary"
            disabled={!selected}
          >
            {t('Select')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  

export default VoiceDialog;

