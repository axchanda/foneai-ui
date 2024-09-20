import type { PropsWithChildren } from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from 'src/auth/context/jwt/hooks';
import API from 'src/utils/API';

type IUsageContext = {
  credits: {
    available: number;
    used: number;
  };
  costPerMinute: number;
  costPerChannel: number;
  channels: number;
  minutes: number;
  loading: boolean;
};

const UsageContext = createContext<IUsageContext>({
  channels: 0,
  costPerChannel: 0,
  costPerMinute: 0,
  credits: {
    available: 0,
    used: 0,
  },
  minutes: 0,
  loading: true,
});

export const UsageContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { authenticated } = useAuth();

  const [state, setState] = useState<IUsageContext>({
    channels: 0,
    costPerChannel: 0,
    costPerMinute: 0,
    credits: {
      available: 0,
      used: 0,
    },
    minutes: 0,
    loading: true,
  });

  const getUsage = useCallback(async () => {
    const planPromise = API.get<{
      costPerMinute: number;
      costPerChannel: number;
    }>('/plans/getUserPlans');
    const usagePromise = API.get<{
      channels: number;
      minutes: number;
    }>('/usage');

    const creditsPromise = API.get<{
      available: number;
      used: number;
    }>('/credits');

    const [
      {
        data: { costPerChannel, costPerMinute },
      },
      {
        data: { channels, minutes },
      },
      {
        data: { available, used },
      },
    ] = await Promise.all([planPromise, usagePromise, creditsPromise]);

    setState({
      costPerMinute,
      costPerChannel,
      channels,
      minutes,
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
