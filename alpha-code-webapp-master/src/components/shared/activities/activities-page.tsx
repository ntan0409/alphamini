"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Search,
  Filter,
  Clock,
  Users,
  Play,
  BookOpen,
  Zap,
  Trophy,
  Star,
  Target,
  Activity,
  Loader2,
  Square,
  Trash2,
  Eye,
  Edit,
  MoreVertical
} from "lucide-react"
import { Pagination } from "@/components/ui/pagination"
import { PerPageSelector } from "@/components/ui/per-page-selector"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useActivities, useCreateActivity, useDeleteActivity, useUpdateActivity } from "@/features/activities/hooks/use-activities"
import { useRobotControls } from "@/features/users/hooks/use-websocket"
import { useRobotStore } from "@/hooks/use-robot-store"
import { Activity as ActivityType, ActivityData } from "@/types/activities"
import { ActionActivites } from "@/types/action"
import { getUserInfoFromToken } from "@/utils/tokenUtils"
import LoadingState from "@/components/loading-state"
import ErrorState from "@/components/error-state"
import ProtectLicense from "@/components/protect-license"

export default function ActivitiesPage() {
  const renderCount = useRef(0);
  renderCount.current += 1;

  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [activityToDelete, setActivityToDelete] = useState<ActivityType | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<ActivityType | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(12)
  const [accountId, setAccountId] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    try {
      setIsClient(true);
      if (typeof window !== 'undefined') {
        const accessToken = sessionStorage.getItem('accessToken');
        if (accessToken) {
          const userInfo = getUserInfoFromToken(accessToken);
          const id = userInfo?.id || '';
          setAccountId(id);
        }
      }
    } catch (error) {
      console.error('Error getting account ID:', error);
      setHasError(true);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setCurrentPage(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => { setCurrentPage(1) }, [filterType, filterStatus, perPage])

  const { startActivity, isLoading: isRobotLoading } = useRobotControls()
  const { selectedRobotSerial, selectedRobot, updateRobotStatus, robots } = useRobotStore()

  const { data: activitiesData, isLoading, error, refetch } = useActivities(currentPage, perPage, accountId, debouncedSearchTerm, selectedRobot?.robotModelId ?? '');
  const createActivityMutation = useCreateActivity()
  const deleteActivityMutation = useDeleteActivity()
  const updateActivityMutation = useUpdateActivity()

  const activities = useMemo(() => activitiesData?.data || [], [activitiesData?.data])
  const pagination = useMemo(() => activitiesData ? {
    total_count: activitiesData.total_count,
    page: activitiesData.page,
    per_page: activitiesData.per_page,
    total_pages: activitiesData.total_pages,
    has_next: activitiesData.has_next,
    has_previous: activitiesData.has_previous
  } : null, [activitiesData])

  const filteredActivities = useMemo(() => activities.filter(activity => {
    const matchesType = filterType === "all" || activity.type === filterType
    const matchesStatus = filterStatus === "all" || activity.status.toString() === filterStatus
    return matchesType && matchesStatus
  }), [activities, filterType, filterStatus])

  const handleStartActivity = useCallback((activity: ActivityType) => {
    const serials = Array.isArray(selectedRobotSerial) ? selectedRobotSerial : selectedRobotSerial ? [selectedRobotSerial] : [];
    if (serials.length === 0) { console.error('No robot selected to start activity'); return; }
    let activityData; try { activityData = typeof activity.data === 'string' ? JSON.parse(activity.data) : activity.data; } catch { activityData = activity.data; }
    serials.forEach((serial) => { updateRobotStatus(serial, 'busy'); startActivity(serial, activity.type, activityData); setTimeout(() => { updateRobotStatus(serial, 'online'); }, 3000); });
  }, [selectedRobotSerial, updateRobotStatus, startActivity]);

  const handleStopAllActions = useCallback(() => {
    const robotSerial = selectedRobotSerial; if (!robotSerial) { console.error('No robot selected for stopping actions'); return; }
    const serial = Array.isArray(robotSerial) ? robotSerial[0] : robotSerial; if (!serial) return;
    startActivity(serial, 'stop_all_actions', {});
  }, [selectedRobotSerial, startActivity])

  const handleDeleteClick = useCallback((activity: ActivityType) => {
    setActivityToDelete(activity)
    setIsDeleteModalOpen(true)
  }, [])

  const handleDeleteConfirm = useCallback(() => {
    if (activityToDelete) {
      deleteActivityMutation.mutate(activityToDelete.id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false)
          setActivityToDelete(null)
        }
      })
    }
  }, [activityToDelete, deleteActivityMutation])

  if (renderCount.current > 100) { return <div>Error: Too many re-renders. Please check console for details.</div>; }

  const getTypeIcon = (type: string) => {
    switch (type) { case "dance_with_music": return <Play className="w-4 h-4" />; case "lesson": return <BookOpen className="w-4 h-4" />; case "game": return <Trophy className="w-4 h-4" />; case "exercise": return <Target className="w-4 h-4" />; case "project": return <Zap className="w-4 h-4" />; default: return <Activity className="w-4 h-4" />; }
  }
  const getTypeColor = (type: string) => {
    switch (type) { case "dance_with_music": return "bg-pink-100 text-pink-800"; case "lesson": return "bg-blue-100 text-blue-800"; case "game": return "bg-purple-100 text-purple-800"; case "exercise": return "bg-green-100 text-green-800"; case "project": return "bg-orange-100 text-orange-800"; default: return "bg-gray-100 text-gray-800"; }
  }
  const getStatusColor = (status: number) => { switch (status) { case 1: return "bg-green-100 text-green-800"; case 0: return "bg-yellow-100 text-yellow-800"; case 2: return "bg-gray-100 text-gray-800"; default: return "bg-gray-100 text-gray-800"; } }
  const getStatusText = (status: number) => { switch (status) { case 1: return "Đã xuất bản"; case 0: return "Bản nháp"; case 2: return "Đã lưu trữ"; default: return "Không xác định"; } }
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("vi-VN", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })

  const CreateActivityForm = () => {
    const [formData, setFormData] = useState({ name: "", type: "", data: "", status: 1, statusText: "ACTIVE", accountId: accountId || "", robotModelId: selectedRobot?.robotModelId ?? "" })
    useEffect(() => { setFormData(prev => ({ ...prev, accountId: accountId || "", robotModelId: selectedRobot?.robotModelId ?? "" })) }, [accountId, selectedRobot?.robotModelId])
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      let activityData: ActivityData; try { activityData = JSON.parse(formData.data || '{}'); } catch { activityData = { content: formData.data }; }
      const submitData = { ...formData, data: activityData };
      createActivityMutation.mutate(submitData, { onSuccess: () => { setIsCreateModalOpen(false); setFormData({ name: "", type: "", data: "", status: 1, statusText: "ACTIVE", accountId: accountId || "", robotModelId: selectedRobot?.robotModelId ?? "" }); } })
    }
    if (!isClient) { return (<div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 p-6 flex items-center justify-center"><LoadingState /></div>); }
    if (hasError) { return (<div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 p-6 flex items-center justify-center"><ErrorState error={error} onRetry={refetch} /></div>); }
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">Tên hoạt động</label>
          <Input placeholder="Nhập tên hoạt động..." value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Loại hoạt động</label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger><SelectValue placeholder="Chọn loại" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dance_with_music">Nhảy với nhạc</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">Dữ liệu hoạt động</label>
          <Textarea placeholder="Nhập dữ liệu JSON hoặc text cho hoạt động..." rows={3} value={formData.data} onChange={(e) => setFormData({ ...formData, data: e.target.value })} required />
        </div>
        <div className="flex gap-2 pt-4">
          <Button type="submit" className="flex-1" disabled={createActivityMutation.isPending}>{createActivityMutation.isPending ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Đang tạo...</>) : (<><Plus className="w-4 h-4 mr-2" />Tạo hoạt động</>)}</Button>
          <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Hủy</Button>
        </div>
      </form>
    )
  }

  return (
    <ProtectLicense>
      <div className="min-h-screen bg-white relative overflow-hidden p-5">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px),linear-gradient(to bottom, #000 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
        <div className="absolute inset-0 pointer-events-none overflow-hidden"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="text-center mb-8 md:mb-16">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white backdrop-blur-sm border border-gray-200 text-gray-700 rounded-2xl text-sm font-semibold mb-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center"><Activity className="w-5 h-5 text-white" /></div>
              Hành động của Alpha Mini
              <Star className="w-5 h-5 text-gray-600" />
            </div>
            <div className="space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-4 md:mb-6 tracking-tight">Học tập<span className="block text-gray-700 py-1 text-base md:text-lg">Trung tâm hoạt động</span></h1>
              <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">Tạo và quản lý các hoạt động học tập tương tác với robot Alpha Mini</p>
              <div className="flex flex-wrap justify-center gap-6 mt-8">
                <div className="flex items-center gap-2 text-gray-600"><div className="w-2 h-2 bg-blue-500 rounded-full"></div><span className="text-sm font-medium">Bài học tương tác</span></div>
                <div className="flex items-center gap-2 text-gray-600"><div className="w-2 h-2 bg-purple-500 rounded-full"></div><span className="text-sm font-medium">Trò chơi giáo dục</span></div>
                <div className="flex items-center gap-2 text-gray-600"><div className="w-2 h-2 bg-green-500 rounded-full"></div><span className="text-sm font-medium">Theo dõi tiến độ</span></div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input placeholder="Tìm kiếm hoạt động..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-10" />
              {searchTerm !== debouncedSearchTerm && (<Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 animate-spin" />)}
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <PerPageSelector perPage={perPage} onPerPageChange={setPerPage} options={[6, 12, 24, 48]} />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-40"><Filter className="w-4 h-4 mr-2" /><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  <SelectItem value="dance_with_music">Nhảy với nhạc</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="1">Đã xuất bản</SelectItem>
                  <SelectItem value="0">Bản nháp</SelectItem>
                  <SelectItem value="2">Đã lưu trữ</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Tạo mới</Button></DialogTrigger>
                <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Tạo hoạt động mới</DialogTitle></DialogHeader><CreateActivityForm /></DialogContent>
              </Dialog>
              <Button variant="destructive" onClick={handleStopAllActions} disabled={!selectedRobotSerial || isRobotLoading} className="flex-shrink-0"><Square className="w-4 h-4 mr-2" />Dừng tất cả</Button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{[...Array(6)].map((_, index) => (<Card key={index} className="animate-pulse"><CardHeader><div className="h-4 bg-gray-300 rounded w-3/4"></div><div className="h-6 bg-gray-300 rounded w-full"></div></CardHeader><CardContent><div className="space-y-3"><div className="h-4 bg-gray-300 rounded w-full"></div><div className="h-4 bg-gray-300 rounded w-2/3"></div><div className="flex gap-2"><div className="h-6 bg-gray-300 rounded w-16"></div><div className="h-6 bg-gray-300 rounded w-20"></div></div></div></CardContent></Card>))}</div>
          ) : error && !(error && typeof error === 'object' && (('name' in error && error.name === 'CanceledError') || ('code' in error && error.code === 'ERR_CANCELED'))) ? (
            <div className="text-center py-16"><div className="text-red-500 mb-4"><Activity className="w-16 h-16 mx-auto mb-4" /><h3 className="text-lg font-semibold mb-2">Lỗi khi tải dữ liệu</h3><p className="text-gray-600">{error && typeof error === 'object' && 'message' in error ? (error as { message: string }).message : 'Đã xảy ra lỗi khi tải dữ liệu'}</p><Button onClick={() => window.location.reload()} variant="outline" className="mt-4">Thử lại</Button></div></div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-16"><Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" /><h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy hoạt động</h3><p className="text-gray-600 mb-6">Thử thay đổi bộ lọc hoặc tạo hoạt động mới</p><Button onClick={() => setIsCreateModalOpen(true)}><Plus className="w-4 h-4 mr-2" />Tạo hoạt động đầu tiên</Button></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredActivities.map((activity) => (
                  <Card key={activity.id} className="group hover:shadow-lg transition-all duration-200 border-0 shadow-md h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">{getTypeIcon(activity.type)}<Badge variant="secondary" className={getTypeColor(activity.type)}>{activity.type === "dance_with_music" ? "Nhảy với nhạc" : activity.type}</Badge></div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedActivity(activity)
                            setIsViewModalOpen(true)
                          }}>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedActivity(activity)
                            setIsEditModalOpen(true)
                          }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardTitle className="text-xl line-clamp-2">{activity.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {activity.type === "dance_with_music" && activity.data && activity.data.activity ? (
                      <div className="space-y-3">
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 bg-green-500 rounded-full"></div><span className="font-medium">Hoạt động nhảy múa</span></div>
                          {activity.data.activity.actions && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                              <div><span className="text-xs text-gray-500">Số hành động:</span><p className="font-semibold text-lg text-blue-600">{activity.data.activity.actions.length}</p></div>
                              <div><span className="text-xs text-gray-500">Thời lượng:</span><p className="font-semibold text-lg text-green-600">{activity.data.music_info?.duration || Math.max(...activity.data.activity.actions.map((a: ActionActivites) => a.start_time + a.duration)).toFixed(1)}s</p></div>
                            </div>
                          )}
                          {activity.data.music_info?.name && (<div className="flex items-center gap-2 mt-2 text-sm text-purple-600 bg-purple-50 p-2 rounded"><span>🎵</span><span className="font-medium">{activity.data.music_info.name}</span></div>)}
                        </div>
                      </div>
                    ) : (<p className="text-gray-600 text-sm line-clamp-3">Hoạt động Alpha Mini - {activity.type}</p>)}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">{activity.type === "dance_with_music" ? "Nhảy với nhạc" : activity.type}</Badge>
                      <Badge variant="outline" className={getStatusColor(activity.status)}>{getStatusText(activity.status)}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1"><Clock className="w-4 h-4" />{activity.type === "dance_with_music" && activity.data?.music_info?.duration ? `${activity.data.music_info.duration}s` : "30 phút"}</div>
                        <div className="flex items-center gap-1"><Activity className="w-4 h-4" />{activity.type === "dance_with_music" && activity.data?.activity?.actions?.length ? `${activity.data.activity.actions.length} hành động` : "Hoạt động"}</div>
                      </div>
                      <div className="text-xs text-gray-400">{formatDate(activity.createdDate)}</div>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-4">
                      <Button size="sm" className="flex-1 min-w-[120px]" onClick={() => handleStartActivity(activity)} disabled={isRobotLoading || !selectedRobotSerial}>{isRobotLoading ? (<Loader2 className="w-4 h-4 mr-1 animate-spin" />) : (<Play className="w-4 h-4 mr-1" />)}Bắt đầu</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteClick(activity)} className="flex-shrink-0"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                    {activity.lastUpdated && activity.lastUpdated !== activity.createdDate && (
                      <div className="text-xs text-gray-400 border-t pt-3 mt-3">
                        Cập nhật: {formatDate(activity.lastUpdated)}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {pagination && !isLoading && activities.length > 0 && (
            <div className="mt-8">
              <Pagination currentPage={currentPage} totalPages={pagination.total_pages} onPageChange={setCurrentPage} hasNext={pagination.has_next} hasPrevious={pagination.has_previous} totalCount={pagination.total_count} perPage={pagination.per_page} className="border-t pt-8" />
              {(filterType !== "all" || filterStatus !== "all") && (<p className="text-sm text-gray-500 text-center mt-4">Hiển thị {filteredActivities.length} / {activities.length} kết quả (đã lọc)</p>)}
            </div>
          )}

          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="text-center border-0 shadow-md"><CardContent className="p-6"><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"><BookOpen className="w-6 h-6 text-blue-600" /></div><h3 className="text-2xl font-bold text-gray-900">{activities.filter(a => a.type === "lesson").length}</h3><p className="text-gray-600">Bài học</p></CardContent></Card>
            <Card className="text-center border-0 shadow-md"><CardContent className="p-6"><div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"><Trophy className="w-6 h-6 text-purple-600" /></div><h3 className="text-2xl font-bold text-gray-900">{activities.filter(a => a.type === "game").length}</h3><p className="text-gray-600">Trò chơi</p></CardContent></Card>
            <Card className="text-center border-0 shadow-md"><CardContent className="p-6"><div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><Users className="w-6 h-6 text-green-600" /></div><h3 className="text-2xl font-bold text-gray-900">{activities.length}</h3><p className="text-gray-600">Hoạt động</p></CardContent></Card>
            <Card className="text-center border-0 shadow-md"><CardContent className="p-6"><div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4"><Clock className="w-6 h-6 text-orange-600" /></div><h3 className="text-2xl font-bold text-gray-900">{pagination?.total_count || 0}</h3><p className="text-gray-600">Tổng số</p></CardContent></Card>
          </div>
        </div>

        {/* View Activity Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chi tiết hoạt động</DialogTitle>
            </DialogHeader>
            {selectedActivity && (
              <div className="space-y-6 pt-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Tên hoạt động</label>
                  <p className="text-gray-900 text-lg">{selectedActivity.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Loại hoạt động</label>
                    <Badge variant="secondary" className={getTypeColor(selectedActivity.type)}>
                      {selectedActivity.type === "dance_with_music" ? "Nhảy với nhạc" : selectedActivity.type}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Trạng thái</label>
                    <Badge variant="outline" className={getStatusColor(selectedActivity.status)}>
                      {getStatusText(selectedActivity.status)}
                    </Badge>
                  </div>
                </div>
                {selectedActivity.type === "dance_with_music" && selectedActivity.data && selectedActivity.data.activity && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-2">Thông tin nhạc</label>
                      {selectedActivity.data.music_info?.name && (
                        <div className="flex items-center gap-2 text-purple-600 bg-purple-50 p-3 rounded-lg">
                          <span>🎵</span>
                          <span className="font-medium">{selectedActivity.data.music_info.name}</span>
                          {selectedActivity.data.music_info.duration && (
                            <span className="text-sm">- {selectedActivity.data.music_info.duration}s</span>
                          )}
                        </div>
                      )}
                    </div>
                    {selectedActivity.data.activity.actions && (
                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-2">Hành động ({selectedActivity.data.activity.actions.length})</label>
                        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                          <div>
                            <span className="text-xs text-gray-500">Số hành động:</span>
                            <p className="font-semibold text-2xl text-blue-600">{selectedActivity.data.activity.actions.length}</p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">Thời lượng:</span>
                            <p className="font-semibold text-2xl text-green-600">
                              {selectedActivity.data.music_info?.duration || 
                                Math.max(...selectedActivity.data.activity.actions.map((a: ActionActivites) => a.start_time + a.duration)).toFixed(1)}s
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Ngày tạo</label>
                  <p className="text-gray-600">{formatDate(selectedActivity.createdDate)}</p>
                </div>
                {selectedActivity.lastUpdated && (
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Cập nhật lần cuối</label>
                    <p className="text-gray-600">{formatDate(selectedActivity.lastUpdated)}</p>
                  </div>
                )}
                <div className="flex justify-end pt-4">
                  <Button onClick={() => setIsViewModalOpen(false)} variant="outline">
                    Đóng
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Activity Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa hoạt động</DialogTitle>
            </DialogHeader>
            {selectedActivity && (
              <div className="space-y-6 pt-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Tên hoạt động</label>
                  <Input 
                    value={selectedActivity.name} 
                    onChange={(e) => setSelectedActivity({...selectedActivity, name: e.target.value})} 
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Loại hoạt động</label>
                    <Badge variant="secondary" className={getTypeColor(selectedActivity.type)}>
                      {selectedActivity.type === "dance_with_music" ? "Nhảy với nhạc" : selectedActivity.type}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Trạng thái</label>
                    <Badge variant="outline" className={getStatusColor(selectedActivity.status)}>
                      {getStatusText(selectedActivity.status)}
                    </Badge>
                  </div>
                </div>
                {selectedActivity.type === "dance_with_music" && selectedActivity.data && selectedActivity.data.activity && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-2">Thông tin nhạc</label>
                      {selectedActivity.data.music_info?.name && (
                        <div className="flex items-center gap-2 text-purple-600 bg-purple-50 p-3 rounded-lg">
                          <span>🎵</span>
                          <span className="font-medium">{selectedActivity.data.music_info.name}</span>
                          {selectedActivity.data.music_info.duration && (
                            <span className="text-sm">- {selectedActivity.data.music_info.duration}s</span>
                          )}
                        </div>
                      )}
                    </div>
                    {selectedActivity.data.activity.actions && (
                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-2">Hành động ({selectedActivity.data.activity.actions.length})</label>
                        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                          <div>
                            <span className="text-xs text-gray-500">Số hành động:</span>
                            <p className="font-semibold text-2xl text-blue-600">{selectedActivity.data.activity.actions.length}</p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">Thời lượng:</span>
                            <p className="font-semibold text-2xl text-green-600">
                              {selectedActivity.data.music_info?.duration || 
                                Math.max(...selectedActivity.data.activity.actions.map((a: ActionActivites) => a.start_time + a.duration)).toFixed(1)}s
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Ngày tạo</label>
                  <p className="text-gray-600">{formatDate(selectedActivity.createdDate)}</p>
                </div>
                {selectedActivity.lastUpdated && (
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Cập nhật lần cuối</label>
                    <p className="text-gray-600">{formatDate(selectedActivity.lastUpdated)}</p>
                  </div>
                )}
                <div className="flex gap-2 pt-4">
                  <Button onClick={() => {
                    if (selectedActivity) {
                      updateActivityMutation.mutate(
                        { id: selectedActivity.id, data: { name: selectedActivity.name } },
                        {
                          onSuccess: () => {
                            setIsEditModalOpen(false)
                            setSelectedActivity(null)
                          }
                        }
                      )
                    }
                  }} className="flex-1" disabled={updateActivityMutation.isPending}>
                    {updateActivityMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang cập nhật...
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Cập nhật
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditModalOpen(false)}
                    disabled={updateActivityMutation.isPending}
                  >
                    Hủy
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Xác nhận xóa hoạt động</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <p className="text-gray-600">
                Bạn có chắc chắn muốn xóa hoạt động <span className="font-semibold text-gray-900">&quot;{activityToDelete?.name}&quot;</span> không?
              </p>
              <p className="text-sm text-red-600">
                Hành động này không thể hoàn tác.
              </p>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => {
                    setIsDeleteModalOpen(false)
                    setActivityToDelete(null)
                  }}
                  variant="outline"
                  className="flex-1"
                  disabled={deleteActivityMutation.isPending}
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleDeleteConfirm}
                  variant="destructive"
                  className="flex-1"
                  disabled={deleteActivityMutation.isPending}
                >
                  {deleteActivityMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang xóa...
                    </>
                  ) : (
                    'Xóa'
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectLicense>
  )
}
