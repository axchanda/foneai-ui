import { LoadingButton } from '@mui/lab';
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
import { use } from 'i18next';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import useClipboard from 'react-use-clipboard';
import { toast } from 'sonner';
import { _mock } from 'src/_mock';
import { Iconify } from 'src/components/iconify';
import { CONFIG } from 'src/config-global';
import { useBoolean } from 'src/hooks/use-boolean';
import { DashboardContent } from 'src/layouts/dashboard';
import { ApiKeyTable } from 'src/sections/integrations/table';
import { IApiKeyItem } from 'src/types/apiKey';
import API from 'src/utils/API';

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

const AsteriskIntegrationPage: React.FC = () => {
  const openApiKeyDialog = useBoolean();
  const [apiKeys, setApiKeys] = React.useState<IApiKeyItem[]>([]);
  const [comment, setComment] = React.useState('');
  const loaded = useBoolean();

  useEffect(() => {
    const fetchApiKeys = async () => {
      const { data } = await API.get('/apiKeys');
      console.log(data);
      setApiKeys(data);
      loaded.onTrue();
    }
    fetchApiKeys();
  }, []);

  useEffect(() => {
    if (comment) {
      openApiKeyDialog.onTrue();
    }
  }, [comment]);
  

  return (
    <>
      <Helmet>
        <title>{CONFIG.site.name}</title>
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
            <Typography mb={4} mt={2} variant="subtitle2" textAlign="justify">
              This executable application integrates Asterisk with Fone AI for real-time audio
              processing. The application relies on Asterisk&apos;s ARI (Asterisk REST Interface)
              feature to control and manage audio streams dynamically, facilitating advanced call
              handling and external audio processing in real time.
            </Typography>
            <Button size="large" variant="contained" color="primary">
              <Iconify icon="bx:bx-download" mr={2} />
              <Divider orientation="vertical" color="white" />
              <Typography ml={2} variant="subtitle1">
                Download the client app
              </Typography>
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
        { loaded.value && (
          <>
          <Box mt={12} mb={2} display="flex" justifyContent="space-between">
            <Typography variant="h5">API Key</Typography>
              { apiKeys.length == 0 && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={openApiKeyDialog.onTrue}
                  startIcon={<Iconify icon="bx:bx-plus" />}
                >
                  Create new API key
                </Button>
              ) }
          </Box>
          <ApiKeyTable 
            apiKeys={apiKeys}
            setComment={setComment}
          />
          </> )}
      </DashboardContent>
      <CreateApiKeyDialog open={openApiKeyDialog.value} onClose={openApiKeyDialog.onFalse} comment={comment} />
    </>
  );
};

const CreateApiKeyDialog = ({ open, onClose, comment }: { open: boolean; onClose: () => void, comment: string }) => {
  const openConfirmationDialog = useBoolean();
  const creating = useBoolean();
  const [apiKeyComment, setApiKeyComment] = React.useState(comment);
  const [createdApiKey, setCreatedApiKey] = React.useState('');

  const createNewApiKey = async (comment: string) => {
    const createNewApiKeyPromise = API.post('/apiKeys/create', {
      comment
    });    
    try {
      const { data } = await createNewApiKeyPromise;
      if (!data) {
        toast.error('Failed to create API key');
        creating.onFalse();
        return;
      }
      setCreatedApiKey(data.apiKey);
    } catch (error) {
      toast.error('Failed to create API key');
      creating.onFalse();
    }
  }

  const rotateApiKey = async (comment: string) => {
    const rotateApiKeyPromise = API.post('/apiKeys/rotate', {
      comment
    });
    try {
      const { data } = await rotateApiKeyPromise;
      if (!data) {
        toast.error('Failed to rotate API key');
        creating.onFalse();
        return;
      }
      setCreatedApiKey(data.apiKey);
    } catch (error) {
      toast.error('Failed to rotate API key');
      creating.onFalse();
    }
  }

  useEffect(() => {
    console.log(createdApiKey);
    if (createdApiKey.trim()) {
      creating.onFalse();
      // show create success toast when API key is created & rotate success toast when API key is rotated
      if(comment) {
        toast.success('API key rotated successfully');
      } else {
        toast.success('API key created successfully');
      }
      onClose();
      openConfirmationDialog.onTrue();
    }
  }, [createdApiKey]);

  const handleClose = (event: {}, reason: string) => {
    if (reason !== 'backdropClick') {
      onClose();
    }
  };

  return (
    <>
      <Dialog fullWidth maxWidth="xs" open={open} onClose={handleClose}>
        <DialogTitle sx={{ pb: 2 }}>
          { comment ? "Rotate API Key" : "Create New API Key" }
        </DialogTitle>
        <DialogContent sx={{ typography: 'body2' }}>
          <Typography fontWeight="600">Enter comment</Typography>
          <TextField
            fullWidth
            inputProps={{
              autoComplete: 'off',
            }}
            name="comment"
            placeholder="e.g. My API key"
            value={apiKeyComment}
            onChange={(e) => setApiKeyComment(e.target.value)}
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
          <LoadingButton
            loading={creating.value}
            variant="contained"
            color="primary"
            onClick={async () => {
              creating.onTrue();
              if(comment) {
                rotateApiKey(apiKeyComment);
                return;
              } else {
                createNewApiKey(apiKeyComment);
                return;
              }
            }}
            disabled={!apiKeyComment}
          >
            { comment ? "Rotate" : "Create" }
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <ApiKeyConfirmationDialog
        createdApiKey={createdApiKey}
        open={openConfirmationDialog.value}
        onClose={() => {
          setApiKeyComment('');
          openConfirmationDialog.onFalse();
        }}
        onConfirm={() => {
          openConfirmationDialog.onFalse();
          setApiKeyComment('');
          onClose();
          window.location.reload();
        }}
        apiKeyComment={apiKeyComment}
      />
    </>
  );
};

const ApiKeyConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  apiKeyComment,
  createdApiKey,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  apiKeyComment: string;
  createdApiKey: string;
}) => {
  const [isCopied, setCopied] = useClipboard(createdApiKey, {
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
              {apiKeyComment}
            </Typography>
          </>
          {/* <Divider sx={{ margin: '15px 0' }} /> */}
          <>
            <Typography variant="subtitle2" mt={2} mb={1} color="#919EAB">
              Secret:
            </Typography>
            <Box px={2} py={4} borderRadius="8px" position="relative" bgcolor="black" color="white">
              <Typography>
                { createdApiKey }
              </Typography>
              <IconButton
                sx={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  color: 'white',
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
        {!agreed ? (
          <Tooltip title="Click on the 'I have copied the key' checkbox">
            <span>
              <Button disabled variant="contained" color="primary">
                OK, got it
              </Button>
            </span>
          </Tooltip>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setAgreed(false);
              onConfirm();
            }}
          >
            OK, got it
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AsteriskIntegrationPage;
