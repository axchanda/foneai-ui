import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { KnowledgeBaseNewEditForm } from 'src/sections/knowledge-bases/knowledge-base-new-edit-form';

// ----------------------------------------------------------------------

export default function KnowledgeBaseCreate() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new knowledge base"
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <KnowledgeBaseNewEditForm />
    </DashboardContent>
  );
}
