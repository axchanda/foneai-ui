import type { IUserItem } from 'src/types/user';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useParams } from 'react-router';
import { useCallback, useEffect, useState } from 'react';
import API from 'src/utils/API';
import type { ICampaignType } from 'src/types/campaign';
import { LoadingScreen } from 'src/components/loading-screen';
import { IApiEndpointItem } from 'src/types/apiEndpoint';
import { ApiEndpointNewEditForm } from 'src/sections/api-endpoints/apiEndpoint-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  apiEndpoint?: IApiEndpointItem;
};

export default function ApiEndpointEdit({ apiEndpoint: currentApiEndpoint }: Props) {
  const [loaded, setLoaded] = useState(false);
  
  const { id } = useParams();
  const [apiEndpoint, setApiEndpoint] = useState<IApiEndpointItem | null>(null);

  const getApiEndpointById = useCallback(async () => {
    const { data } = await API.get<IApiEndpointItem>('/apiEndpoints/' + id);
    setApiEndpoint(data);
    setLoaded(true);
  }, [id]);

  useEffect(() => {
    getApiEndpointById();
  }, [getApiEndpointById]);


  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit API Definition"
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {loaded ? 
        <ApiEndpointNewEditForm currentApiEndpoint={apiEndpoint || undefined} /> : <LoadingScreen />}
    </DashboardContent>
  );
}
