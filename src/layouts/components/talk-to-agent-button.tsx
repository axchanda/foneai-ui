import type { ButtonProps } from '@mui/material/Button';

import Button from '@mui/material/Button';

import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/config-global';
import { Iconify } from 'src/components/iconify';
import { Dialog, Typography } from '@mui/material';

// ----------------------------------------------------------------------

export function TalkToAgentButton({ sx, ...other }: ButtonProps) {
  return (<>
        <Button
            variant="contained"
            sx={{
                ...sx,
                bgcolor: 'default',
                color: 'white',
                // '&:hover': {
                //     bgcolor: 'primary.dark',
                // },
                marginLeft: 'auto',
                marginRight: '1em',
            }}
            {...other}
        >
            <Iconify icon="weui:mike-filled" 
            sx={{ marginRight: '0.5em' }} />
                Talk to the agent
        </Button>
            
    </>
  );
}
