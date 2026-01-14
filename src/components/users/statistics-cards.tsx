import React from 'react';
import { UserCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatisticsCardsProps {
  totalUsers: number;
  activeUsers: number;
  teachers: number;
  admins: number;
}

export default function StatisticsCards({
  totalUsers,
  activeUsers,
  teachers,
  admins
}: StatisticsCardsProps) {
  const statisticsData = [
    {
      title: 'Tổng Người Dùng',
      value: totalUsers,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      valueColor: 'text-gray-900'
    },
    {
      title: 'Đang Hoạt Động',
      value: activeUsers,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      valueColor: 'text-green-600'
    },
    {
      title: 'Giáo Viên',
      value: teachers,
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      valueColor: 'text-purple-600'
    },
    {
      title: 'Quản Trị Viên',
      value: admins,
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
      valueColor: 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {statisticsData.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className={`text-3xl font-bold ${stat.valueColor}`}>{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-full`}>
                <UserCheck className={`h-6 w-6 ${stat.textColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
