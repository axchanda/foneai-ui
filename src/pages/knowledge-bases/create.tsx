import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { KnowledgeBaseNewEditForm } from 'src/sections/knowledge-bases/knowledge-base-new-edit-form';
import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export default function KnowledgeBaseCreate() {
  const {t} = useTranslate();
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t("Create a new knowledge base")}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <KnowledgeBaseNewEditForm />
    </DashboardContent>
  );
}
