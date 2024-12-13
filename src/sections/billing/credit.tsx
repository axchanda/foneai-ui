import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { Iconify } from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import type { ICreditType } from 'src/types/credit';
import API from 'src/utils/API';

const Credit: React.FC = () => {
  const [autoCharge, setAutoCharge] = React.useState(false);
  const [credit, setCredit] = React.useState<ICreditType | null>(null);
  const [loading, setLoading] = React.useState(false);

  const openPayment = useBoolean();

  const getCredits = useCallback(async () => {
    setLoading(true);
    const { data } = await API.get<ICreditType>('/credits');
    setCredit(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    getCredits();
  }, [getCredits]);

  return (
    <Stack>
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
          <Typography variant="h4">Credit - ${credit?.available || 0}</Typography>
          <Typography variant="subtitle2">
            lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          </Typography>
        </Stack>
        {/* <Image src="/wallet.png" width={120} height={120} /> */}
        <Button
          disabled={loading}
          onClick={() => {
            if (loading) return;
            openPayment.onTrue();
          }}
          variant="contained"
          color="primary"
        >
          Purchase Credit
        </Button>
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
      <PurchaseCreditDialog open={openPayment.value} onClose={openPayment.onFalse} />
    </Stack>
  );
};

// interface Window {
//   Razorpay: any;rzp_test_BF90O6fh2Tq8gf
//   location: any;
// }

// declare const window: Window;

const displayRazorpay = async (amount: number) => {
  const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

  if (!res) {
    alert('Razorpay SDK failed to load. Are you online?');
    return;
  }

  const { data } = await API.post('/createOrder', { amount, currency: 'INR' });

  const options = {
    key: '',
    currency: data.currency,
    amount: data.amount.toString(),
    order_id: data.id,
    name: 'Charge',
    description: 'Thank you for purchase',
    image: 'http://localhost:8080/logo512.png',
    handler(response: any) {
      window.location.reload();
    },
  };
  // @ts-ignore
  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
};

function loadScript(src: string) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

const PurchaseCreditDialog: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const [amount, setAmount] = React.useState(0);
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle sx={{ pb: 2 }}>Specify Amount</DialogTitle>
      <Divider />
      <DialogContent
        sx={{
          my: 2,
        }}
      >
        <Typography mb={1} variant="body2">
          Amount:
        </Typography>
        <TextField
          fullWidth
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          variant="outlined"
          type="number"
          name="amount"
        />
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button
          onClick={() => {
            if (!amount || amount < 0) {
              toast.error('Please enter a valid amount');
            } else {
              displayRazorpay(amount);
            }
          }}
          variant="contained"
          color="primary"
        >
          Purchase
        </Button>

        <Button variant="outlined" color="inherit" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Credit;
