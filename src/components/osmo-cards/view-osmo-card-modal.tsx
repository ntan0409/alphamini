import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Activity, Music, Zap, Smile, PlugZap, Brain } from 'lucide-react';
import { OsmoCard } from '@/types/osmo-card';

interface ViewOsmoCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: OsmoCard | null;
}

export default function ViewOsmoCardModal({ isOpen, onClose, card }: ViewOsmoCardModalProps) {
  if (!card) return null;

  // Determine card type based on which activity is assigned
  const getCardType = (card: OsmoCard) => {
    if (card.actionName && card.actionName !== 'No Action') return 'action';
    if (card.expressionName && card.expressionName !== 'No Expression') return 'expression';
    if (card.danceName && card.danceName !== 'No Dance') return 'dance';
    if (card.extendedActionName && card.extendedActionName !== 'No Extended Action') return 'extendedAction';
    if (card.skillName && card.skillName !== 'No Skill') return 'skill';
    return 'unknown';
  };

  // Get color and icon for card display based on type
  const getCardStyle = (type: string) => {
    const styleMap: { [key: string]: { bg: string, icon: React.ElementType, textColor: string } } = {
      'action': { 
        bg: 'bg-red-500', 
        icon: Zap, 
        textColor: 'text-red-600'
      },
      'expression': { 
        bg: 'bg-blue-500', 
        icon: Smile, 
        textColor: 'text-blue-600'
      },
      'dance': { 
        bg: 'bg-orange-500', 
        icon: Music, 
        textColor: 'text-orange-600'
      },
      'extendedAction': { 
        bg: 'bg-purple-500', 
        icon: PlugZap, 
        textColor: 'text-purple-600'
      },
      'skill': { 
        bg: 'bg-green-500', 
        icon: Brain, 
        textColor: 'text-green-600'
      },
    };
    return styleMap[type.toLowerCase()] || { 
      bg: 'bg-gray-500', 
      icon: Activity, 
      textColor: 'text-gray-600'
    };
  };

  const cardType = getCardType(card);
  const cardStyle = getCardStyle(cardType);
  const IconComponent = cardStyle.icon;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status: number) => {
    return status === 1 ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        Active
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
        Inactive
      </Badge>
    );
  };

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
    
    return (
      <div className="flex items-center space-x-2">
        <div 
          className="w-4 h-4 rounded-full border"
          style={{ backgroundColor: colorMap[color?.toLowerCase()] || '#6b7280' }}
        />
        <span className="capitalize">{color || 'Unknown'}</span>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${cardStyle.bg} text-white`}>
              <IconComponent className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{card.name || 'Unnamed Card'}</h2>
              <p className={`text-sm ${cardStyle.textColor} capitalize`}>{cardType} Card</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Card Name</label>
                <p className="text-gray-900">{card.name || 'N/A'}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Status</label>
                <div>{getStatusBadge(card.status)}</div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Color</label>
                <div>{getColorDisplay(card.color)}</div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Card ID</label>
                <p className="text-gray-900 font-mono text-sm">{card.id}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Activity Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Activity Information</h3>
            
            <div className="grid grid-cols-1 gap-4">
              {/* Action */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="h-4 w-4 text-red-500" />
                  <label className="text-sm font-medium text-gray-600">Action</label>
                </div>
                <p className="text-gray-900">{card.actionName || 'No Action'}</p>
              </div>

              {/* Expression */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Smile className="h-4 w-4 text-blue-500" />
                  <label className="text-sm font-medium text-gray-600">Expression</label>
                </div>
                <p className="text-gray-900">{card.expressionName || 'No Expression'}</p>
              </div>

              {/* Extended Action */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <PlugZap className="h-4 w-4 text-purple-500" />
                  <label className="text-sm font-medium text-gray-600">Extended Action</label>
                </div>
                <p className="text-gray-900">{card.extendedActionName || 'No Extended Action'}</p>
              </div>

              {/* Skill */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Brain className="h-4 w-4 text-green-500" />
                  <label className="text-sm font-medium text-gray-600">Skill</label>
                </div>
                <p className="text-gray-900">{card.skillName || 'No Skill'}</p>
              </div>

              {/* Dance */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Music className="h-4 w-4 text-orange-500" />
                  <label className="text-sm font-medium text-gray-600">Dance</label>
                </div>
                <p className="text-gray-900">{card.danceName || 'No Dance'}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Timestamp Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Timeline</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <label className="text-sm font-medium text-gray-600">Created Date</label>
                </div>
                <p className="text-gray-900">{formatDate(card.createdDate)}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <label className="text-sm font-medium text-gray-600">Last Updated</label>
                </div>
                <p className="text-gray-900">{formatDate(card.lastUpdate)}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
