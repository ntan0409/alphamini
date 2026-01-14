"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, DollarSign, Search, Edit2, Eye, Trash2, Loader2, Save, SortAsc, SortDesc, Filter } from "lucide-react"
import { useGetTokenRules, useCreateTokenRule, useUpdateTokenRule, useDeleteTokenRule } from '@/features/config/hooks/use-token-rule'
import { TokenRule } from "@/types/pricing"
import LoadingState from '@/components/loading-state'
import ErrorState from '@/components/error-state'
import { toast } from "sonner"

export default function TokenRulePage() {
  // States for data management
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'code' | 'cost' | 'createdAt'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedRule, setSelectedRule] = useState<TokenRule | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    code: '',
    cost: '',
    note: ''
  })
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')

  // API hooks
  const { data, isLoading, error } = useGetTokenRules(currentPage, itemsPerPage, searchTerm || undefined)
  const createMutation = useCreateTokenRule()
  const updateMutation = useUpdateTokenRule()
  const deleteMutation = useDeleteTokenRule()

  // Token number formatting
  const formatTokenCount = (count: number) => {
    return new Intl.NumberFormat('vi-VN').format(count)
  }

  // Filter and sort data locally
  const processedData = data?.data ? [...data.data]
    .filter(rule =>
      rule.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.note?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let valueA: string | number | Date, valueB: string | number | Date
      switch (sortBy) {
        case 'code':
          valueA = a.code || ''
          valueB = b.code || ''
          break
        case 'cost':
          valueA = a.cost || 0
          valueB = b.cost || 0
          break
        case 'createdAt':
          valueA = new Date(a.createdDate || 0)
          valueB = new Date(b.createdDate || 0)
          break
        default:
          return 0
      }
      
      if (sortOrder === 'asc') {
        return valueA > valueB ? 1 : -1
      } else {
        return valueA < valueB ? 1 : -1
      }
    }) : []

  // Form handlers
  const openCreateModal = () => {
    setFormData({ code: '', cost: '', note: '' })
    setFormMode('create')
    setCreateModalOpen(true)
  }

  const openEditModal = (rule: TokenRule) => {
    setFormData({
      code: rule.code || '',
      cost: rule.cost?.toString() || '',
      note: rule.note || ''
    })
    setSelectedRule(rule)
    setFormMode('edit')
    setEditModalOpen(true)
  }

  const openViewModal = (rule: TokenRule) => {
    setSelectedRule(rule)
    setViewModalOpen(true)
  }

  const openDeleteDialog = (rule: TokenRule) => {
    setSelectedRule(rule)
    setDeleteDialogOpen(true)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.code.trim()) {
      toast.error('Vui lòng nhập mã luật token')
      return
    }

    if (!formData.cost.trim()) {
      toast.error('Vui lòng nhập chi phí token')
      return
    }

    const cost = parseInt(formData.cost)
    if (isNaN(cost) || cost <= 0) {
      toast.error('Chi phí token phải là số nguyên dương')
      return
    }

    try {
      if (formMode === 'create') {
        await createMutation.mutateAsync({
          code: formData.code.trim(),
          cost,
          note: formData.note.trim() || undefined
        })
        toast.success('Tạo token rule thành công!')
        setCreateModalOpen(false)
      } else {
        if (!selectedRule?.id) {
          toast.error('Không tìm thấy ID của rule để cập nhật')
          return
        }
        await updateMutation.mutateAsync({
          id: selectedRule.id,
          code: formData.code.trim(),
          cost,
          note: formData.note.trim() || undefined,
          status: 1
        })
        toast.success('Cập nhật token rule thành công!')
        setEditModalOpen(false)
      }
      setFormData({ code: '', cost: '', note: '' })
    } catch {
      toast.error('Có lỗi xảy ra, vui lòng thử lại')
    }
  }

  const handleDelete = async () => {
    if (!selectedRule) return

    try {
      await deleteMutation.mutateAsync(selectedRule.id)
      toast.success('Xóa token rule thành công!')
      setDeleteDialogOpen(false)
      setSelectedRule(null)
    } catch {
      toast.error('Có lỗi xảy ra khi xóa')
    }
  }

  // Sort handler
  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const getSortIcon = (field: typeof sortBy) => {
    if (sortBy !== field) return null
    return sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorState error={error} />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div className="space-y-3">
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-800">
              Token Rules <span className="text-blue-600">Management</span>
            </h1>
            <p className="text-base lg:text-lg text-slate-600 max-w-2xl leading-relaxed">
              Quản lý số lượng token cho các dịch vụ AI, NLP và các API tích hợp trong hệ thống
            </p>
          </div>
          
          <Button 
            onClick={openCreateModal}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-lg font-medium"
          >
            <Plus className="h-5 w-5 mr-2" />
            Tạo Token Rule Mới
          </Button>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card className="lg:col-span-3 border border-slate-200 shadow-lg bg-white">
            <CardContent className="p-4 lg:p-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  placeholder="Tìm kiếm theo mã code hoặc ghi chú..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-11 text-base border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all rounded-lg"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-blue-200 shadow-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 font-medium text-sm">Tổng số Rules</p>
                  <p className="text-2xl lg:text-3xl font-bold">{data?.total_count || 0}</p>
                </div>
                <div className="bg-blue-500/30 p-2 rounded-lg">
                  <DollarSign className="h-6 w-6 lg:h-8 lg:w-8 text-blue-100" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        {isLoading ? (
          <Card className="border border-slate-200 shadow-lg bg-white">
            <CardContent className="p-8 lg:p-12">
              <LoadingState />
            </CardContent>
          </Card>
        ) : processedData.length === 0 ? (
          <Card className="border border-slate-200 shadow-lg bg-white">
            <CardContent className="p-8 lg:p-12 text-center">
              <div className="max-w-md mx-auto space-y-6">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                  <DollarSign className="h-10 w-10 text-slate-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-800">
                    {searchTerm ? 'Không tìm thấy kết quả' : 'Chưa có token rule nào'}
                  </h3>
                  <p className="text-slate-600">
                    {searchTerm 
                      ? 'Thử thay đổi từ khóa tìm kiếm hoặc xóa bộ lọc'
                      : 'Tạo token rule đầu tiên để bắt đầu quản lý số lượng token cho dịch vụ'
                    }
                  </p>
                </div>
                {!searchTerm && (
                  <Button 
                    onClick={openCreateModal} 
                    className="mt-6 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo Token Rule Đầu Tiên
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Sort Controls */}
            <Card className="border border-slate-200 shadow-sm bg-white">
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="font-medium text-slate-700 flex items-center gap-2">
                    <Filter className="h-4 w-4 text-slate-500" />
                    Sắp xếp theo:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={sortBy === 'code' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleSort('code')}
                      className={`h-9 px-3 ${sortBy === 'code' 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Mã Code {getSortIcon('code')}
                    </Button>
                    <Button
                      variant={sortBy === 'cost' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleSort('cost')}
                      className={`h-9 px-3 ${sortBy === 'cost' 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Số Token {getSortIcon('cost')}
                    </Button>
                    <Button
                      variant={sortBy === 'createdAt' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleSort('createdAt')}
                      className={`h-9 px-3 ${sortBy === 'createdAt' 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Thời Gian {getSortIcon('createdAt')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Token Rules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {processedData.map((rule) => (
                <Card key={rule.id} className="group border border-slate-200 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1">
                        {rule.code}
                      </Badge>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openViewModal(rule)}
                          className="h-8 w-8 p-0 hover:bg-blue-50 rounded-lg"
                        >
                          <Eye className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditModal(rule)}
                          className="h-8 w-8 p-0 hover:bg-slate-50 rounded-lg"
                        >
                          <Edit2 className="h-4 w-4 text-slate-600" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openDeleteDialog(rule)}
                          className="h-8 w-8 p-0 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0 space-y-4">
                    <div className="text-center">
                      <div className="text-2xl lg:text-3xl font-bold text-blue-600 mb-1">
                        {rule.cost ? formatTokenCount(rule.cost) : '0'} <span className="text-lg text-slate-500">tokens</span>
                      </div>
                      <div className="text-sm text-slate-500">Số lượng token</div>
                    </div>
                    
                    {rule.note && (
                      <div className="text-sm text-slate-600 line-clamp-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {rule.note}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
                      <span>Tạo: {rule.createdDate ? new Date(rule.createdDate).toLocaleDateString('vi-VN') : 'N/A'}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Create/Edit Modal */}
        <Dialog open={createModalOpen || editModalOpen} onOpenChange={(open) => {
          if (!open) {
            setCreateModalOpen(false)
            setEditModalOpen(false)
            setFormData({ code: '', cost: '', note: '' })
          }
        }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                {formMode === 'create' ? 'Tạo Token Rule Mới' : 'Chỉnh Sửa Token Rule'}
              </DialogTitle>
              <DialogDescription>
                {formMode === 'create' 
                  ? 'Tạo cấu hình số lượng token mới cho dịch vụ trong hệ thống'
                  : 'Cập nhật số lượng token cho luật đã chọn'
                }
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Mã Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="VD: NLP_BASE, AI_VISION, API_TRANSLATE"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost">Số Lượng Token *</Label>
                <Input
                  id="cost"
                  type="number"
                  min="1"
                  value={formData.cost}
                  onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                  placeholder="VD: 1000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Ghi Chú</Label>
                <Textarea
                  id="note"
                  value={formData.note}
                  onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                  placeholder="Mô tả chi tiết về luật token này..."
                  rows={3}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setCreateModalOpen(false)
                    setEditModalOpen(false)
                  }}
                >
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {(createMutation.isPending || updateMutation.isPending) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {formMode === 'create' ? 'Tạo Rule' : 'Cập Nhật'}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* View Modal */}
        <Dialog open={viewModalOpen} onOpenChange={(open) => {
          if (!open) {
            setViewModalOpen(false)
            setSelectedRule(null)
          }
        }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Chi Tiết Token Rule</DialogTitle>
              <DialogDescription>
                Thông tin chi tiết về cấu hình token được chọn
              </DialogDescription>
            </DialogHeader>
            
            {selectedRule && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Mã Code</Label>
                    <p className="text-lg font-semibold">{selectedRule.code}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Số Token</Label>
                    <p className="text-lg font-semibold text-blue-600">
                      {selectedRule.cost ? formatTokenCount(selectedRule.cost) : '0'} tokens
                    </p>
                  </div>
                </div>

                {selectedRule.note && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Ghi Chú</Label>
                    <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg mt-1 border border-slate-200">
                      {selectedRule.note}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-xs text-slate-500 bg-slate-50 p-3 rounded-lg">
                  <div>
                    <Label className="text-xs font-medium text-slate-600">Ngày Tạo</Label>
                    <p className="mt-1">{selectedRule.createdDate ? new Date(selectedRule.createdDate).toLocaleString('vi-VN') : 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-600">Cập Nhật</Label>
                    <p className="mt-1">{selectedRule.lastUpdated ? new Date(selectedRule.lastUpdated).toLocaleString('vi-VN') : 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button onClick={() => setViewModalOpen(false)}>Đóng</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog open={deleteDialogOpen} onOpenChange={(open) => {
          if (!open) {
            setDeleteDialogOpen(false)
            setSelectedRule(null)
          }
        }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-red-600">Xác Nhận Xóa</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn xóa token rule này? Hành động này không thể hoàn tác.
              </DialogDescription>
            </DialogHeader>
            
            {selectedRule && (
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 text-red-700">
                  <Trash2 className="h-4 w-4" />
                  <span className="font-medium">Token Rule sẽ bị xóa:</span>
                </div>
                <div className="mt-3 space-y-2 text-sm">
                  <p className="text-slate-700"><span className="font-medium">Mã:</span> {selectedRule.code}</p>
                  <p className="text-slate-700"><span className="font-medium">Số token:</span> {selectedRule.cost ? formatTokenCount(selectedRule.cost) : '0'} tokens</p>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Hủy Bỏ
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Xác Nhận Xóa
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}