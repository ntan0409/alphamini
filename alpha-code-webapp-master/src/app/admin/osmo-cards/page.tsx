"use client";
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOsmoCard } from '@/features/activities/hooks/use-osmo-card';
import { CreateCardData, OsmoCard } from '@/types/osmo-card';
import { toast } from 'sonner';
// Import các component đã tách
import PageHeader from '@/components/osmo-cards/page-header';
import StatisticsCards from '@/components/osmo-cards/statistics-cards';
import SearchAndFilter from '@/components/osmo-cards/search-and-filter';
import OsmoCardGrid from '@/components/osmo-cards/osmo-card-grid';
import LoadingState from '@/components/loading-state';
import ErrorState from '@/components/error-state';
import ViewOsmoCardModal from '@/components/osmo-cards/view-osmo-card-modal';
import EditOsmoCardModal from '@/components/osmo-cards/edit-osmo-card-modal';
import CreateOsmoCardModal from '@/components/osmo-cards/create-osmo-card-modal';
import { ApiResponse } from '@/types/api-error';
import { OsmoCard as OsmoCardType } from '@/types/osmo-card';

export default function OsmoCardManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterColor, setFilterColor] = useState<string>('all');

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<OsmoCard | null>(null);
  const [editApiError, setEditApiError] = useState<ApiResponse>();

  const osmoCardHooks = useOsmoCard();
  // Keep full query object to enable retry (refetch)
  const osmoCardsQuery = osmoCardHooks.useGetAllOsmoCards();
  const { data: osmoCardsResponse, isLoading, error, refetch, isFetching } = osmoCardsQuery;
  const deleteOsmoCardMutation = osmoCardHooks.useDeleteOsmoCard();
  const updateOsmoCardMutation = osmoCardHooks.useUpdateOsmoCard();
  const createOsmoCardMutation = osmoCardHooks.useCreateOsmoCard();

  // Extract osmo cards from PagedResult with stable reference
  const osmoCards = useMemo(() => {
    return osmoCardsResponse?.data || [];
  }, [osmoCardsResponse?.data]);

  // Helper to extract error message from various error shapes (axios, ApiResponse, plain Error)
  const extractErrorInfo = (error: unknown): { message: string; status?: number } => {
    const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;

    try {
      if (!error) return { message: 'Unknown error' };

      // axios-like: error.response?.data
      if (isObject(error) && 'response' in error) {
        const resp = (error as { response?: unknown }).response;
        if (isObject(resp) && 'data' in resp && isObject((resp as { data?: unknown }).data)) {
          const data = (resp as { data: unknown }).data as Record<string, unknown>;
          if (typeof data.message === 'string') return { message: data.message, status: typeof data.status === 'number' ? (data.status as number) : undefined };
          if (typeof data.error === 'string') return { message: data.error, status: typeof data.status === 'number' ? (data.status as number) : undefined };
        }
      }

      // ApiResponse shape
      if (isObject(error) && 'message' in error && typeof (error as { message?: unknown }).message === 'string') {
        const api = error as unknown as ApiResponse;
        return { message: api.message ?? 'Unknown error', status: api.status };
      }

      // Plain Error (Error instance)
      if (error instanceof Error && typeof error.message === 'string') {
        return { message: error.message };
      }

      // Fallback to string conversion
      return { message: String(error) };
    } catch (e) {
      return { message: 'An unexpected error occurred' };
    }
  };

  // Get unique colors and statuses for filters
  const availableColors = useMemo(() => {
    const colors = [...new Set(osmoCards.map(card => card.color).filter(color => color && color.trim() !== ''))];
    return colors;
  }, [osmoCards]);

  const availableStatuses = useMemo(() => {
    const statuses = [...new Set(osmoCards.map(card => card.status))];
    return statuses;
  }, [osmoCards]);

  const filteredOsmoCards = useMemo(() => {
    return osmoCards.filter(card => {
      const matchesSearch = (card.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (card.expressionName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (card.actionName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (card.danceName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (card.extendedActionName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (card.skillName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (card.color || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || card.status?.toString() === filterStatus;
      const matchesColor = filterColor === 'all' || card.color === filterColor;
      return matchesSearch && matchesStatus && matchesColor;
    });
  }, [osmoCards, searchTerm, filterStatus, filterColor]);

  // Event handlers
  const handleDeleteCard = (cardId: string) => {
    deleteOsmoCardMutation.mutate(cardId, {
      onSuccess: () => {
        // Success toast will be shown by the osmo-card-item component
      },
      onError: (error: Error) => {
        console.error('Delete error:', error);

        // Extract error message from API response
        const errorMessage = 'Không thể xóa thẻ Osmo';
        let errorDescription = 'Vui lòng thử lại sau.';

        // Try to extract API error details if available
        const apiError = error as unknown as ApiResponse;
        if (typeof apiError?.message === 'string') {
          errorDescription = apiError.message;
        }

        toast.error(errorMessage, {
          description: errorDescription,
          duration: 5000,
        });
      }
    });
  };

  const handleAddNewCard = () => {
    setCreateModalOpen(true);
  };

  const handleViewCard = (cardId: string) => {
    const card = osmoCards.find(c => c.id === cardId);
    if (card) {
      setSelectedCard(card);
      setViewModalOpen(true);
    }
  };

  const handleEditCard = (cardId: string) => {
    const card = osmoCards.find(c => c.id === cardId);
    if (card) {
      setSelectedCard(card);
      setEditModalOpen(true);
    }
  };

  const handleSaveEdit = (cardId: string, updatedData: Partial<OsmoCard>) => {
    // Clear previous errors
    setEditApiError(undefined);

    updateOsmoCardMutation.mutate({
      id: cardId,
      osmoCardData: updatedData
    }, {
      onSuccess: () => {
        setEditModalOpen(false);
        setSelectedCard(null);
        setEditApiError(undefined);
        toast.success('Đã cập nhật thẻ Osmo thành công');
      },
        onError: (error: unknown) => {
          // Cast error to ApiResponse to access custom properties and extract message robustly
          const apiError = error as unknown as ApiResponse;
          // Store error for modal to display field-specific errors
          setEditApiError(apiError);

          const extracted = extractErrorInfo(error);
          const errorMessage = extracted.message || 'Không thể cập nhật thẻ Osmo';
          const errorDescription = 'Vui lòng kiểm tra lại biểu mẫu và thử lại.';

          toast.error(errorMessage, {
            description: errorDescription,
            duration: 5000, // Show longer for error messages
          });
        }
    });
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedCard(null);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedCard(null);
    setEditApiError(undefined);
  };

  const handleCreateCard = () => {
    setCreateModalOpen(true);
  };

  const handleSaveCreate = (cardData: CreateCardData) => {
    createOsmoCardMutation.mutate(cardData, {
      onSuccess: () => {
        setCreateModalOpen(false);
        toast.success('Đã tạo thẻ Osmo thành công');
      },
      onError: (error: Error) => {
        const extracted = extractErrorInfo(error);
        const errorMessage = extracted.message || 'Không thể tạo thẻ Osmo';
        const errorDescription = 'Vui lòng thử lại sau.';

        toast.error(errorMessage, { description: errorDescription, duration: 5000 });
      }
    });
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
  };

  // Loading and error states
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
        <ErrorState
          error={error}
          onRetry={() => refetch()}
          className={isFetching ? 'opacity-70 pointer-events-none' : ''}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader onAddNewCard={handleAddNewCard} />

      {/* Statistics Cards */}
      <StatisticsCards osmoCards={filteredOsmoCards} />

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Thẻ Osmo</CardTitle>
        </CardHeader>
        <CardContent>
          <SearchAndFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterColor={filterColor}
            setFilterColor={setFilterColor}
            availableStatuses={availableStatuses}
            availableColors={availableColors}
          />

          {/* Cards Grid */}
          <OsmoCardGrid
            osmoCards={osmoCards}
            filteredOsmoCards={filteredOsmoCards}
            onDeleteCard={handleDeleteCard}
            onViewCard={handleViewCard}
            onEditCard={handleEditCard}
            onCreateCard={handleCreateCard}
          />
        </CardContent>
      </Card>

      {/* Modals */}
      <ViewOsmoCardModal
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
        card={selectedCard}
      />

      <EditOsmoCardModal
        isOpen={editModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveEdit}
        card={selectedCard}
        isLoading={updateOsmoCardMutation.isPending}
        apiError={editApiError}
      />

      <CreateOsmoCardModal
        isOpen={createModalOpen}
        onClose={handleCloseCreateModal}
        onCreate={handleSaveCreate}
        isLoading={createOsmoCardMutation?.isPending}
      />
    </div>
  );
}