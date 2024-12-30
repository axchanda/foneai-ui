import type { BoxProps } from '@mui/material/Box';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { UploadIllustration } from 'src/assets/illustrations';
import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export function UploadPlaceholder({ ...other }: BoxProps) {
  const {t} = useTranslate();
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
      {...other}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <UploadIllustration hideBackground sx={{ width: 100 }} />

        <Stack spacing={1} sx={{ textAlign: 'center' }}>
          <Box sx={{ typography: 'h6' }}>
            {t('Drop or select file')}
          </Box>
          <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
            {t('Drop files here or click to ')}
            <Box
              component="span"
              sx={{ mx: 0.5, color: 'primary.main', textDecoration: 'underline' }}
            >
              {t('browse')}
            </Box>
            {t('on your device')}
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}
