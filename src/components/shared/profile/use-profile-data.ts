import { useEffect, useState } from 'react';
import { getUserInfoFromToken } from '@/utils/tokenUtils';
import { useAccount } from '@/features/users/hooks/use-account';
import { toast } from 'sonner';

export function useProfileData() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [editedData, setEditedData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const { useGetAccountById, useUpdateAccount } = useAccount();
  const updateMutation = useUpdateAccount();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const accessToken = sessionStorage.getItem('accessToken');
      if (accessToken) {
        const userInfo = getUserInfoFromToken(accessToken);
        setUserId(userInfo?.id || null);
      }
    }
  }, []);

  const { data: account, isLoading, error, refetch } = useGetAccountById(userId || '');

  useEffect(() => {
    if (account) {
      setEditedData({
        fullName: account.fullName || '',
        email: account.email || '',
        phone: account.phone || '',
      });
    }
  }, [account]);

  const handleSave = async () => {
    if (!userId) return;

    try {
      await updateMutation.mutateAsync({
        id: userId,
        accountData: editedData,
      });
      toast.success('Cập nhật hồ sơ thành công');
      setIsEditing(false);
      refetch();
    } catch (error) {
      toast.error('Cập nhật hồ sơ thất bại');
      console.error('Update error:', error);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu mới không khớp');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    // TODO: Implement password change API
    toast.info('Tính năng đổi mật khẩu sắp ra mắt');
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (account) {
      setEditedData({
        fullName: account.fullName || '',
        email: account.email || '',
        phone: account.phone || '',
      });
    }
  };

  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return {
    account,
    isLoading,
    error,
    isEditing,
    setIsEditing,
    isChangingPassword,
    setIsChangingPassword,
    editedData,
    setEditedData,
    passwordData,
    setPasswordData,
    updateMutation,
    handleSave,
    handlePasswordChange,
    handleCancelEdit,
    handleCancelPasswordChange,
  };
}
