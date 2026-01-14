import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity } from 'lucide-react';
import { Account } from '@/types/account';

interface AccountStatusCardProps {
  account: Account;
}

export function AccountStatusCard({ account }: AccountStatusCardProps) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Trạng Thái Tài Khoản
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Trạng thái</span>
          <Badge variant={account.status === 1 ? "default" : "destructive"}>
            {account.status === 1 ? 'Hoạt động' : 'Không hoạt động'}
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Vai trò</span>
          <Badge variant="outline">{account.roleName}</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Giới tính</span>
          <span className="text-sm font-medium">
            {account.gender === 0 ? 'Nam' : account.gender === 1 ? 'Nữ' : 'Khác'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
