import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Save, X } from 'lucide-react';
import { Account } from '@/types/account';

interface PersonalInfoFormProps {
  account: Account;
  isEditing: boolean;
  editedData: {
    fullName: string;
    email: string;
    phone: string;
  };
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (data: { fullName: string; email: string; phone: string }) => void;
  isSaving: boolean;
}

export function PersonalInfoForm({
  account,
  isEditing,
  editedData,
  onEdit,
  onSave,
  onCancel,
  onChange,
  isSaving,
}: PersonalInfoFormProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Thông Tin Cá Nhân</CardTitle>
            <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
          </div>
          {!isEditing ? (
            <Button onClick={onEdit} variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={onSave} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                Lưu
              </Button>
              <Button onClick={onCancel} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Hủy
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Họ và tên</Label>
          <Input
            id="fullName"
            value={editedData.fullName}
            onChange={(e) => onChange({ ...editedData, fullName: e.target.value })}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Địa chỉ email</Label>
          <Input
            id="email"
            type="email"
            value={editedData.email}
            onChange={(e) => onChange({ ...editedData, email: e.target.value })}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Số điện thoại</Label>
          <Input
            id="phone"
            value={editedData.phone}
            onChange={(e) => onChange({ ...editedData, phone: e.target.value })}
            disabled={!isEditing}
          />
        </div>
      </CardContent>
    </Card>
  );
}
