'use client'

import { useState } from 'react';
import { useCreateUserProfile } from '@/features/users/hooks/use-profile';
import { useSwitchProfile } from '@/features/auth/hooks/use-switch-profile';
import { createProfileSwagger } from '@/features/users/api/profile-swagger-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { getUserInfoFromToken } from '@/utils/tokenUtils';
import { toast } from 'sonner';
import Image from 'next/image';
import logo2 from '../../../public/logo2.png';

export function CreateParentProfile() {
  const [name, setName] = useState('');
  const [passcode, setPasscode] = useState('');
  const [isKid, setIsKid] = useState(false); // false = Parent, true = Children
  const [isCreating, setIsCreating] = useState(false);
  const createProfileMutation = useCreateUserProfile({ showToast: false });
  const switchProfileMutation = useSwitchProfile();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Vui lòng nhập tên profile');
      return;
    }

    setIsCreating(true);

    try {
      // Chỉ truy cập sessionStorage khi đang ở client
      let accountId = '';
      let accountFullName = '';
      if (typeof window !== 'undefined') {
        accountId = sessionStorage.getItem('pendingAccountId') || '';
        // Nếu có token (trường hợp login với Admin/Staff rồi vào trang này)
        const accessToken = sessionStorage.getItem('accessToken');
        if (accessToken && !accountId) {
          const userInfo = getUserInfoFromToken(accessToken);
          console.log('🔍 Debug - userInfo from token:', userInfo);
          if (userInfo) {
            accountId = userInfo.id || '';
            accountFullName = userInfo.fullName || '';
          }
        }
      }

      if (!accountId) {
        console.error('❌ No accountId found');
        toast.error('Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại.');
        setIsCreating(false);
        // router.push('/login'); // <--- TẠM COMMENT ĐỂ DEBUG
        return;
      }

      // TRY 1: Sử dụng API theo Swagger spec (accountId, passCode)
      try {
        const profileDataSwagger = {
          accountId: accountId,  // camelCase
          name: name.trim(),
          passCode: passcode || '0000',
          isKid: isKid,  // từ state
          status: 1,
        };

        const profile = await createProfileSwagger(profileDataSwagger);
        // Xóa pendingAccountId sau khi tạo xong
        sessionStorage.removeItem('pendingAccountId');
        
        // Sau khi tạo xong, tự động switch sang profile đó
        if (profile?.id) {
          console.log('🔄 Switching to profile:', profile.id);
          switchProfileMutation.mutate({
            profileId: profile.id,
            accountId: accountId,
            passCode: passcode || '0000'
          });
        }
        
        setIsCreating(false);
        return;
      } catch (swaggerError) {
        console.warn('⚠️ Swagger API failed, trying old API format...', swaggerError);
      }

      // TRY 2: Fallback - Sử dụng API cũ (accountId, passcode string)
      const profileDataOld = {
        accountId: accountId,  // lowercase
        name: name.trim(),
        passcode: passcode || '0000',  // string
        isKid: isKid,  // từ state
        status: 0,
        accountFullName,
        avartarUrl: '',
        lastActiveAt: new Date().toISOString(),
        statusText: 'Active'
      };
      const profile = await createProfileMutation.mutateAsync(profileDataOld);
      
      // Xóa pendingAccountId sau khi tạo xong
      sessionStorage.removeItem('pendingAccountId');
      
      toast.success('Tạo profile thành công!');
      
      // Sau khi tạo xong, tự động switch sang profile đó
      if (profile?.id) {
        switchProfileMutation.mutate({
          profileId: profile.id,
          accountId: accountId,
          passCode: passcode || '0000'
        });
      } else {
        console.error('❌ Profile created but no ID returned');
        toast.error('Tạo profile thành công nhưng không thể chuyển profile. Vui lòng đăng nhập lại.');
      }
      
      setIsCreating(false);
    } catch (error) {
      console.error('❌ Error creating profile:', error);
      setIsCreating(false);
      
      // Hiển thị lỗi chi tiết
      if (error && typeof error === 'object') {
        if ('response' in error) {
          const axiosError = error as { response?: { data?: { message?: string }, status?: number } };
          const errorMessage = axiosError.response?.data?.message || `Lỗi ${axiosError.response?.status}`;
          toast.error(`Không thể tạo profile: ${errorMessage}`);
        } else if ('message' in error) {
          toast.error(`Lỗi: ${(error as { message: string }).message}`);
        } else {
          toast.error('Có lỗi xảy ra khi tạo profile. Vui lòng thử lại!');
        }
      }
    }
  };

  const isLoading = isCreating || createProfileMutation.isPending || switchProfileMutation.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <div className="w-25 h-25 rounded-2xl flex items-center justify-center overflow-hidden">
              <Image
                src={logo2}
                alt="Alpha Logo"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
          </div>
          
          <CardTitle className="text-center text-2xl text-gray-900">
            Tạo Profile {isKid ? 'Trẻ Em' : 'Phụ Huynh'}
          </CardTitle>
          <p className="text-center text-gray-600 text-sm mt-2">
            Đây là lần đầu tiên bạn đăng nhập. Vui lòng tạo profile để bắt đầu học lập trình với Alpha Mini!
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Preview */}
            <div className="flex justify-center">
              <Avatar className="w-24 h-24 ring-4 ring-gray-200">
                <AvatarFallback className="bg-gradient-to-br from-gray-600 to-gray-400 text-white text-3xl font-bold">
                  {name ? name.charAt(0).toUpperCase() : '👤'}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">
                Tên của bạn <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="VD: Ba Minh, Mẹ Na, Bé An..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
                className="h-12"
                autoFocus
              />
              <p className="text-xs text-gray-500">
                Tên này sẽ được hiển thị khi chọn profile
              </p>
            </div>

            {/* Profile Type Selection */}
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Loại Profile</Label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsKid(false)}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    !isKid 
                      ? 'border-blue-500 bg-blue-50' // Updated to make selected parent profile border more prominent
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">👨‍👩‍👧</div>
                    <div className="font-medium">Phụ huynh</div>
                    <div className="text-xs text-gray-500 mt-1">Parent</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setIsKid(true)}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    isKid 
                      ? 'border-blue-500 bg-blue-50' // Updated to make selected children profile border more prominent
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">👶</div>
                    <div className="font-medium">Trẻ em</div>
                    <div className="text-xs text-gray-500 mt-1">Children</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Passcode Input (Optional) */}
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Mã PIN</Label>
              <div className ="justify-center flex">
                <InputOTP
                  maxLength={4}
                  value={passcode}
                  onChange={(val: string) => setPasscode((val || '').replace(/\D/g, '').slice(0, 4))}
                  disabled={isLoading}
                  className="mx-auto"
                >
                  <InputOTPGroup className="justify-center">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <p className="text-xs text-gray-500">Mã PIN 4 số để bảo vệ profile của bạn</p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-6 rounded-xl transition-all duration-200"
              disabled={!name.trim() || isLoading}
            >
              {isLoading ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang tạo profile...
                </>
              ) : (
                <>
                  🚀 Tạo Profile & Bắt đầu học
                </>
              )}
            </Button>

            {/* Error Message */}
            {createProfileMutation.isError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600 text-center font-semibold mb-1">
                  Có lỗi xảy ra khi tạo profile
                </p>
                <p className="text-xs text-red-500 text-center">
                  {createProfileMutation.error instanceof Error 
                    ? createProfileMutation.error.message 
                    : 'Vui lòng kiểm tra console để biết thêm chi tiết'}
                </p>
              </div>
            )}
          </form>

          {/* Back to login */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/login')}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              disabled={isLoading}
            >
              ← Quay lại đăng nhập
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
