import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ActionsNewEditForm } from 'src/sections/actions/actions-new-edit-form';
import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

function ActionsCreate() {
  const {t} = useTranslate();
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('Create a new action')}
        // links={[
        //   { name: 'Dashboard', href: paths.dashboard.root },
        //   { name: 'Job', href: paths.dashboard.job.root },
        //   { name: 'New job' },
        // ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ActionsNewEditForm />
    </DashboardContent>
  );
}

export default ActionsCreate;
