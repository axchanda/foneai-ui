import { cu } from '@fullcalendar/core/internal-common';
import { Button } from '@mui/material';
import { initializePaddle, Paddle } from '@paddle/paddle-js';
import { set } from 'nprogress';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from 'src/auth/context/jwt/hooks';
import { useTranslate } from 'src/locales';
import { useRouter } from 'src/routes/hooks';
import { fCurrency } from 'src/utils/format-number';

const PaddleDialog: React.FC<{
  quantity: number;
}> = ({
  quantity
}) => {
  // Create a local state to store Paddle instance
  const [paddle, setPaddle] = useState<Paddle>();
  const {currentLang, t} = useTranslate();
  console.log(currentLang);
  const { user } = useAuth();
  const router = useRouter();
  // Download and initialize Paddle instance from CDN
  useEffect(() => {
    initializePaddle({ 
      environment: 'sandbox', 
      token: 'test_0dfd24e934851ebe5e6d1f36210',
      eventCallback: (data) => {
        console.log(data);
        if(data.name === "checkout.completed") {
          toast.success('Payment successful');
          setTimeout(() => {
            paddle?.Checkout.close();
            router.push('/dashboard');
            window.location.reload();
          }, 5000);
        }
        if(data.name === "checkout.payment.failed") {
          toast.error('Payment failed');
          setTimeout(() => {
            paddle?.Checkout.close();
            window.location.reload();
          }, 2000);
        }

        if(data.name === "checkout.closed") {
          toast.error('Payment cancelled');
        }
      }
    }).then(
      (paddleInstance: Paddle | undefined) => {
        if (paddleInstance) {
          setPaddle(paddleInstance);
        }
      },
    );

  }, []);

  // Callback to open a checkout
  const openCheckout = () => {
    if(user?.username && paddle) {
      paddle?.Checkout.open({
        items: [{
          priceId: 'pri_01je9t74mycpwgfcvd6bbf1v6t', 
          quantity
        }],
        settings: {
          locale: currentLang.value ? currentLang.value : 'en'
        },
        customData: {
          username: user?.username
        }
      });
    } else {
      toast.error('Please sign in to continue');
    }
  };

  return <Button
    fullWidth
    size="large"
    color="inherit"
    variant="contained"
    disabled={quantity < 10}
    onClick={()=>openCheckout()}
  >
    {t('Pay $')} {(quantity)}
  </Button>
}

export { PaddleDialog };