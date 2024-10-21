import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ZapsNewEditForm } from 'src/sections/zaps/zaps-new-edit-form';
import { useCallback, useEffect, useState } from 'react';
import type { IZapItem } from 'src/types/zap';
import { useParams } from 'react-router';
import API from 'src/utils/API';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

function ZapsEdit() {
  const [zap, setZap] = useState<IZapItem | null>(null);
  const [loaded, setLoaded] = useState(false);
  const { id } = useParams();

  const getZap = useCallback(async () => {
    const { data } = await API.get<IZapItem>('/zaps/' + id);
    setZap(data);
    setLoaded(true);
  }, [id]);

  useEffect(() => {
    getZap();
  }, [getZap]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Zap"
        // links={[
        //   { name: 'Dashboard', href: paths.dashboard.root },
        //   { name: 'Job', href: paths.dashboard.job.root },
        //   { name: 'New job' },
        // ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {loaded ? <ZapsNewEditForm currentZap={ zap || undefined} /> : <LoadingScreen />}
    </DashboardContent>
  );
}

export default ZapsEdit;
