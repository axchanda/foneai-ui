import { toast } from 'sonner';
import API from '../API';

export const deleteApiEndpoint = async (id: string, cb?: () => any) => {
  try {
    // console.log(id);
    await API.delete(`/apiEndpoints/${id}`);
    toast.success('Delete success!');
    if (cb) {
      cb();
    }
  } catch (error) {
    toast.error('Delete failed!');
    // console.error(error);
  }
};
