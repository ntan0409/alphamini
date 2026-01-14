"use client";

import React from 'react';
import { Briefcase } from 'lucide-react';
import LoadingState from '@/components/loading-state';
import ErrorState from '@/components/error-state';
import { ProfileHeader } from '@/components/shared/profile/profile-header';
import { AccountStatusCard } from '@/components/shared/profile/account-status-card';
import { PersonalInfoForm } from '@/components/shared/profile/personal-info-form';
import { ActivityLogCard } from '@/components/shared/profile/activity-log-card';
import { useProfileData } from '@/components/shared/profile/use-profile-data';

export default function StaffProfilePage() {
  const {
    account,
    isLoading,
    error,
    isEditing,
    setIsEditing,
    editedData,
    setEditedData,
    updateMutation,
    handleSave,
    handleCancelEdit,
  } = useProfileData();

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <LoadingState />
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="container mx-auto py-8">
        <ErrorState error={error || "Không thể tải hồ sơ"} />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Hồ Sơ Nhân Viên</h1>
        <p className="text-gray-500 mt-2">Quản lý cài đặt tài khoản và tùy chọn của bạn</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <ProfileHeader
            account={account}
            roleIcon={Briefcase}
            roleBadgeText="Nhân Viên"
            roleBadgeVariant="secondary"
          />
          
          <AccountStatusCard account={account} />
          
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <PersonalInfoForm
            account={account}
            isEditing={isEditing}
            editedData={editedData}
            onEdit={() => setIsEditing(true)}
            onSave={handleSave}
            onCancel={handleCancelEdit}
            onChange={setEditedData}
            isSaving={updateMutation.isPending}
          />
          
          <ActivityLogCard account={account} />
        </div>
      </div>
    </div>
  );
}
