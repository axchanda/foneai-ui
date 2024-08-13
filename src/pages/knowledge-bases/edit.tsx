import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useParams } from 'react-router';
import { useCallback, useEffect, useState } from 'react';
import API from 'src/utils/API';
import { LoadingScreen } from 'src/components/loading-screen';
import { IKnowledgeBaseItem } from 'src/types/knowledge-base';
import { KnowledgeBaseNewEditForm } from 'src/sections/knowledge-bases/knowledge-base-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  kb?: IKnowledgeBaseItem;
};

export default function KnowledgeBaseEdit({ kb: currentKb }: Props) {
  const [loaded, setLoaded] = useState(false);
  
  const { id } = useParams();
  const [knowledgeBase, setKnowledgeBase] = useState<IKnowledgeBaseItem | null>(null);

  const getKnowledgeBaseById = useCallback(async () => {
    const { data } = await API.get<IKnowledgeBaseItem>('/knowledgeBases/' + id);
    setKnowledgeBase(data);
    console.log(data);
    setLoaded(true);
  }, [id]);

  useEffect(() => {
    getKnowledgeBaseById();
  }, [getKnowledgeBaseById]);


  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Knowledge Base"
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {loaded ? 
        <KnowledgeBaseNewEditForm currentKb = {knowledgeBase || undefined} /> : <LoadingScreen />}
    </DashboardContent>
  );
}
