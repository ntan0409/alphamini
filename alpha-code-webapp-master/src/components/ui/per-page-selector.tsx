import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PerPageSelectorProps {
  perPage: number;
  onPerPageChange: (perPage: number) => void;
  options?: number[];
  className?: string;
}

export function PerPageSelector({
  perPage,
  onPerPageChange,
  options = [6, 12, 24, 48],
  className = ""
}: PerPageSelectorProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-600 whitespace-nowrap">Hiển thị:</span>
      <Select value={perPage.toString()} onValueChange={(value) => onPerPageChange(Number(value))}>
        <SelectTrigger className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option.toString()}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-sm text-gray-600">mục/trang</span>
    </div>
  );
}