import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { useBoolean } from 'src/hooks/use-boolean';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Icon,
  Divider,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { Typography } from '@mui/material';
import { ILogType } from 'src/types/log';
import { Label } from 'src/components/label';
import { useRouter } from 'src/routes/hooks';
// ----------------------------------------------------------------------

type Props = {
  row: ILogType;
  selected?: boolean;
  onOpenRow: () => void;
  onDeleteRow: () => void;
};

export function LogTableRow({
  row,
  onOpenRow,
  onDeleteRow,
}: Props) {
  const confirm = useBoolean();
  const router = useRouter();
  const logParamsDialog = useBoolean();
  const popover = usePopover();
  const quickEdit = useBoolean();

  function transformDate(dateInput: Date | string): string {
    const now = new Date(dateInput);  
    return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')} ${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}:${String(now.getUTCSeconds()).padStart(2, '0')}`;
  }

  function transformLanguageCode(langCode: string): string {
    const languages: any = {
      en: 'English',
      es: 'Spanish',
      fr: 'French',
      de: 'German',
      it: 'Italian'
    };
    return langCode  && languages[langCode]
  }

  function transformMillisecondsToTimeFormat(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    // dont show hours if its 0, and return like 00:32 ; truncate seconds to 2 digits and dont show hours if its 0
    return `${hours > 0 ? String(hours).padStart(2, '0') + ':' : ''}${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  }
  
  return (
    <>
      <TableRow
        hover
        onDoubleClick={
          () => {
            logParamsDialog.onTrue();
          }
        }
        tabIndex={-1}
      >
        <TableCell padding="checkbox">
          {row.sessionParams?.connectionType === 'asterisk' ? (
            <Iconify width={16} icon={'simple-icons:asterisk'} color="orange" sx={{ flexShrink: 0 }} />
          ) : (
            <Iconify width={16} icon={'simple-icons:twilio'} color="blue" sx={{ flexShrink: 0 }} />
          )}
        </TableCell>
        <TableCell>
            {row._id}
        </TableCell>
        <TableCell>
            {row.sessionParams?.sessionStart ? transformDate(row.sessionParams?.sessionStart) : 'N/A'}
        </TableCell>
        <TableCell>
            {row.sessionParams?.sessionEnd ? transformDate(row.sessionParams?.sessionEnd) : 'N/A'}
        </TableCell>
        <TableCell>
            {row.sessionDurationInMinutes ? String(row.sessionDurationInMinutes) : 1}
        </TableCell>
        <TableCell>
            {row.creditsPerMinute ? String(row.creditsPerMinute) : 1}
        </TableCell>
        <TableCell>
            {row.sessionCreditsCharged ? String(row.sessionCreditsCharged) : 1}
        </TableCell>
        <TableCell>
            {(row.sessionParams?.campaign && row.sessionParams?.campaign.campaignName) ? row.sessionParams?.campaign.campaignName : 'N/A'}
        </TableCell> 
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Label>
              {row.sessionParams?.linkedAppType?.toUpperCase() || 'AGENT'}
            </Label>
            <Typography variant="subtitle2" noWrap>
              {row.sessionParams?.linkedApp?.name || 'N/A'}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>
          <Stack direction="row" justifyContent="end" alignItems="end">
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Stack>
        </TableCell>
      </TableRow>

      {/* <UserQuickEditForm currentUser={row} open={quickEdit.value} onClose={quickEdit.onFalse} /> */}

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              popover.onClose();
              logParamsDialog.onTrue();
            }}
          >
            <Iconify icon="material-symbols:details" />
            View Session Parameters
          </MenuItem>
          <MenuItem
            onClick={() => {
              popover.onClose();
              router.push(`/logs/${row._id}`);
            }}
          >
            <Iconify icon="eva:file-text-outline" />
            View Transcript
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete Log Entry"
        content={`Are you sure want to delete the log entry: ${String(row._id)}?`}
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />


      <Dialog
        open={logParamsDialog.value}
        onClose={() => {
          logParamsDialog.onFalse();
        }}
        sx={{
          '& .MuiDialog-paper': {
            width: '1000px', // Set your desired width
            maxWidth: '90%', // Optional: make it responsive
          }
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Session Parameters for Log ID: {row._id}
        </DialogTitle>
        <Divider />
        
        <DialogContent>
          <DialogContentText id="alert-dialog-description" padding={2}>
            <Grid container spacing={3}>
              {/* First Column */}
              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Session Start</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      {row.sessionParams?.sessionStart ? transformDate(row.sessionParams.sessionStart) : 'N/A'}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Campaign</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      {row.sessionParams?.campaign?.campaignName || 'N/A'}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Connection Type</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">{row.sessionParams?.connectionType || 'N/A'}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Language</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      {row.sessionParams?.language
                        ? transformLanguageCode(row.sessionParams.language): 
                        'N/A'}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2">TTS Provider</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">{row.sessionParams?.ttsProvider || 'N/A'}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Voice ID</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">{row.sessionParams?.voiceId || 'N/A'}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Session Duration</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      {row?.sessionDuration
                        ? transformMillisecondsToTimeFormat(row.sessionDuration)
                        : 'N/A'}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Session Minutes (SM)</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">{row.sessionDurationInMinutes}</Typography>
                  </Grid>

                </Grid>
              </Grid>

              {/* Second Column */}
              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Session End</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      {row.sessionParams?.sessionEnd ? transformDate(row.sessionParams.sessionEnd) : 'N/A'}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2">App</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Label>{row.sessionParams?.linkedAppType?.toUpperCase() || 'AGENT'}</Label>
                      <Typography variant="body2">{row.sessionParams?.linkedApp?.name || 'N/A'}</Typography>
                    </Stack>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Connection Charges</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">{row.sessionRates?.costConnectionType}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Language Charges</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">{row.sessionRates?.costLanguage}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2">TTS Charges</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">{row.sessionRates?.costTTSProvider}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Voice ID Charges</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">{row.sessionRates?.costVoiceId}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Charges per minute (CPM)</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">{row.creditsPerMinute}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Total charges (SM x CPM)</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">{row.sessionCreditsCharged}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={() => {
            logParamsDialog.onFalse();
          }} color="error" variant='outlined'>
            Close
          </Button>
          <Button
             onClick={() => {
              router.push(`/logs/${row._id}`);
            }} 
            color="primary" 
            autoFocus 
            variant='contained'
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Iconify icon="eva:file-text-outline" />
              <Typography variant="button">View Transcript</Typography>
              <Iconify icon="si:arrow-left-fill" sx={{
                transform: 'rotate(135deg)'
              }} />
            </Stack>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
