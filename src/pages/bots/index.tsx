import { useCallback, useEffect, useState } from 'react';

import Button from '@mui/material/Button';

import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { BotList } from 'src/sections/bots/bots-list';
import API from 'src/utils/API';
import { IBotListType } from 'src/types/bot';
import { LoadingScreen } from 'src/components/loading-screen';

function Bots() {
  const [loaded, setLoaded] = useState(false);
  const [bots, setBots] = useState<IBotListType[]>([]);

  const getData = useCallback(async () => {
    const botsPromise = API.get<{
      bots: IBotListType[];
      count: number;
    }>('/botsList');
    const { data }= await botsPromise;
    setBots(data.bots);
    setLoaded(true);
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

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
          {/* {notFound && <EmptyContent filled sx={{ py: 10 }} />} */}
          <BotList bots={bots} setBots={setBots} />
        </>
      ) : (
        <LoadingScreen />
      )}
    </DashboardContent>
  );
}

export default Bots;
