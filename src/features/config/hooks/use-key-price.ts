import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner'; // hoặc react-hot-toast
import { createKeyPrice, deleteKeyPrice, getKeyPrice, updateKeyPrice } from '../api/key-price-api';


// ✅ Lấy key price hiện tại
export const useGetKeyPrice = () => {
  return useQuery({
    queryKey: ['key-price'],
    // getKeyPrice now returns KeyPrice | null; react-query will store null as data
    queryFn: getKeyPrice,
    // Treat 404 as handled in API; let other errors bubble up
  });
};

// ✅ Tạo mới key price
export const useCreateKeyPrice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (price: number) => createKeyPrice(price),

    onSuccess: () => {
      toast.success('Key price created successfully');
      queryClient.invalidateQueries({ queryKey: ['key-price'] });
    }
  });
};

// ✅ Cập nhật key price
export const useUpdateKeyPrice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, price }: { id: string; price: number }) => updateKeyPrice(id, price),

    onSuccess: () => {
      toast.success('Key price updated');
      queryClient.invalidateQueries({ queryKey: ['key-price'] });
    },

    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update key price');
    },
  });
};

// ✅ Xóa key price
export const useDeleteKeyPrice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteKeyPrice(id),

    onSuccess: () => {
      toast.success('Key price deleted');
      queryClient.invalidateQueries({ queryKey: ['key-price'] });
    },

    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete key price');
    },
  });
};
