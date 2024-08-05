import { toast } from 'sonner';
import API from '../API';

export const deleteCampaign = async (id: string, cb?: () => any) => {
  try {
    await API.delete(`/campaigns/${id}`);
    toast.success('Delete success!');
    if (cb) {
      cb();
    }
  } catch (error) {
    toast.error('Delete failed!');
    console.error(error);
  }
};
