import { useMutation } from '@tanstack/react-query';
import { switchProfile } from '@/features/auth/api/auth-api';
import { toast } from 'sonner';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { SwitchProfileResponse } from '@/types/login';
import { getTokenPayload } from '@/utils/tokenUtils';
import { setAccessTokenCookie, setLicenseKeyCookie } from '@/utils/cookieUtils';

export const useSwitchProfile = () => {
  const router = useRouter();
  
  return useMutation<SwitchProfileResponse, Error, { profileId: string; accountId: string; passCode: string }>({
    mutationFn: ({ profileId, accountId, passCode }) => switchProfile(profileId, accountId, passCode),
    onSuccess: (data) => {
      console.log('SwitchProfileResponse:', data);
      // Lưu token mới
      sessionStorage.setItem('accessToken', data.accessToken);
      sessionStorage.setItem('refreshToken', data.refreshToken);
      sessionStorage.setItem('key', data.key);

      // Set cookies để server-side validation
      setAccessTokenCookie(data.accessToken);
      if (data.key) {
        setLicenseKeyCookie(data.key);
      }

      // Giải mã accessToken để lấy fullName
      const accountData = getTokenPayload(data.accessToken);
      const fullName = accountData?.fullName || 'Người dùng';

      // Hiển thị toast với tên đầy đủ của người dùng
      toast.success(`Xin Chào ${fullName}!`);

      // Check for pending redirect
      const pendingRedirect = sessionStorage.getItem('pendingRedirect');

      // Xóa dữ liệu tạm thời
      sessionStorage.removeItem('availableProfiles');
      sessionStorage.removeItem('pendingAccountId');
      sessionStorage.removeItem('pendingRedirect');

      // If there's a pending redirect, go there
      if (pendingRedirect) {
        router.push(pendingRedirect);
        return;
      }

      // Determine redirect based on roleName inside the returned access token
      try {
        const roleNameLower = accountData?.roleName?.toLowerCase();
        if (roleNameLower === 'admin') {
          router.push('/admin');
        } else if (roleNameLower === 'staff') {
          router.push('/staff');
        } else if (roleNameLower === 'parent'|| roleNameLower === 'user') {
          router.push('/parent');
        } else if (roleNameLower === 'children') {
          router.push('/children');
        } else {
          // default to /user for unknown or new user-like roles
          router.push('/');
        }
      } catch (err) {
        console.error('Error determining redirect after switchProfile:', err);
        router.push('/user');
      }
    },
    onError: (error) => {
      console.error('Switch profile error:', error);
      let message = 'Không thể chuyển profile. Vui lòng thử lại.';
      try {
        const anyErr = error as unknown;

        // If it's an axios error, inspect response data for message
        if (axios.isAxiosError(anyErr)) {
          const resp = anyErr.response;
          const data = resp?.data as unknown;
          // Common shapes: { message }, { error }, { data: { message } }, string
          if (data) {
            if (typeof data === 'string') message = data;
            else if (typeof data === 'object' && data !== null) {
              type ErrorResponse = { message?: string; error?: string; data?: { message?: string } };
              const d = data as ErrorResponse;
              if (d.message) message = d.message;
              else if (d.error) message = d.error;
              else if (d.data && d.data.message) message = d.data.message;
            }
          } else if (resp && resp.status >= 500) {
            message = 'Lỗi máy chủ. Vui lòng thử lại sau.';
          }
        } else if (typeof anyErr === 'object' && anyErr !== null && 'message' in anyErr) {
          // Fallback to generic Error.message
          const obj = anyErr as Record<string, unknown> & { message?: unknown };
          if (typeof obj.message === 'string') message = obj.message;
        }
      } catch {
        // ignore extraction errors
      }

      toast.error(message);
    }
  });
};
