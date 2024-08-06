import type { Dispatch, SetStateAction } from 'react';
import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import type { IBotType } from 'src/types/bot';
import { deleteBot } from 'src/utils/api/bots';
import { useBoolean } from 'src/hooks/use-boolean';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { BotItem } from './bot-item';

// ----------------------------------------------------------------------

type Props = {
  bots: IBotType[];
  setBots: Dispatch<SetStateAction<IBotType[]>>;
  usedBots: string[];
};

export function BotList({ bots, setBots, usedBots }: Props) {
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
      router.push(`/bots/${id}`);
    },
    [router]
  );

  const handleDelete = useCallback(
    (id: string) => {
      if (usedBots.includes(id)) {
        alertDialog.setValue(true);
      } else {
        deleteBot(id, () => {
          setBots((prevBots) => prevBots.filter((bot) => bot._id !== id));
        });
      }
    },
    [setBots, usedBots, alertDialog]
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
      <ConfirmDialog
        title="Unable to delete bot"
        content="This bot is currently being used in a campaign. Please remove it from the campaign before deleting."
        open={alertDialog.value}
        action={<></>}
        onClose={() => {
          alertDialog.setValue(false);
        }}
        closeText="Close"
      />
    </>
  );
}
