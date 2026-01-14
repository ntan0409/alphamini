'use client'

import { useState, useEffect, useRef } from 'react';
import { Profile } from '@/types/login';
import { useSwitchProfile } from '@/features/auth/hooks/use-switch-profile';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo2 from '../../../public/logo2.png';

export function ProfileSelection() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const activeProfiles = profiles.filter(p => p.status === 1);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [passCodeInput, setPassCodeInput] = useState('');
  const switchProfileMutation = useSwitchProfile();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Lấy danh sách profiles từ sessionStorage
    const stored = sessionStorage.getItem('availableProfiles');
    if (!stored) {
      // Nếu không có profiles, redirect về login
      router.push('/login');
      return;
    }
    try {
      const parsedProfiles = JSON.parse(stored);
      setProfiles(parsedProfiles);
    } catch (error) {
      console.error('Error parsing profiles:', error);
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    if (selectedProfileId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedProfileId]);

  const handleSelectProfile = (profileId: string) => {
    setSelectedProfileId(profileId);
    setPassCodeInput('');
  };

  const handleLoginProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedProfile = profiles.find(p => p.id === selectedProfileId);
    if (!selectedProfile) return;
  // Hỗ trợ cả accountId (camelCase) và accountid (lowercase) mà không dùng any
  const accountId = selectedProfile.accountId || (selectedProfile as unknown as { accountid?: string }).accountid || '';
    switchProfileMutation.mutate({
      profileId: selectedProfile.id,
      accountId,
      passCode: passCodeInput || '0000'
    });
  };

  if (profiles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-3xl shadow-2xl" style={{ backgroundColor: '#F4F4F4' }}>
        <CardContent className="p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-25 h-25 rounded-2xl flex items-center justify-center overflow-hidden">
              <Image
                src="/pulling_down_2.gif" // Updated to use pulling_down_2.gif
                alt="Alpha Logo"
                width={128}
                height={128}
                className="object-contain"
              />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Chọn ai đang sử dụng?
            </h1>
            <p className="text-gray-600">
              Chọn profile để bắt đầu học lập trình với Alpha Mini
            </p>
          </div>

          {/* Profiles Grid */}
          {!selectedProfileId ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {activeProfiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => handleSelectProfile(profile.id)}
                  disabled={switchProfileMutation.isPending}
                  className="flex flex-col items-center p-6 rounded-xl border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Avatar className="w-20 h-20 mb-3 ring-2 ring-gray-200 group-hover:ring-gray-400 transition-all">
                    <AvatarImage src={profile.avartarUrl} alt={profile.name} />
                    <AvatarFallback className="bg-gradient-to-br from-gray-500 to-gray-300 text-white text-2xl font-bold">
                      {profile.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors text-center break-words w-full">
                    {profile.name}
                  </span>
                  <span className="text-xs text-gray-500 mt-1 text-center">
                    {profile.isKid ? '👶 Trẻ em' : '👨‍👩‍👧 Phụ huynh'}
                  </span>
                  {profile.accountFullName && (
                    <span className="text-xs text-gray-400 mt-0.5 text-center">
                      {profile.accountFullName}
                    </span>
                  )}
                </button>
              ))}

              {/* Add profile button */}
              <button
                className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                onClick={() => router.push('/create-parent-profile')}
                disabled={switchProfileMutation.isPending}
              >
                <div className="w-20 h-20 mb-3 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
                  <span className="text-4xl text-gray-500">+</span>
                </div>
                <span className="font-semibold text-gray-600 text-center">
                  Thêm profile
                </span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleLoginProfile} className="max-w-sm mx-auto mt-8 p-6 rounded-xl border-2 border-gray-200 bg-white shadow-lg">
              {(() => {
                const profile = profiles.find(p => p.id === selectedProfileId);
                if (!profile) return null;
                return (
                  <div className="flex flex-col items-center mb-6">
                    <Avatar className="w-20 h-20 mb-3 ring-2 ring-gray-300">
                      <AvatarImage src={profile.avartarUrl} alt={profile.name} />
                      <AvatarFallback className="bg-gradient-to-br from-gray-500 to-gray-300 text-white text-2xl font-bold">
                        {profile.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-gray-900 text-xl text-center">
                      {profile.name}
                    </span>
                    <span className="text-xs text-gray-500 mt-1 text-center">
                      {profile.isKid ? 'Trẻ em' : 'Phụ huynh'}
                    </span>
                  </div>
                );
              })()}
              <label className="block text-base font-medium mb-2 text-gray-700 text-center">Nhập mã PIN (Passcode)</label>
              <div className="mb-4 flex justify-center">
                <InputOTP
                  maxLength={4}
                  value={passCodeInput}
                  onChange={(val: string) => setPassCodeInput((val || '').replace(/\D/g, '').slice(0, 4))}
                  disabled={switchProfileMutation.isPending}
                  className="mx-auto"
                  ref={inputRef}
                  type="password" // Added to mask input with '*'
                >
                  <InputOTPGroup className="justify-center">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-gradient-to-r from-gray-700 to-gray-500 text-white font-semibold text-lg mt-2 hover:from-gray-800 hover:to-gray-600 transition-all"
                disabled={switchProfileMutation.isPending || passCodeInput.length !== 4}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                className="w-full py-2 mt-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
                onClick={() => setSelectedProfileId(null)}
                disabled={switchProfileMutation.isPending}
              >
                ← Quay lại chọn profile
              </button>
            </form>
          )}

          {/* Loading state */}
          {switchProfileMutation.isPending && (
            <div className="mt-6 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
              <p className="mt-2 text-gray-600">Đang chuyển profile...</p>
            </div>
          )}

          {/* Back to login */}
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/login')}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              disabled={switchProfileMutation.isPending}
            >
              ← Quay lại đăng nhập
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
