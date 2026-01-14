import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRoles } from '@/features/users/hooks/use-roles';
import { CreateAccountRequest } from '@/types/account';
import { X } from 'lucide-react';
import { useAccount } from '@/features/users/hooks/use-account';
import { Role } from '@/types/role';
import LoadingGif from '@/components/ui/loading-gif';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateUserModal({ isOpen, onClose }: CreateUserModalProps) {
  const [formData, setFormData] = useState<CreateAccountRequest>({
    username: '',
    fullName: '',
    email: '',
    password: '',
    phone: '',
    gender: 1, // default male
    roleId: '', // sẽ cần mapping role name to roleId
  });

  const { useCreateAccount } = useAccount()
  const createAccountMutation = useCreateAccount();
  const { data: roles, isLoading: rolesLoading } = useRoles();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createAccountMutation.mutateAsync({
        ...formData,
        status: 1, // or appropriate default value
        image: '', // or appropriate default value
        bannedReason: '', // or appropriate default value
        roleName: '', // or map from roles if needed
        statusText: '', // or appropriate default value
      });
      setFormData({
        username: '',
        fullName: '',
        email: '',
        password: '',
        phone: '',
        gender: 1,
        roleId: '',
      });
      onClose();
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle number fields
    if (name === 'gender') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tạo tài khoản mới</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Tên đăng nhập *</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Nhập tên đăng nhập"
              />
            </div>

            <div>
              <Label htmlFor="fullName">Họ và tên *</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Nhập họ và tên"
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Nhập email"
              />
            </div>

            <div>
              <Label htmlFor="password">Mật khẩu *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Nhập mật khẩu"
              />
            </div>

            <div>
              <Label htmlFor="phone">Số điện thoại *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div>
              <Label htmlFor="gender">Giới tính *</Label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value={0}>Nữ</option>
                <option value={1}>Nam</option>
                <option value={2}>Khác</option>
              </select>
            </div>

            <div>
              <Label htmlFor="roleId">Vai trò *</Label>
              <select
                id="roleId"
                name="roleId"
                value={formData.roleId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={rolesLoading}
              >
                <option value="">Chọn vai trò</option>
                {rolesLoading ? (
                  <option disabled>Đang tải...</option>
                ) : (
                  roles?.map((role: Role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))
                )}
              </select>
              {rolesLoading && (
                <div className="flex items-center mt-1">
                  <LoadingGif size="sm" showMessage={false} className="mr-1" />
                  <span className="text-xs text-gray-500">Đang tải danh sách vai trò...</span>
                </div>
              )}
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={createAccountMutation.isPending}
                className="flex-1 bg-black text-white"
              >
                {createAccountMutation.isPending ? 'Đang tạo...' : 'Tạo tài khoản'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
