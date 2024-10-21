import type { IJobItem } from 'src/types/job';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useCallback, useEffect, useState } from 'react';
import { LoadingScreen } from 'src/components/loading-screen';
import { useParams } from 'react-router';
import API from 'src/utils/API';
import type { IBotType } from 'src/types/bot';
import { BotNewEditForm } from 'src/sections/bots/bot-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  job?: IJobItem;
};

function BotEdit({ job }: Props) {
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [bot, setBot] = useState<IBotType | null>(null);


  const getBot = useCallback(async () => {
    const botPromise = API.get<any>(`/bots/${id}`);
    const { data } = await botPromise;
    setBot(data.bot);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    getBot();
  }, [getBot]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit bot"
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {loading ? (
        <LoadingScreen />
      ) : (
        <BotNewEditForm currentBot={bot!} />
      )}
    </DashboardContent>
  );
}

export default BotEdit;
