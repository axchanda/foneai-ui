import { toast } from 'sonner';
import API from '../API';

export const deleteAgent = async (id: string, cb?: () => any) => {
  try {
    await API.delete(`/agents/${id}`);
    toast.success('Delete success!');
    if (cb) {
      cb();
    }
  } catch (error) {
    if(error?.response && error?.response?.status == 500 && error?.response?.data) {
      toast.error(error?.response?.data);
    } else {
      toast.error("Delete Failed");
    }
  }
};