import React from 'react';
import { UserCheck, UserX, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface UserInfo {
  id: string;
  fullName: string;
  email: string;
  username: string;
  roleName: string;
  statusNumber: number;
  statusText: string;
  genderText: string;
  createdDate: string;
  bannedReason?: string | null;
}

interface UserTableRowProps {
  user: UserInfo;
  onToggleStatus: (userId: string, currentStatus: number) => void;
  onDeleteUser: (userId: string) => void;
  getRoleColor: (role: string) => string;
  getStatusColor: (status: number) => string;
}

export default function UserTableRow({
  user,
  onToggleStatus,
  onDeleteUser,
  getRoleColor,
  getStatusColor
}: UserTableRowProps) {
  return (
    <tr 
      className="border-b border-gray-200 hover:bg-blue-50 hover:shadow-sm transition-all duration-200 ease-in-out cursor-pointer group"
      style={{
        '--hover-bg': 'rgb(239 246 255)', // blue-50 fallback
      } as React.CSSProperties}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgb(239 246 255)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '';
      }}
    >
      <td className="p-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gray-200 group-hover:bg-blue-200 rounded-full h-10 w-10 flex items-center justify-center transition-colors duration-200">
            <span className="text-sm font-medium text-gray-600 group-hover:text-blue-700">
              {user.fullName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900 group-hover:text-blue-900">{user.fullName}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
            <div className="text-sm text-gray-500">@{user.username}</div>
          </div>
        </div>
      </td>
      <td className="p-4">
        <Badge className={getRoleColor(user.roleName)}>
          {user.roleName.charAt(0).toUpperCase() + user.roleName.slice(1)}
        </Badge>
      </td>
      <td className="p-4">
        <Badge className={getStatusColor(user.statusNumber)}>
          {user.statusText.charAt(0).toUpperCase() + user.statusText.slice(1)}
        </Badge>
      </td>
      <td className="p-4">
        <span className="text-sm text-gray-900">
          {user.genderText === 'male' ? 'Nam' : user.genderText === 'female' ? 'Nữ' : 'Khác'}
        </span>
      </td>
      <td className="p-4">
        <span className="text-sm text-gray-900">
          {new Date(user.createdDate).toLocaleDateString('vi-VN')}
        </span>
      </td>
      <td className="p-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleStatus(user.id, user.statusNumber)}
            className="flex items-center space-x-1"
          >
            {user.statusNumber === 1 ? (
              <>
                <UserX className="h-4 w-4" />
                <span>Cấm</span>
              </>
            ) : (
              <>
                <UserCheck className="h-4 w-4" />
                <span>Kích hoạt</span>
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDeleteUser(user.id)}
            className="text-red-600 hover:text-red-700 flex items-center space-x-1"
          >
            <Trash2 className="h-4 w-4" />
            <span>Xóa</span>
          </Button>
        </div>
      </td>
    </tr>
  );
}
