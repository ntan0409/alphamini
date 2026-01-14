import React, { useState } from 'react';
import { Zap, Music, Smile, CreditCard, Eye, Edit, Trash2, MoreVertical, PlugZap, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { OsmoCard } from '@/types/osmo-card';
import { toast } from 'sonner';

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
  // Get color mapping for background based on card color property
  const getColorBackground = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'red': 'bg-gradient-to-br from-red-500 to-red-600',
      'blue': 'bg-gradient-to-br from-blue-500 to-blue-600',
      'green': 'bg-gradient-to-br from-green-500 to-green-600',
      'yellow': 'bg-gradient-to-br from-yellow-500 to-yellow-600',
      'purple': 'bg-gradient-to-br from-purple-500 to-purple-600',
      'pink': 'bg-gradient-to-br from-pink-500 to-pink-600',
      'orange': 'bg-gradient-to-br from-orange-500 to-orange-600',
      'gray': 'bg-gradient-to-br from-gray-500 to-gray-600',
    };
    
    return colorMap[color?.toLowerCase()] || 'bg-gradient-to-br from-gray-500 to-gray-600';
  };

  // Get border color mapping based on card color property
  const getColorBorder = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'red': 'border-red-200',
      'blue': 'border-blue-200',
      'green': 'border-green-200',
      'yellow': 'border-yellow-200',
      'purple': 'border-purple-200',
      'pink': 'border-pink-200',
      'orange': 'border-orange-200',
      'gray': 'border-gray-200',
    };
    
    return colorMap[color?.toLowerCase()] || 'border-gray-200';
  };

  // Get icon based on card type
  const getCardIcon = (type: string) => {
    const iconMap: { [key: string]: React.ElementType } = {
      'action': Zap,
      'expression': Smile,
      'dance': Music,
      'extendedAction': PlugZap,
      'skill': Brain,
    };
    return iconMap[type.toLowerCase()] || CreditCard;
  };

  // Determine card type based on which activity is assigned
  const getCardType = (card: OsmoCard) => {
    if (card.actionName && card.actionName !== 'No Action') return 'action';
    if (card.expressionName && card.expressionName !== 'No Expression') return 'expression';
    if (card.danceName && card.danceName !== 'No Dance') return 'dance';
    if (card.extendedActionName && card.extendedActionName !== 'No Extended Action') return 'extendedAction';
    if (card.skillName && card.skillName !== 'No Skill') return 'skill';
    return 'unknown';
  };

  const cardType = getCardType(card);
  const cardBackground = getColorBackground(card.color);
  const cardBorder = getColorBorder(card.color);
  const IconComponent = getCardIcon(cardType);

  const getColorDisplay = (color: string) => {
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

  const handleDelete = () => {
    toast.custom(
      (t) => (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-80">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Trash2 className="h-5 w-5 text-red-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900">
                Delete Osmo Card
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Are you sure you want to delete &quot;{card.name}&quot;? This action cannot be undone.
              </p>
              <div className="flex space-x-2 mt-3">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    toast.dismiss(t);
                    onDelete(card.id);
                    toast.success('Osmo Card deleted successfully');
                  }}
                >
                  Delete
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.dismiss(t)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        duration: Infinity, // Keep it open until user interacts
        position: 'top-center',
      }
    );
  };

  const handleView = () => {
    onView?.(card.id);
  };

  const handleEdit = () => {
    onEdit?.(card.id);
  };

  return (
    <div 
      className={`relative group transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Card */}
      <div className={`relative h-72 ${cardBackground} rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 ${cardBorder} border-2`}>
        
        {/* Card Header with Actions */}
        <div className="flex justify-between items-start mb-4">
          {/* Status Badge */}
          <Badge 
            className={`${card.status === 1 ? 'bg-green-400 hover:bg-green-400' : 'bg-red-400 hover:bg-red-400'} text-white border-0`}
          >
            {card.status === 1 ? 'Active' : 'Inactive'}
          </Badge>
          
          {/* Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 w-8 p-0 text-white hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={handleView} className="cursor-pointer">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDelete} 
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Card Content */}
        <div className="flex flex-col items-center justify-center h-32">
          {/* Icon */}
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3">
            <IconComponent className="w-8 h-8 text-white" />
          </div>
          
          {/* Card Name */}
          <h3 className="text-lg font-semibold text-center mb-1">
            {card.name || 'Unnamed Card'}
          </h3>
          <p className="text-sm opacity-80 capitalize">{cardType} Card</p>
        </div>

        {/* Card Footer Info */}
        <div className="absolute bottom-4 left-6 right-6">
          <div className="flex items-center justify-between text-xs opacity-75">
            {/* Color */}
            <div className="flex items-center space-x-1">
              <div 
                className="w-3 h-3 rounded-full border border-white/50"
                style={{ backgroundColor: getColorDisplay(card.color) }}
              />
              <span className="capitalize">{card.color || 'N/A'}</span>
            </div>
            
            {/* Activity Info */}
            <div className="text-right">
              {cardType === 'action' && card.actionName && (
                <p className="truncate max-w-24">{card.actionName}</p>
              )}
              {cardType === 'expression' && card.expressionName && (
                <p className="truncate max-w-24">{card.expressionName}</p>
              )}
              {cardType === 'extendedAction' && card.extendedActionName && (
                <p className="truncate max-w-24">{card.extendedActionName}</p>
              )}
              {cardType === 'skill' && card.skillName && (
                <p className="truncate max-w-24">{card.skillName}</p>
              )}
              {cardType === 'dance' && card.danceName && (
                <p className="truncate max-w-24">{card.danceName}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons (visible on hover) */}
      <div className={`absolute inset-x-4 -bottom-4 flex space-x-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        <Button 
          size="sm" 
          variant="secondary" 
          className="flex-1 bg-white hover:bg-gray-50 text-gray-700 shadow-lg"
          onClick={handleView}
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
        <Button 
          size="sm" 
          variant="secondary" 
          className="flex-1 bg-white hover:bg-gray-50 text-gray-700 shadow-lg"
          onClick={handleEdit}
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </div>
    </div>
  );
}
