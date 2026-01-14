import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Camera, Mail, Phone, User, Calendar, LucideIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Account } from '@/types/account';

interface ProfileHeaderProps {
  account: Account;
  roleIcon: LucideIcon;
  roleBadgeText: string;
  roleBadgeVariant?: 'default' | 'secondary';
}

export function ProfileHeader({ 
  account, 
  roleIcon: RoleIcon, 
  roleBadgeText, 
  roleBadgeVariant = 'default' 
}: ProfileHeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="h-32 w-32">
              <AvatarImage src={account.image} alt={account.fullName} />
              <AvatarFallback className="text-2xl">
                {getInitials(account.fullName)}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-0 right-0 rounded-full"
              disabled
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl">{account.fullName}</CardTitle>
            <Badge variant={roleBadgeVariant} className="flex items-center gap-1">
              <RoleIcon className="h-3 w-3" />
              {roleBadgeText}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Separator />
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">{account.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">{account.phone || 'Chưa có số điện thoại'}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">{account.username}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">
              Tham gia {account.createdDate ? format(new Date(account.createdDate), 'MM/yyyy') : 'N/A'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
