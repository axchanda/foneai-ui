import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Iconify } from 'src/components/iconify';
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
  const [isOpen] = useState(false);
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
          <Button variant="contained" color="primary">
            Create new key
          </Button>
        </Box>
        <SetupTable />
      </DashboardContent>
    </>
  );
};

export default SetupPage;
