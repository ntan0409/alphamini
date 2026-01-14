import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SearchAndFilter from './search-and-filter';
import UserTableRow from './user-table-row';

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
}

interface UserTableProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterRole: string;
  onRoleChange: (value: string) => void;
  availableRoles: string[];
  filteredUsers: UserInfo[];
  totalUsers: number;
  isLoading: boolean;
  onToggleStatus: (userId: string, currentStatus: number) => void;
  onDeleteUser: (userId: string) => void;
  getRoleColor: (role: string) => string;
  getStatusColor: (status: number) => string;
}

export default function UserTable({
  searchTerm,
  onSearchChange,
  filterRole,
  onRoleChange,
  availableRoles,
  filteredUsers,
  totalUsers,
  isLoading,
  onToggleStatus,
  onDeleteUser,
  getRoleColor,
  getStatusColor
}: UserTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh Sách Người Dùng</CardTitle>
      </CardHeader>
      <CardContent>
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          filterRole={filterRole}
          onRoleChange={onRoleChange}
          availableRoles={availableRoles}
        />

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left p-4 font-medium text-gray-900">Người Dùng</th>
                <th className="text-left p-4 font-medium text-gray-900">Vai Trò</th>
                <th className="text-left p-4 font-medium text-gray-900">Trạng Thái</th>
                <th className="text-left p-4 font-medium text-gray-900">Giới Tính</th>
                <th className="text-left p-4 font-medium text-gray-900">Ngày Tạo</th>
                <th className="text-left p-4 font-medium text-gray-900">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  onToggleStatus={onToggleStatus}
                  onDeleteUser={onDeleteUser}
                  getRoleColor={getRoleColor}
                  getStatusColor={getStatusColor}
                />
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && !isLoading && (
          <div className="text-center py-8">
            {totalUsers === 0 ? (
              <p className="text-gray-500">Không tìm thấy người dùng nào trong hệ thống.</p>
            ) : (
              <p className="text-gray-500">Không tìm thấy người dùng nào phù hợp với tiêu chí tìm kiếm.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
