import { useCallback, useEffect, useState } from 'react';

import Button from '@mui/material/Button';

import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { AgentList } from 'src/sections/agents/agents-list';
import API from 'src/utils/API';
import { IAgentListType } from 'src/types/agent';
import { LoadingScreen } from 'src/components/loading-screen';
import { useTranslate } from 'src/locales';

function Agents() {
  const [loaded, setLoaded] = useState(false);
  const [agents, setAgents] = useState<IAgentListType[]>([]);
  const {t} = useTranslate();

  const getData = useCallback(async () => {
    const agentsPromise = API.get<{
      agents: IAgentListType[];
      count: number;
    }>('/agentsList');
    const { data }= await agentsPromise;
    setAgents(data.agents);
    setLoaded(true);
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('Agents')}
        action={
          <Button
            component={RouterLink}
            href="/agents/create"
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            {t('New Agent')}
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {loaded ? (
        <>
          {/* {notFound && <EmptyContent filled sx={{ py: 10 }} />} */}
          <AgentList agents={agents} setAgents={setAgents} />
        </>
      ) : (
        <LoadingScreen />
      )}
    </DashboardContent>
  );
}

export default Agents;
