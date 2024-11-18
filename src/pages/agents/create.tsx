import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { AgentNewEditForm } from 'src/sections/agents/agent-new-edit-form';

// ----------------------------------------------------------------------

function AgentsCreate() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new agent"
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <AgentNewEditForm />
    </DashboardContent>
  );
}

export default AgentsCreate;
