import { toast } from 'sonner';
import API from '../API';

export const deleteKnowledgeBase = async (id: string, cb?: () => any) => {
  try {
    console.log(id);
    await API.delete(`/knowledgeBases/${id}`);
    toast.success('Delete success!');
    if (cb) {
      cb();
    }
  } catch (error) {
    toast.error('Delete failed!');
    console.error(error);
  }
};
