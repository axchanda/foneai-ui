import type { PropsWithChildren } from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from 'src/auth/context/jwt/hooks';
import API from 'src/utils/API';

type IUsageContext = {
  credits: {
    available: number;
    used: number;
  }
  channels: number;
  loading: boolean;
};

const UsageContext = createContext<IUsageContext>({
  channels: 0,
  credits: {
    available: 0,
    used: 0,
  },
  loading: true,
});

export const UsageContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { authenticated } = useAuth();

  const [state, setState] = useState<IUsageContext>({
    channels: 0,
    credits: {
      available: 0,
      used: 0,
    },
    loading: true,
  });

  const getUsage = useCallback(async () => {
    const {data} = await API.get('/usage');
    console.log('Usage: ', data);
    let channels = data.channels,
        available = data.credits.available,
        used = data.credits.used;

    setState({
      channels,
      credits: {
        available,
        used,
      },
      loading: false,
    });
  }, []);

  useEffect(() => {
    if (authenticated) {
      getUsage();
    }
  }, [authenticated, getUsage]);

  return <UsageContext.Provider value={state}>{children}</UsageContext.Provider>;
};

export const useUsage = () => useContext(UsageContext);
