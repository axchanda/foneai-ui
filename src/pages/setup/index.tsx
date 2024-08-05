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
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Iconify } from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { DashboardContent } from 'src/layouts/dashboard';
import { SetupTable } from 'src/sections/setup/table';

const faqs = [
  {
    question: 'faq 1',
    answer:
      'lorem ipsum dolor sit amet consectetur adipiscing elit in scelerisque eget ipsum ac scelerisque sed euismod molestie condimentum vivamus non augue vitae lorem venenatis elementum',
  },
  {
    question: 'faq 2',
    answer:
      'lorem ipsum dolor sit amet consectetur adipiscing elit in scelerisque eget ipsum ac scelerisque sed euismod molestie condimentum vivamus non augue vitae lorem venenatis elementum',
  },
  {
    question: 'faq 3',
    answer:
      'lorem ipsum dolor sit amet consectetur adipiscing elit in scelerisque eget ipsum ac scelerisque sed euismod molestie condimentum vivamus non augue vitae lorem venenatis elementum',
  },
  {
    question: 'faq 4',
    answer:
      'lorem ipsum dolor sit amet consectetur adipiscing elit in scelerisque eget ipsum ac scelerisque sed euismod molestie condimentum vivamus non augue vitae lorem venenatis elementum',
  },
];

const SetupPage: React.FC = () => {
  const openApiKeyDialog = useBoolean();
  return (
    <>
      <Helmet>
        <title>Fone AI</title>
      </Helmet>
      <DashboardContent maxWidth="xl">
        <Grid container spacing={12}>
          <Grid item xs={12} md={4}>
            <Typography variant="h4" sx={{ whiteSpace: 'pre-line', mb: 1 }}>
              Download the app
            </Typography>
            <Typography mb={4} mt={2} variant="subtitle2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In scelerisque eget ipsum ac
              scelerisque. Sed euismod molestie condimentum. Vivamus non augue vitae lorem venenatis
              elementum.
            </Typography>
            <Button size="large" variant="contained" color="primary">
              Download the app
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
  return (
    <>
      <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
        <DialogTitle sx={{ pb: 2 }}>Create New API Key</DialogTitle>
        <DialogContent sx={{ typography: 'body2' }}>
          <ol>
            <li>
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
                label="Comment"
                placeholder="MY_KEY"
              />
            </li>
            {/* <Divider sx={{ margin: '15px 0' }} /> */}
            <li>
              <Typography mb={2} mt={4} fontWeight="600">
                Set expiration
              </Typography>
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="never"
                  name="radio-buttons-group"
                >
                  <FormControlLabel value="never" control={<Radio />} label="Never" />
                  <FormControlLabel value="duration" control={<Radio />} label="Duration" />
                  <FormControlLabel value="date" control={<Radio />} label="Date" />
                </RadioGroup>
              </FormControl>
            </li>
          </ol>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="error" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              // onClose();
              openConfirmationDialog.onTrue();
            }}
          >
            Create key
          </Button>
        </DialogActions>
      </Dialog>
      <SetupConfirmationDialog
        open={openConfirmationDialog.value}
        onClose={openConfirmationDialog.onFalse}
        onConfirm={() => {
          openConfirmationDialog.onFalse();
          onClose();
        }}
      />
    </>
  );
};

const SetupConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  return (
    <Dialog fullWidth maxWidth="xs" open={open} sx={{ zIndex: 1000 }} onClose={onClose}>
      <DialogTitle sx={{ pb: 2 }}>Create New API Key</DialogTitle>
      <DialogContent sx={{ typography: 'body2' }}>
        <ol>
          <li>
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
              label="Comment"
              placeholder="MY_KEY"
            />
          </li>
          {/* <Divider sx={{ margin: '15px 0' }} /> */}
          <li>
            <Typography mb={2} mt={4} fontWeight="600">
              Set expiration
            </Typography>
            <FormControl>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="never"
                name="radio-buttons-group"
              >
                <FormControlLabel value="never" control={<Radio />} label="Never" />
                <FormControlLabel value="duration" control={<Radio />} label="Duration" />
                <FormControlLabel value="date" control={<Radio />} label="Date" />
              </RadioGroup>
            </FormControl>
          </li>
        </ol>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={onConfirm}>
          Create key
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SetupPage;
