import type { CardProps } from '@mui/material/Card';
import type { InputProps } from '@mui/material/Input';
import type { DialogProps } from '@mui/material/Dialog';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Slider from '@mui/material/Slider';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import DialogActions from '@mui/material/DialogActions';
import Input, { inputClasses } from '@mui/material/Input';

import { useBoolean } from 'src/hooks/use-boolean';

import { fCurrency } from 'src/utils/format-number';

import { varAlpha, stylesMode } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { Carousel, useCarousel, CarouselArrowFloatButtons } from 'src/components/carousel';
import Card from '@mui/material/Card';
import { PaddleDialog } from 'src/components/checkout/paddle-dialog';

// ----------------------------------------------------------------------

const STEP = 50;

const MIN_AMOUNT = 0;

const MAX_AMOUNT = 1250;

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  list?: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
  }[];
};

export default function Checkout({ title, subheader, list, sx, ...other }: Props) {
  const theme = useTheme();

  const [amount, setAmount] = useState(50);

  const [autoWidth, setAutoWidth] = useState(24);


  useEffect(() => {
    if (amount) {
      handleAutoWidth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount]);

  const handleAutoWidth = useCallback(() => {
    const getNumberLength = amount.toString().length;
    setAutoWidth(getNumberLength * 24);
  }, [amount]);

  const handleChangeSlider = useCallback((event: Event, newValue: number | number[]) => {
    setAmount(newValue as number);
  }, []);

  const handleChangeInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(event.target.value));
  }, []);

  const handleBlur = useCallback(() => {
    if (amount < 10) {
      setAmount(10);
    } else if (amount > MAX_AMOUNT) {
      setAmount(MAX_AMOUNT);
    }
  }, [amount]);

  const [costPerCredit, setCostPerCredit] = useState(0.05);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    setCredits(amount / costPerCredit);
  }, [amount, costPerCredit]);

  useEffect(() => {
    // convert amount decimal to integer
    setAmount(Math.round(amount));
  }, [amount]);

  const renderInput = (
    <Card
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: 3,
        width: 500,
        padding: 6
      }}
    >
      
      <Typography variant="overline" sx={{ color: 'text.secondary' }}>
        Top Up account with 
      </Typography>

      <InputAmount
        amount={amount}
        onBlur={handleBlur}
        autoWidth={autoWidth}
        onChange={handleChangeInput}
        sx={{ my: 3 }}
      />

      <Slider
        value={typeof amount === 'number' ? amount : 50}
        valueLabelDisplay="auto"
        step={STEP}
        marks
        min={MIN_AMOUNT}
        max={MAX_AMOUNT}
        onChange={handleChangeSlider}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', typography: 'subtitle5' }}>
        <Box component="span" sx={{ flexGrow: 1, marginRight: 5 }}>
          Cost per credit (USD) : 
        </Box>
        <Typography>
          {fCurrency(costPerCredit)}
        </Typography>
      </Box>
      <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', typography: 'subtitle1' }}>
        <Box component="span" sx={{ flexGrow: 1, marginRight: 5 }}>
          Credits you will get : 
        </Box>
        <Typography variant="h3" sx={{ color: 'primary.main' }}>
          {credits}
        </Typography>
      </Box>
      <PaddleDialog quantity={amount} />

      {(amount < 10) && <Typography variant="caption" sx={{ color: 'error.main' }}>
        Minimum top up amount is 10 USD
      </Typography>}
    </Card>
  );

  return (
      <Box sx={{ margin: 'auto', borderRadius: 2, bgcolor: 'background.neutral', justifyContent: 'center', ...sx }} {...other}>
        <CardHeader title={'Purchase Credits'} subheader={'Adjust the amount to purchase credits'} />

        <Box sx={{ p: 3 }}>
          {renderInput}
        </Box>
      </Box>
  );
}

// ----------------------------------------------------------------------

type InputAmountProps = InputProps & {
  autoWidth: number;
  amount: number | number[];
};

function InputAmount({ autoWidth, amount, onBlur, onChange, sx, ...other }: InputAmountProps) {
  return (
    // center it in the middle

    <Box sx={{ margin: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', ...sx }}>
      <Box component="span" sx={{ typography: 'h5' }}>
        USD
      </Box>

      <Input
        disableUnderline
        size="small"
        value={amount}
        onChange={onChange}
        onBlur={onBlur}
        inputProps={{
          step: STEP,
          min: MIN_AMOUNT,
          max: MAX_AMOUNT,
          type: 'number',
          id: 'input-amount',
        }}
        sx={{
          [`& .${inputClasses.input}`]: {
            p: 0,
            typography: 'h3',
            textAlign: 'center',
            width: autoWidth,
          },
        }}
        {...other}
      />
    </Box>
  );
}