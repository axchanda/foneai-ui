import { useState, useEffect, useCallback } from 'react';

import { useRouter, useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { SplashScreen } from 'src/components/loading-screen';

import axios from 'axios';
import { useAuth } from '../context/jwt/hooks';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function GuestGuard({ children }: Props) {
  const router = useRouter();

  const searchParams = useSearchParams();

  const { loading, authenticated } = useAuth();

  const [isChecking, setIsChecking] = useState<boolean>(true);

  const returnTo = searchParams.get('returnTo') || CONFIG.auth.redirectPath;

  const checkForBackendAvailability = useCallback(async () => {
    try {
      await axios.get(`${CONFIG.backendURL}/isAlive`);
      return true;
    } catch (error) {
      return false;
    }
  }, []);

  const checkPermissions = async (): Promise<void> => {
    if (loading) {
      return;
    }

    if (authenticated) {
      router.replace(returnTo);
      return;
    }
    const isBackendAlive = await checkForBackendAvailability();

    if (!isBackendAlive) {
      router.replace('/error');
    }

    setIsChecking(false);
  };

  useEffect(() => {
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, loading]);

  if (isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
