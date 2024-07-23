import { useState, useEffect } from 'react';

import { useRouter, useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';
import axios from 'axios';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function GuestGuard({ children }: Props) {
  const router = useRouter();

  const searchParams = useSearchParams();

  const { loading, authenticated } = useAuthContext();

  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [isBackendAlive, setIsBackendAlive] = useState<boolean>(false)

  const returnTo = searchParams.get('returnTo') || CONFIG.auth.redirectPath;

  useEffect(() => {
    axios.get('http://localhost:4000/isAlive').then(res => {
      setIsBackendAlive(true)
    }).catch(err => {
      console.log(err)
      setIsBackendAlive(false)
    })
    // setIsChecking(false)
  }, [])

  const checkPermissions = async (): Promise<void> => {
    if (loading) {
      return;
    }

    if (authenticated) {
      router.replace(returnTo);
      return;
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

  if (!isBackendAlive) {
    return <div>Server unavailable</div>
  }

  return <>{children}</>;
}
