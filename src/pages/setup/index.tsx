import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  IconButton,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Divider,
  Tooltip,
} from '@mui/material';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import useClipboard from 'react-use-clipboard';
import { _mock } from 'src/_mock';
import { Iconify } from 'src/components/iconify';
import { CONFIG } from 'src/config-global';
import { useBoolean } from 'src/hooks/use-boolean';
import { DashboardContent } from 'src/layouts/dashboard';
import { SetupTable } from 'src/sections/setup/table';

const faqs = [
  {
    question: 'What is the basic requirement to run the client app?',
    answer:
      'The client app is a standalone executable application that can run on any Linux machine. The app requires an active internet connection to communicate with the Fone AI server and Asterisk server. The app also requires the Asterisk server to have a version above 16.6 and have the ARI (Asterisk REST Interface) module enabled and configured.',
  },
  {
    question: 'How do I enable the ARI module and other requirements on my Asterisk server?',
    answer:
      'Enabling the ARI module and other requirements on your Asterisk server is a simple process. You can follow the official Asterisk documentation to enable the ARI module, create an user and configure the required settings. If you need help, you can contact our support team for assistance.',
  },
  {
    question: 'How do I configure the client app to work with my Asterisk server?',
    answer:
      'The client app requires the Asterisk server IP address, port, username and password to connect to the Asterisk server. You can configure these settings in the config.json file that is provided with the executable. Once the settings are configured, the client app will connect to the Asterisk server and start processing audio streams in real time.',
  },
  {
    question: 'Does the client app support other PBX systems such as FreeSWITCH, Cisco or Avaya?',
    answer:
      'At present, the client app only supports Asterisk PBX systems. However, we are working on adding support for other PBX systems such as FreeSWITCH, Cisco and Avaya in the future. If you have a specific requirement, you can contact our support team for more information.',
  },
];

const SetupPage: React.FC = () => {
  const openApiKeyDialog = useBoolean();
  return (
    <>
      <Helmet>
        <title>
          {CONFIG.site.name}
        </title>
      </Helmet>
      <DashboardContent
        sx={{
          pt: 8,
        }}
      >
        <Grid container spacing={12}>
          <Grid item xs={12} md={4}>
            <Typography variant="h4" sx={{ whiteSpace: 'pre-line', mb: 1 }}>
              
              Download Asterisk Client
            </Typography>
            <Typography mb={4} mt={2} variant="subtitle2"
              textAlign={"justify"}
            >
              This executable application integrates Asterisk with Fone AI for real-time audio processing.
              The application relies on Asterisk's ARI (Asterisk REST Interface) feature to control and manage audio streams dynamically, facilitating advanced call handling and external audio processing in real time.
            </Typography>
            <Button size="large" variant="contained" color="primary">
              <Iconify icon="bx:bx-download" mr={2} />
              <Divider orientation="vertical" color="white"/>
              <Typography ml={2} variant="subtitle1">Download the client app</Typography>
            </Button>
          </Grid>
          <Grid item xs={12} md={8}>
            {faqs.map((accordion) => (
              <Accordion key={accordion.question}>
                <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                  <Typography py={1} variant="subtitle1">
                    {accordion.question}
                  </Typography>
                </AccordionSummary>

                <AccordionDetails>
                  <Typography>{accordion.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Grid>
        </Grid>
        <Box mt={12} mb={2} display="flex" justifyContent="space-between">
          <Typography variant="h5">Api Keys</Typography>
          <Button onClick={openApiKeyDialog.onTrue} variant="contained" color="primary">
            Create new key
          </Button>
        </Box>
        <SetupTable />
      </DashboardContent>
      <CreateApiKeyDialog open={openApiKeyDialog.value} onClose={openApiKeyDialog.onFalse} />
    </>
  );
};

const CreateApiKeyDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const openConfirmationDialog = useBoolean();
  const [apiKeyName, setApiKeyName] = React.useState('');
  const [expiration, setExpiration] = React.useState('never');

  const handleClose = (event: {}, reason: string) => {
    if (reason !== 'backdropClick') {
      onClose();
    }
  };
  return (
    <>
      <Dialog fullWidth maxWidth="xs" open={open} onClose={handleClose}>
        <DialogTitle sx={{ pb: 2 }}>Create New API Key</DialogTitle>
        <DialogContent sx={{ typography: 'body2' }}>
          <Typography fontWeight="600">Enter name</Typography>
          <Typography variant="subtitle2" mt={2} mb={1} color="#919EAB">
            Friendly name (comment)
          </Typography>
          <TextField
            fullWidth
            inputProps={{
              autoComplete: 'off',
            }}
            name="comment"
            placeholder="e.g. My API key"
            value={apiKeyName}
            onChange={(e) => setApiKeyName(e.target.value)}
          />
          {/* <Divider sx={{ margin: '15px 0' }} /> */}
          {/* <li>
              <Typography mb={2} mt={4} fontWeight="600">
                Set expiration
              </Typography>
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  // defaultValue="never"
                  name="radio-buttons-group"
                  value={expiration}
                  onChange={(e) => setExpiration(e.target.value)}
                >
                  <FormControlLabel value="never" control={<Radio />} label="Never" />
                  <FormControlLabel value="duration" control={<Radio />} label="Duration" />
                  <FormControlLabel value="date" control={<Radio />} label="Date" />
                </RadioGroup>
              </FormControl>
            </li> */}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="error" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              onClose();
              openConfirmationDialog.onTrue();
            }}
            disabled={!apiKeyName}
          >
            Create key
          </Button>
        </DialogActions>
      </Dialog>
      <SetupConfirmationDialog
        open={openConfirmationDialog.value}
        onClose={() => {
          setApiKeyName('');
          openConfirmationDialog.onFalse();
        }}
        onConfirm={() => {
          openConfirmationDialog.onFalse();
          setApiKeyName('');
          onClose();
        }}
        apiKeyName={apiKeyName}
        expiration={expiration}
      />
    </>
  );
};

const SetupConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  apiKeyName,
  expiration,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  apiKeyName: string;
  expiration: string;
}) => {
  const [isCopied, setCopied] = useClipboard(_mock.id(4), {
    successDuration: 3000,
  });
  const [agreed, setAgreed] = React.useState(false);

  const handleClose = (event: {}, reason: string) => {
    if (reason !== 'backdropClick') {
      onClose();
    }
  };

  return (
    <Dialog disableEscapeKeyDown fullWidth maxWidth="xs" open={open} onClose={handleClose}>
      <DialogTitle sx={{ pb: 2 }}>Your New API Key</DialogTitle>
      <DialogContent sx={{ typography: 'body2' }}>
        <>
          <>
            <Typography variant="subtitle2" mt={2} mb={1} color="#919EAB">
              Friendly name:
            </Typography>
            <Typography variant="subtitle2" mb={1}>
              {apiKeyName}
            </Typography>
          </>
          {/* <Divider sx={{ margin: '15px 0' }} /> */}
          <>
            <Typography variant="subtitle2" mt={2} mb={1} color="#919EAB">
              Secret:
            </Typography>
            <Box px={2} py={4} borderRadius="8px" position="relative" bgcolor="black">
              <Typography>{_mock.id(4)}</Typography>
              <IconButton
                sx={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  // color: isCopied ? 'green' : undefined,
                }}
                onClick={() => {
                  if (!isCopied) {
                    setCopied();
                  }
                }}
              >
                <Iconify
                  color={isCopied ? 'green' : undefined}
                  icon={isCopied ? 'lets-icons:check-fill' : 'solar:copy-outline'}
                />
              </IconButton>
            </Box>
          </>
          <Typography mt={1} variant="subtitle1">
            Please copy this key and save it in a secure location. For security reasons, we will not
            be able to display it again.
          </Typography>
          <FormGroup
            sx={{
              my: 2,
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  value={agreed}
                  onChange={(e) => {
                    // @ts-ignore
                    setAgreed(e.target.checked);
                  }}
                  name="agree"
                  // label="I have copied the key"
                  required
                />
              }
              label="I have copied the key"
            />
          </FormGroup>
        </>
      </DialogContent>
      <DialogActions>
        {!agreed ? <Tooltip title="Click on the 'I have copied the key' checkbox">
          <span>
          <Button
            disabled={true}
            variant="contained"
            color="primary"
          >
            OK, got it
          </Button>
          </span>
        </Tooltip> : 
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setAgreed(false);
              onConfirm();
            }}
          >
            OK, got it
        </Button>}
      </DialogActions>
    </Dialog>
  );
};

export default SetupPage;
