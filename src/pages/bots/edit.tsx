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

  const [isUsedInCampaigns, setIsUsedInCampaigns] = useState(false);

  const getBot = useCallback(async () => {
    const botPromise = API.get<IBotType>(`/bots/${id}`);
    const usedPromise = API.get<{ count: number }>(`/bots/${id}/isUsedInCampaigns`);
    const [
      { data },
      {
        data: { count },
      },
    ] = await Promise.all([botPromise, usedPromise]);
    setBot(data);
    console.log(count);
    setIsUsedInCampaigns(count > 0);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    getBot();
  }, [getBot]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit bot"
        // links={[
        //   { name: 'Dashboard', href: paths.dashboard.root },
        //   { name: 'Job', href: paths.dashboard.job.root },
        //   { name: job?.title },
        // ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {loading ? (
        <LoadingScreen />
      ) : (
        <BotNewEditForm isUsed={isUsedInCampaigns} currentBot={bot!} />
      )}
    </DashboardContent>
  );
}

export default BotEdit;
