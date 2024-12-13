import type { Dispatch, SetStateAction } from 'react';
import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import type { IAgentListType } from 'src/types/agent';
import { deleteAgent } from 'src/utils/api/agents';
import { useBoolean } from 'src/hooks/use-boolean';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { AgentItem } from './agent-item';

// ----------------------------------------------------------------------

type Props = {
  agents: IAgentListType[];
  setAgents: Dispatch<SetStateAction<IAgentListType[]>>;
};

export function AgentList({ agents, setAgents }: Props) {
  const router = useRouter();
  const alertDialog = useBoolean();

  const handleView = useCallback(
    (id: string) => {
      router.push(paths.dashboard.job.details(id));
    },
    [router]
  );

  const handleEdit = useCallback(
    (id: string) => {
      router.push(`/agents/${id}`);
    },
    [router]
  );

  const handleDelete = useCallback(
    (id: string) => {
        deleteAgent(id, () => {
          setAgents((prevAgents) => prevAgents.filter((agent) => agent._id !== id));
        });
      },
    [setAgents]
  );

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
      >
        {agents.map((agent) => (
          <AgentItem
            key={agent._id}
            agent={agent}
            onView={() => handleView(agent._id)}
            onEdit={() => handleEdit(agent._id)}
            onDelete={() => handleDelete(agent._id)}
          />
        ))}
      </Box>

      {agents.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: { xs: 8, md: 8 },
            [`& .${paginationClasses.ul}`]: { justifyContent: 'center' },
          }}
        />
      )}
    </>
  );
}
