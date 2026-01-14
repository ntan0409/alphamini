import React from 'react';
import { CreditCard, Activity, Palette, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { OsmoCard } from '@/types/osmo-card';

interface StatisticsCardsProps {
  osmoCards: OsmoCard[];
}

export default function StatisticsCards({ osmoCards }: StatisticsCardsProps) {
  // Statistics calculations
  const totalCards = osmoCards.length;
  const activeCards = osmoCards.filter(card => card.status === 1).length;
  const uniqueColors = new Set(osmoCards.map(card => card.color).filter(color => color)).size;
  const recentCards = osmoCards.filter(card => {
    if (!card.createdDate) return false;
    const cardDate = new Date(card.createdDate);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return cardDate > weekAgo;
  }).length;

  const statisticsData = [
    {
      label: 'Tổng Thẻ',
      value: totalCards,
      color: 'text-gray-900',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      icon: CreditCard
    },
    {
      label: 'Thẻ Hoạt Động',
      value: activeCards,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      icon: Activity
    },
    {
      label: 'Màu Sắc',
      value: uniqueColors,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      icon: Palette
    },
    {
      label: 'Thẻ Gần Đây',
      value: recentCards,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      icon: Plus
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {statisticsData.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-full`}>
                  <IconComponent className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
