import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ActionsNewEditForm } from 'src/sections/actions/actions-new-edit-form';
import { useCallback, useEffect, useState } from 'react';
import type { IActionItem } from 'src/types/action';
import { useParams } from 'react-router';
import API from 'src/utils/API';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

function ActionsEdit() {
  const [action, setAction] = useState<IActionItem | null>(null);
  const [loaded, setLoaded] = useState(false);
  const { id } = useParams();

  const getAction = useCallback(async () => {
    const { data } = await API.get<IActionItem>('/actions/' + id);
    setAction(data);
    setLoaded(true);
  }, [id]);

  useEffect(() => {
    getAction();
  }, [getAction]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Action"
        // links={[
        //   { name: 'Dashboard', href: paths.dashboard.root },
        //   { name: 'Job', href: paths.dashboard.job.root },
        //   { name: 'New job' },
        // ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {loaded ? <ActionsNewEditForm currentAction={ action || undefined} /> : <LoadingScreen />}
    </DashboardContent>
  );
}

export default ActionsEdit;
