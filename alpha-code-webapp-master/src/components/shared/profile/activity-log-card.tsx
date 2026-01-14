import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import { format } from 'date-fns';
import { Account } from '@/types/account';

interface ActivityLogCardProps {
  account: Account;
}

export function ActivityLogCard({ account }: ActivityLogCardProps) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Hoạt Động Tài Khoản
        </CardTitle>
        <CardDescription>Các hoạt động và cập nhật gần đây</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
            <div className="flex-1">
              <p className="text-sm font-medium">Tài khoản được tạo</p>
              <p className="text-xs text-gray-500">
                {account.createdDate ? format(new Date(account.createdDate), 'dd/MM/yyyy HH:mm') : 'N/A'}
              </p>
            </div>
          </div>
          {account.lastEdited && (
            <div className="flex items-start gap-4">
              <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
              <div className="flex-1">
                <p className="text-sm font-medium">Cập nhật lần cuối</p>
                <p className="text-xs text-gray-500">
                  {format(new Date(account.lastEdited), 'dd/MM/yyyy HH:mm')}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
