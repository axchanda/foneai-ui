import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useParams } from 'react-router';
import { useCallback, useEffect, useState } from 'react';
import API from 'src/utils/API';
import { LoadingScreen } from 'src/components/loading-screen';
import { IKnowledgeBaseItem } from 'src/types/knowledge-base';
import { KnowledgeBaseNewEditForm } from 'src/sections/knowledge-bases/knowledge-base-new-edit-form';
import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

type Props = {
  kb?: IKnowledgeBaseItem;
};

export default function KnowledgeBaseEdit({ kb: currentKb }: Props) {
  const [loaded, setLoaded] = useState(false);

  const { id } = useParams();
  const [knowledgeBase, setKnowledgeBase] = useState<IKnowledgeBaseItem | null>(null);
  function getLabelColor(status: string) {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  }

  const getKnowledgeBaseById = useCallback(async () => {
    const { data } = await API.get<IKnowledgeBaseItem>('/knowledgeBases/' + id);
    setKnowledgeBase(data);
    // console.log(data);
    setLoaded(true);
  }, [id]);

  useEffect(() => {
    getKnowledgeBaseById();
  }, [getKnowledgeBaseById]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs 
        heading="Edit Knowledge Base" 
        action={          
          <Label
            height={50}
            width={75}
            color={getLabelColor(knowledgeBase?.status || 'active')} >
              {knowledgeBase?.status && knowledgeBase.status.toUpperCase()}
          </Label>
        }
        sx={{ mb: { xs: 3, md: 5 } }} />
      {loaded ? (
        <KnowledgeBaseNewEditForm currentKb={knowledgeBase || undefined} />
      ) : (
        <LoadingScreen />
      )}
    </DashboardContent>
  );
}
