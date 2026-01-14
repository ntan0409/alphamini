import React, { useState } from 'react';
import { Zap, Music, Smile, CreditCard, Eye, Edit, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { OsmoCard } from '@/types/osmo-card';

interface OsmoCardItemProps {
  card: OsmoCard;
  onDelete: (cardId: string) => void;
  onView?: (cardId: string) => void;
  onEdit?: (cardId: string) => void;
}

export default function OsmoCardItem({
  card,
  onDelete,
  onView,
  onEdit
}: OsmoCardItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Get color and icon for card display based on type
  const getCardStyle = (type: string) => {
    const styleMap: { [key: string]: { bg: string, icon: React.ElementType, border: string, textColor: string } } = {
      'action': { 
        bg: 'bg-gradient-to-br from-red-500 to-red-600', 
        icon: Zap, 
        border: 'border-red-200',
        textColor: 'text-red-600'
      },
      'expression': { 
        bg: 'bg-gradient-to-br from-blue-500 to-blue-600', 
        icon: Smile, 
        border: 'border-blue-200',
        textColor: 'text-blue-600'
      },
      'dance': { 
        bg: 'bg-gradient-to-br from-orange-500 to-orange-600', 
        icon: Music, 
        border: 'border-orange-200',
        textColor: 'text-orange-600'
      },
    };
    return styleMap[type.toLowerCase()] || { 
      bg: 'bg-gradient-to-br from-gray-500 to-gray-600', 
      icon: CreditCard, 
      border: 'border-gray-200',
      textColor: 'text-gray-600'
    };
  };

  // Determine card type based on which activity is assigned
  const getCardType = (card: OsmoCard) => {
    if (card.actionName && card.actionName !== 'No Action') return 'action';
    if (card.expressionName && card.expressionName !== 'No Expression') return 'expression';
    if (card.danceName && card.danceName !== 'No Dance') return 'dance';
    return 'unknown';
  };

  const cardType = getCardType(card);
  const cardStyle = getCardStyle(cardType);
  const IconComponent = cardStyle.icon;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this Osmo Card?')) {
      onDelete(card.id);
    }
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onView?.(card.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(card.id);
  };

  const getActivityInfo = () => {
    if (cardType === 'action' && card.actionName) return card.actionName;
    if (cardType === 'expression' && card.expressionName) return card.expressionName;
    if (cardType === 'dance' && card.danceName) return card.danceName;
    return 'No Activity';
  };

  const getColorPreview = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'red': '#ef4444',
      'blue': '#3b82f6', 
      'green': '#22c55e',
      'yellow': '#eab308',
      'purple': '#a855f7',
      'pink': '#ec4899',
      'orange': '#f97316',
      'gray': '#6b7280',
    };
    return colorMap[color?.toLowerCase()] || '#6b7280';
  };

  return (
    <div 
      className={`relative group transition-all duration-200 hover:scale-105 ${
        isHovered ? 'z-10' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Card */}
      <div className={`bg-white rounded-2xl shadow-lg border-2 ${cardStyle.border} overflow-hidden h-80 relative`}>
        
        {/* Header Section */}
        <div className={`${cardStyle.bg} p-4 text-white relative`}>
          {/* Actions Dropdown */}
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleView} className="cursor-pointer">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Card
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete} 
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Card
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Status Badge */}
          <div className="absolute top-2 left-2">
            <div className={`w-3 h-3 rounded-full ${card.status === 1 ? 'bg-green-400' : 'bg-red-400'}`}></div>
          </div>

          {/* Icon */}
          <div className="flex justify-center mt-6 mb-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <IconComponent className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          {/* Card Info */}
          <div className="space-y-3">
            {/* Card Name */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {card.name || 'Unnamed Card'}
              </h3>
              <Badge 
                variant="secondary" 
                className={`${cardStyle.textColor} bg-opacity-10 text-xs`}
              >
                {cardType.charAt(0).toUpperCase() + cardType.slice(1)} Card
              </Badge>
            </div>

            {/* Activity Info */}
            <div className="space-y-2">
              <div className="text-center">
                <p className="text-sm text-gray-600 font-medium">Activity</p>
                <p className="text-sm text-gray-900 truncate">{getActivityInfo()}</p>
              </div>
            </div>

            {/* Color Info */}
            <div className="flex items-center justify-center space-x-2">
              <div 
                className="w-4 h-4 rounded-full border-2 border-gray-300"
                style={{ 
                  backgroundColor: getColorPreview(card.color)
                }}
              />
              <span className="text-sm text-gray-600 capitalize">
                {card.color || 'No Color'}
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex space-x-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleView}
              className="flex-1 text-xs"
            >
              <Eye className="h-3 w-3 mr-1" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="flex-1 text-xs"
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
          </div>
        </div>

        {/* Hover Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-5 pointer-events-none rounded-2xl" />
        )}
      </div>
    </div>
  );
}
