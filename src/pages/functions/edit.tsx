import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { FunctionsNewEditForm } from 'src/sections/functions/functions-new-edit-form';
import { useCallback, useEffect, useState } from 'react';
import type { IFunctionItem } from 'src/types/function';
import { useParams } from 'react-router';
import API from 'src/utils/API';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

function FunctionsEdit() {
  const [func, setFunc] = useState<IFunctionItem | null>(null);
  const [loaded, setLoaded] = useState(false);
  const { id } = useParams();

  const getFunction = useCallback(async () => {
    const { data } = await API.get<IFunctionItem>('/functions/' + id);
    setFunc(data);
    setLoaded(true);
  }, [id]);

  useEffect(() => {
    getFunction();
  }, [getFunction]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit function"
        // links={[
        //   { name: 'Dashboard', href: paths.dashboard.root },
        //   { name: 'Job', href: paths.dashboard.job.root },
        //   { name: 'New job' },
        // ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {loaded ? <FunctionsNewEditForm currentFunction={func || undefined} /> : <LoadingScreen />}
    </DashboardContent>
  );
}

export default FunctionsEdit;
