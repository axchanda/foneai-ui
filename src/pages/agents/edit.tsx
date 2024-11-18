import type { IJobItem } from 'src/types/job';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useCallback, useEffect, useState } from 'react';
import { LoadingScreen } from 'src/components/loading-screen';
import { useParams } from 'react-router';
import API from 'src/utils/API';
import type { IAgentType } from 'src/types/agent';
import { AgentNewEditForm } from 'src/sections/agents/agent-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  job?: IJobItem;
};

function AgentEdit({ job }: Props) {
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [agent, setAgent] = useState<IAgentType | null>(null);


  const getAgent = useCallback(async () => {
    const agentPromise = API.get<any>(`/agents/${id}`);
    const { data } = await agentPromise;
    setAgent(data.agent);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    getAgent();
  }, [getAgent]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit agent"
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {loading ? (
        <LoadingScreen />
      ) : (
        <AgentNewEditForm currentAgent={agent!} />
      )}
    </DashboardContent>
  );
}

export default AgentEdit;
