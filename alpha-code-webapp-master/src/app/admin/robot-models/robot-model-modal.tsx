"use client";

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RobotModel } from '@/types/robot-model';

interface RobotModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RobotModelFormData) => void;
  editingModel: RobotModel | null;
  isLoading: boolean;
}

export interface RobotModelFormData {
  name: string;
  firmwareVersion: string;
  ctrlVersion: string;
  robotPrompt: string;
  status?: number;
}

export function RobotModelModal({ isOpen, onClose, onSubmit, editingModel, isLoading }: RobotModelModalProps) {
  const [formData, setFormData] = useState<RobotModelFormData>({
    name: '',
    firmwareVersion: '',
    ctrlVersion: '',
    robotPrompt: '',
    status: undefined,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RobotModelFormData, string>>>({});

  useEffect(() => {
    if (editingModel) {
      setFormData({
        name: editingModel.name,
        firmwareVersion: editingModel.firmwareVersion,
        ctrlVersion: editingModel.ctrlVersion,
        robotPrompt: editingModel.robotPrompt,
        status: editingModel.status,
      });
    } else {
      setFormData({
        name: '',
        firmwareVersion: '',
        ctrlVersion: '',
        robotPrompt: '',
        status: undefined,
      });
    }
    setErrors({});
  }, [editingModel, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RobotModelFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên model là bắt buộc';
    }
    if (!formData.firmwareVersion.trim()) {
      newErrors.firmwareVersion = 'Phiên bản firmware là bắt buộc';
    }
    if (!formData.ctrlVersion.trim()) {
      newErrors.ctrlVersion = 'Phiên bản điều khiển là bắt buộc';
    }
    if (!formData.robotPrompt.trim()) {
      newErrors.robotPrompt = 'Prompt robot là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  const handleChange = (field: keyof RobotModelFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingModel ? 'Chỉnh sửa Model Robot' : 'Thêm Model Robot Mới'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Tên Model <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ví dụ: Alpha Mini v2.0"
              className={errors.name ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Firmware Version */}
          <div>
            <Label htmlFor="firmwareVersion" className="text-sm font-medium text-gray-700">
              Phiên Bản Firmware <span className="text-red-500">*</span>
            </Label>
            <Input
              id="firmwareVersion"
              type="text"
              value={formData.firmwareVersion}
              onChange={(e) => handleChange('firmwareVersion', e.target.value)}
              placeholder="Ví dụ: v1.2.3"
              className={errors.firmwareVersion ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.firmwareVersion && (
              <p className="mt-1 text-sm text-red-500">{errors.firmwareVersion}</p>
            )}
          </div>

          {/* Ctrl Version */}
          <div>
            <Label htmlFor="ctrlVersion" className="text-sm font-medium text-gray-700">
              Phiên Bản Điều Khiển <span className="text-red-500">*</span>
            </Label>
            <Input
              id="ctrlVersion"
              type="text"
              value={formData.ctrlVersion}
              onChange={(e) => handleChange('ctrlVersion', e.target.value)}
              placeholder="Ví dụ: v2.0.1"
              className={errors.ctrlVersion ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.ctrlVersion && (
              <p className="mt-1 text-sm text-red-500">{errors.ctrlVersion}</p>
            )}
          </div>

          {/* Robot Prompt */}
          <div>
            <Label htmlFor="robotPrompt" className="text-sm font-medium text-gray-700">
              Prompt Robot <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="robotPrompt"
              value={formData.robotPrompt}
              onChange={(e) => handleChange('robotPrompt', e.target.value)}
              placeholder="Nhập hướng dẫn hoặc prompt cho robot..."
              rows={6}
              className={errors.robotPrompt ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.robotPrompt && (
              <p className="mt-1 text-sm text-red-500">{errors.robotPrompt}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Mô tả chi tiết về chức năng và cấu hình của model robot
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Đang lưu...
                </>
              ) : (
                editingModel ? 'Cập nhật' : 'Thêm mới'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
