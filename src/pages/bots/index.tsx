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
import type { ICampaignType } from 'src/types/campaign';

function Bots() {
  const [notFound, setNotfound] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [bots, setBots] = useState<IBotType[]>([]);
  const [usedBots, setUsedBots] = useState<string[]>([]);

  const getData = useCallback(async () => {
    const botsPromise = API.get<{
      bots: IBotType[];
      count: number;
    }>('/bots');
    const campaignsPromise = API.get<{
      campaigns: ICampaignType[];
      count: number;
    }>('/campaigns');
    const [
      { data },
      {
        data: { campaigns },
      },
    ] = await Promise.all([botsPromise, campaignsPromise]);
    setBots(data.bots);
    const used = campaigns.map((campaign) => campaign.linkedBot);
    setUsedBots(used);
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
          {notFound && <EmptyContent filled sx={{ py: 10 }} />}
          <BotList bots={bots} setBots={setBots} usedBots={usedBots} />
        </>
      ) : (
        <LoadingScreen />
      )}
    </DashboardContent>
  );
}

export default Bots;
