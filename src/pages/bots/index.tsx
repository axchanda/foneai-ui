import { useCallback, useEffect, useState } from 'react';

import Button from '@mui/material/Button';

import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { BotList } from 'src/sections/bots/bots-list';
import API from 'src/utils/API';
import type { IBotType } from 'src/types/bot';
import { LoadingScreen } from 'src/components/loading-screen';

function Bots() {
  const [notFound, setNotfound] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [bots, setBots] = useState<IBotType[]>([]);

  const getBots = useCallback(async () => {
    const { data } = await API.get<{
      bots: IBotType[];
      count: number;
    }>('/bots');
    setBots(data.bots);
    setLoaded(true);
  }, []);

  useEffect(() => {
    getBots();
  }, [getBots]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Bots"
        action={
          <Button
            component={RouterLink}
            href="/bots/create"
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Bot
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {loaded ? (
        <>
          {notFound && <EmptyContent filled sx={{ py: 10 }} />}
          <BotList bots={bots} setBots={setBots} />
        </>
      ) : (
        <LoadingScreen />
      )}
    </DashboardContent>
  );
}

export default Bots;
