import { Box, Button, Divider, MenuItem, Select, Stack, Switch, Typography } from '@mui/material';
import React from 'react';
import { Iconify } from 'src/components/iconify';
import { Image } from 'src/components/image';

const Credit: React.FC = () => {
  const [autoCharge, setAutoCharge] = React.useState(false);

  return (
    <Stack>
      <Stack alignItems="center" justifyContent="space-between" direction="row">
        <Typography variant="h4">Credit</Typography>
        <Button variant="contained" color="primary">
          Purchase Credit
        </Button>
      </Stack>
      <Divider
        sx={{
          my: 2,
        }}
      />
      <Stack
        py={2}
        px={3}
        borderRadius="12px"
        bgcolor="background.paper"
        alignItems="center"
        justifyContent="space-between"
        direction="row"
      >
        <Stack maxWidth="60%" spacing={1.5}>
          <Typography variant="h4">Credit - $5.30</Typography>
          <Typography variant="subtitle2">
            lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          </Typography>
        </Stack>
        <Image src="/wallet.png" width={120} height={120} />
      </Stack>
      <Stack spacing={3} mt={6}>
        <Stack direction="row" spacing={2.5}>
          <Iconify icon="ion:mail-notification" width={24} />
          <Stack>
            <Typography variant="h6">Notifications</Typography>
            <Typography variant="caption">Get notified when your credit is running low</Typography>
          </Stack>
          <Stack alignItems="end" flex={1}>
            <Switch size="medium" name="notifications" />
          </Stack>
        </Stack>
        <Stack direction="row" spacing={2.5}>
          <Iconify icon="mdi:automatic" width={24} />
          <Stack>
            <Typography variant="h6">Auto-Recharge</Typography>
            <Typography variant="caption">
              Set up auto-recharge to automatically top up your credit when it runs low
            </Typography>
          </Stack>
          <Stack alignItems="end" flex={1}>
            <Switch
              checked={autoCharge}
              onChange={(e) => setAutoCharge(e.target.checked)}
              size="medium"
              inputProps={{ 'aria-label': 'controlled' }}
              name="auto-charge"
            />
          </Stack>
        </Stack>
      </Stack>
      {autoCharge && (
        <Stack spacing={2} px={5}>
          <Divider
            sx={{
              mt: 4,
              mb: 2,
            }}
          />
          <Box rowGap={4} display="grid" gridTemplateColumns="minmax(auto, 400px) 120px">
            <Typography alignSelf="center">When my balance is less than or equal to</Typography>
            <Select
              sx={{
                minWidth: '120px',
              }}
              name="less-than"
              defaultValue={5}
            >
              <MenuItem value="5">$5 USD</MenuItem>
              <MenuItem value="10">$10 USD</MenuItem>
              <MenuItem value="20">$20 USD</MenuItem>
              <MenuItem value="30">$30 USD</MenuItem>
              <MenuItem value="40">$40 USD</MenuItem>
              <MenuItem value="50">$50 USD</MenuItem>
            </Select>
            <Typography alignSelf="center">Recharge a credit balance of amount</Typography>
            <Select
              sx={{
                minWidth: '120px',
              }}
              name="recharge"
              defaultValue={10}
            >
              <MenuItem value="10">$10 USD</MenuItem>
              <MenuItem value="20">$20 USD</MenuItem>
              <MenuItem value="30">$30 USD</MenuItem>
              <MenuItem value="40">$40 USD</MenuItem>
              <MenuItem value="50">$50 USD</MenuItem>
            </Select>
          </Box>
        </Stack>
      )}
    </Stack>
  );
};

export default Credit;
