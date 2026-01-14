"use client";

import { useState, useMemo } from 'react';
import React from 'react';
import { 
  Bot, 
  Edit,
  Plus,
  Trash2,
  Search,
  Power,
  PowerOff
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useRobotModel } from '@/features/robots/hooks/use-robot-model';
import LoadingState from '@/components/loading-state';
import ErrorState from '@/components/error-state';
import { toast } from 'sonner';
import { RobotModel } from '@/types/robot-model';
import { RobotModelModal, RobotModelFormData } from './robot-model-modal';

export default function RobotModelManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<RobotModel | null>(null);

  const robotModelHooks = useRobotModel();
  const { data: robotModelsResponse, isLoading, error, refetch } = robotModelHooks.useGetAllRobotModels();
  const createModelMutation = robotModelHooks.useCreateRobotModel();
  const updateModelMutation = robotModelHooks.useUpdateRobotModel();
  const deleteModelMutation = robotModelHooks.useDeleteRobotModel();
  const changeStatusMutation = robotModelHooks.useChangeRobotModelStatus();
  
  const robotModels = useMemo(() => {
    return robotModelsResponse?.data || [];
  }, [robotModelsResponse?.data]);

  const filteredModels = useMemo(() => {
    return robotModels.filter(model => {
      const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.firmwareVersion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.ctrlVersion.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [robotModels, searchTerm]);

  const getStatusColor = (status: number) => {
    return status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getStatusIcon = (status: number) => {
    return status === 1 ? <Power className="h-4 w-4" /> : <PowerOff className="h-4 w-4" />;
  };

  const handleOpenCreateModal = () => {
    setEditingModel(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (model: RobotModel) => {
    setEditingModel(model);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingModel(null);
  };

  const handleSubmitForm = (formData: RobotModelFormData) => {
    if (editingModel) {
      // Update existing model
      updateModelMutation.mutate(
        { id: editingModel.id, data: formData as RobotModelFormData },
        {
          onSuccess: () => {
            toast.success(`Đã cập nhật model "${formData.name}" thành công!`);
            handleCloseModal();
          },
          onError: (error) => {
            const errorMessage = error instanceof Error ? error.message : 'Không thể cập nhật model';
            toast.error(`Lỗi: ${errorMessage}`);
          }
        }
      );
    } else {
      // Create new model
      createModelMutation.mutate(formData as RobotModelFormData, {
        onSuccess: () => {
          toast.success(`Đã thêm model "${formData.name}" thành công!`);
          handleCloseModal();
        },
        onError: (error) => {
          const errorMessage = error instanceof Error ? error.message : 'Không thể tạo model';
          toast.error(`Lỗi: ${errorMessage}`);
        }
      });
    }
  };

  const handleToggleStatus = (modelId: string, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 2 : 1;
    const modelToUpdate = robotModels.find(m => m.id === modelId);
    const modelName = modelToUpdate?.name || 'Model Robot';

    changeStatusMutation.mutate({ id: modelId, status: newStatus }, {
      onSuccess: () => {
        toast.success(`Đã cập nhật trạng thái ${modelName} thành công!`);
      },
      onError: (error) => {
        const errorMessage = error instanceof Error ? error.message : 'Không thể cập nhật trạng thái';
        toast.error(`Lỗi: ${errorMessage}`);
      }
    });
  };

  const handleDeleteModel = (modelId: string) => {
    const modelToDelete = robotModels.find(m => m.id === modelId);
    const modelName = modelToDelete?.name || 'model này';

    const confirmDelete = () => (
      <div className="flex flex-col space-y-3">
        <div className="text-sm text-gray-700">
          Bạn có chắc chắn muốn xóa <strong>{modelName}</strong>?
        </div>
        <div className="text-xs text-gray-500">
          Hành động này không thể hoàn tác.
        </div>
        <div className="flex space-x-2 justify-end">
          <button
            onClick={() => toast.dismiss()}
            className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              deleteModelMutation.mutate(modelId, {
                onSuccess: () => {
                  toast.success(`Đã xóa model "${modelName}" thành công!`);
                },
                onError: (error) => {
                  const errorMessage = error instanceof Error ? error.message : 'Không thể xóa model';
                  toast.error(`Lỗi: ${errorMessage}`);
                }
              });
              toast.dismiss();
            }}
            className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Xóa
          </button>
        </div>
      </div>
    );

    toast.warning(confirmDelete);
  };

  const stats = {
    total: filteredModels.length,
    active: filteredModels.filter(m => m.status === 1).length,
    inactive: filteredModels.filter(m => m.status === 0).length
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ErrorState error={error as Error} onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Model Robot</h1>
          <p className="text-gray-600">Quản lý các model robot, phiên bản firmware và cấu hình</p>
        </div>
        <Button onClick={handleOpenCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm Model Mới
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Tìm kiếm theo tên, phiên bản firmware hoặc phiên bản điều khiển..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng Số Model</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Bot className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đang Hoạt Động</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <Power className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Không Hoạt Động</p>
                <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
              </div>
              <PowerOff className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Robot Models Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredModels.map((model) => (
          <Card key={model.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Bot className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{model.name}</CardTitle>
                    <p className="text-sm text-gray-500">ID: {model.id.substring(0, 8)}...</p>
                  </div>
                </div>
                <Badge className={getStatusColor(model.status)}>
                  {getStatusIcon(model.status)}
                  <span className="ml-1">{model.status === 1 ? 'Hoạt động' : 'Không hoạt động'}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Firmware and Ctrl Version */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Phiên Bản Firmware</p>
                    <p className="text-sm font-medium">{model.firmwareVersion}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Phiên Bản Điều Khiển</p>
                    <p className="text-sm font-medium">{model.ctrlVersion}</p>
                  </div>
                </div>

                {/* Robot Prompt */}
                {model.robotPrompt && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Prompt Robot</p>
                    <p className="text-sm line-clamp-3">{model.robotPrompt}</p>
                  </div>
                )}

                {/* Timestamps */}
                <div className="space-y-1 text-xs text-gray-500">
                  <div>
                    <span className="font-medium">Ngày tạo:</span> {new Date(model.createdDate).toLocaleString('vi-VN')}
                  </div>
                  {model.lastUpdated && (
                    <div>
                      <span className="font-medium">Cập nhật lần cuối:</span> {new Date(model.lastUpdated).toLocaleString('vi-VN')}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Button 
                    size="sm" 
                    variant={model.status === 1 ? 'outline' : 'default'}
                    onClick={() => handleToggleStatus(model.id, model.status)}
                    disabled={changeStatusMutation.isPending}
                    className="flex-1"
                  >
                    {model.status === 1 ? (
                      <>
                        <PowerOff className="h-3 w-3 mr-1" />
                        Tắt
                      </>
                    ) : (
                      <>
                        <Power className="h-3 w-3 mr-1" />
                        Bật
                      </>
                    )}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleOpenEditModal(model)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Sửa
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDeleteModel(model.id)}
                    disabled={deleteModelMutation.isPending}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredModels.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Bot className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy model robot</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Thử điều chỉnh từ khóa tìm kiếm' : 'Bắt đầu bằng cách tạo model robot mới'}
            </p>
            {!searchTerm && (
              <Button onClick={handleOpenCreateModal}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm Model Đầu Tiên
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modal */}
      <RobotModelModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitForm}
        editingModel={editingModel}
        isLoading={createModelMutation.isPending || updateModelMutation.isPending}
      />
    </div>
  );
}
