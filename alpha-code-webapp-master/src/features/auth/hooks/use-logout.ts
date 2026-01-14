import { useMutation } from '@tanstack/react-query';
import { logout } from '@/features/auth/api/auth-api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { clearAuthCookies } from '@/utils/cookieUtils';

export const useLogout = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Clear tokens and navigate
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('key');
      
      // Clear cookies
      clearAuthCookies();
      
      toast.success('Đăng xuất thành công!');
      router.push('/login');
    },
    onError: () => {
      // Ensure tokens are removed even if API call fails
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('key');
      
      // Clear cookies
      clearAuthCookies();
      
      router.push('/login');
    }
  });
};
