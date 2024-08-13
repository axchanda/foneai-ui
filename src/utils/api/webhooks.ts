import { toast } from 'sonner';
import API from '../API';

export const deleteWebhook = async (id: string, cb?: () => any) => {
  try {
    console.log(id);
    await API.delete(`/webhooks/${id}`);
    toast.success('Delete success!');
    if (cb) {
      cb();
    }
  } catch (error) {
    toast.error('Delete failed!');
    console.error(error);
  }
};
