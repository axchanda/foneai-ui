import type { Dispatch, SetStateAction } from 'react';
import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import type { IBotType } from 'src/types/bot';
import { deleteBot } from 'src/utils/api/bots';
import { BotItem } from './bot-item';

// ----------------------------------------------------------------------

type Props = {
  bots: IBotType[];
  setBots: Dispatch<SetStateAction<IBotType[]>>;
};

export function BotList({ bots, setBots }: Props) {
  const router = useRouter();

  const handleView = useCallback(
    (id: string) => {
      router.push(paths.dashboard.job.details(id));
    },
    [router]
  );

  const handleEdit = useCallback(
    (id: string) => {
      router.push(`/bots/${id}`);
    },
    [router]
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteBot(id, () => {
        setBots((prevBots) => prevBots.filter((bot) => bot._id !== id));
      });
    },
    [setBots]
  );

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
      >
        {bots.map((bot) => (
          <BotItem
            key={bot._id}
            bot={bot}
            onView={() => handleView(bot._id)}
            onEdit={() => handleEdit(bot._id)}
            onDelete={() => handleDelete(bot._id)}
          />
        ))}
      </Box>

      {bots.length > 8 && (
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
