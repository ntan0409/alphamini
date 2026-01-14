"use client"

import React, { useEffect, useState } from 'react'
import { useEsp32 } from '@/features/esp32/hooks'
import { Esp32Device } from '@/types/esp32'
import { getUserIdFromToken } from '@/utils/tokenUtils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  HomeIcon, 
  Wifi, 
  Plus, 
  Edit, 
  Trash2, 
  Lightbulb, 
  ThermometerSun,
  Fan,
  Power,
  Settings,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Activity,
  Zap,
  Signal
} from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import LoadingState from '@/components/loading-state'

export default function ParentSmartHomePage() {
  const { useGetEsp32ByAccountId, useCreateEsp32, useUpdateEsp32, useDeleteEsp32, useAddEsp32Device, useRemoveEsp32Device, useUpdateEsp32Device, useSendEsp32Message } = useEsp32()
  const [accountId, setAccountId] = useState<string>('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('accessToken')
      if (token) {
        const id = getUserIdFromToken(token)
        if (id) setAccountId(id)
      }
    }
  }, [])

  // Each account has a single ESP32 — use the account lookup
  const { data: esp, isLoading, isError, error, refetch } = useGetEsp32ByAccountId(accountId)

  // Local UI state for create/edit
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({ name: '', macAddress: '', firmwareVersion: 1, topicPub: '', topicSub: '' })

  // Device form
  const [deviceForm, setDeviceForm] = useState({ name: '', type: '' })
  const [editingDevice, setEditingDevice] = useState<{ name: string; type: string; id?: string } | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showDeviceDialog, setShowDeviceDialog] = useState(false)
  const [deviceStates, setDeviceStates] = useState<Record<string, boolean>>({})
  const [expandedDevice, setExpandedDevice] = useState<string | null>(null)

  // Device type icons
  const getDeviceIcon = (type: string) => {
    const typeUpper = type.toUpperCase()
    if (typeUpper.includes('LED') || typeUpper.includes('LIGHT')) return Lightbulb
    if (typeUpper.includes('FAN') || typeUpper.includes('VENTILADOR')) return Fan
    if (typeUpper.includes('TEMP') || typeUpper.includes('SENSOR')) return ThermometerSun
    return Power
  }

  // Mutations
  const createEspMut = useCreateEsp32()
  const updateEspMut = useUpdateEsp32()
  const deleteEspMut = useDeleteEsp32()
  const addDeviceMut = useAddEsp32Device()
  const removeDeviceMut = useRemoveEsp32Device()
  const updateDeviceMut = useUpdateEsp32Device()
  const sendMessageMut = useSendEsp32Message()

  useEffect(() => {
    if (esp) {
      setForm({
        name: esp.name || '',
        macAddress: esp.macAddress || '',
        firmwareVersion: esp.firmwareVersion || 1,
        topicPub: esp.topicPub || '',
        topicSub: esp.topicSub || '',
      })
    }
  }, [esp])

  // Normalize devices from esp.metadata which may be a JSON string or object
  const devices = React.useMemo((): Esp32Device[] => {
    if (!esp || !esp.metadata) return []
    try {
      if (typeof esp.metadata === 'string') {
        const parsed = JSON.parse(esp.metadata)
        return Array.isArray(parsed?.devices) ? (parsed.devices as Esp32Device[]) : []
      }
      // if metadata is already an object with devices
      const metaObj = esp.metadata as unknown as { devices?: unknown }
      return Array.isArray(metaObj?.devices) ? (metaObj.devices as Esp32Device[]) : []
    } catch (e) {
      return []
    }
  }, [esp])

  const handleChange = (field: keyof typeof form, value: string | number) => setForm(prev => ({ ...prev, [field]: value }))

  const handleDeviceChange = (field: keyof typeof deviceForm, value: string) => setDeviceForm(prev => ({ ...prev, [field]: value }))

  const handleCreate = async () => {
    try {
      const data = { accountId, name: form.name, macAddress: form.macAddress, firmwareVersion: form.firmwareVersion, topicPub: form.topicPub, topicSub: form.topicSub }
      await createEspMut.mutateAsync(data)
      refetch()
    } catch (e) {
      console.error(e)
    }
  }

  const handleUpdate = async () => {
    if (!esp?.id) return
    try {
      await updateEspMut.mutateAsync({ id: esp.id, data: form })
      setIsEditing(false)
      refetch()
    } catch (e) {
      console.error(e)
    }
  }

  const handleDelete = async () => {
    if (!esp?.id) return
    if (!confirm('Xác nhận xóa ESP32 này?')) return
    try {
      await deleteEspMut.mutateAsync(esp.id)
      refetch()
    } catch (e) {
      console.error(e)
    }
  }

  const handleAddDevice = async () => {
    if (!esp?.id) return
    try {
      await addDeviceMut.mutateAsync({ id: esp.id, name: deviceForm.name, type: deviceForm.type })
      setDeviceForm({ name: '', type: '' })
      setShowDeviceDialog(false)
      refetch()
    } catch (e) {
      console.error(e)
    }
  }

  const handleRemoveDevice = async (name: string) => {
    if (!esp?.id) return
    if (!confirm(`Xác nhận xoá thiết bị ${name}?`)) return
    try {
      await removeDeviceMut.mutateAsync({ id: esp.id, name })
      refetch()
    } catch (e) {
      console.error(e)
    }
  }

  const handleEditDevice = (device: { name: string; type: string; id?: string }) => {
    setDeviceForm({ name: device.name, type: device.type })
    setEditingDevice(device)
    setShowDeviceDialog(true)
  }

  const handleSaveDevice = async () => {
    if (!esp?.id || !editingDevice) return
    try {
      await updateDeviceMut.mutateAsync({ 
        id: esp.id, 
        name: editingDevice.name, 
        newType: deviceForm.type 
      })
      setEditingDevice(null)
      setDeviceForm({ name: '', type: '' })
      setShowDeviceDialog(false)
      refetch()
    } catch (e) {
      console.error(e)
    }
  }

  const handleToggleDevice = async (deviceName: string, currentState: boolean) => {
    if (!esp?.id) return
    const newState = !currentState
    const message = newState ? 'on' : 'off'
    
    try {
      await sendMessageMut.mutateAsync({
        id: esp.id,
        name: deviceName,
        message: message,
        language: 'en'
      })
      setDeviceStates(prev => ({ ...prev, [deviceName]: newState }))
      toast.success(`Đã ${newState ? 'bật' : 'tắt'} thiết bị ${deviceName}`)
    } catch (e) {
      console.error(e)
      toast.error(`Không thể ${newState ? 'bật' : 'tắt'} thiết bị`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-primary to-primary/60 rounded-xl shadow-lg">
              <HomeIcon className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-foreground" style={{ fontWeight: 900 }}>Smart Home</h1>
              <p className="text-sm text-muted-foreground mt-1">Điều khiển và giám sát thiết bị thông minh</p>
            </div>
          </div>
          {esp && (
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Đang kết nối</span>
            </div>
          )}
        </div>

      {/* Content */}
      {isLoading ? (
        <LoadingState message="Đang tải thiết bị..." />
      ) : isError ? (
        (() => {
          const e = error as unknown
          const is404 = e && typeof e === 'object' && 'response' in e && 
                       (e as { response?: { status?: number } })?.response?.status === 404
          
          if (is404) {
            // Show create form for 404 (no ESP32 found)
            return (
              <Card className="border-dashed">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Wifi className="h-5 w-5 text-muted-foreground" />
                    <CardTitle>Tạo ESP32 mới</CardTitle>
                  </div>
                  <CardDescription>
                    Chưa có thiết bị ESP32 nào. Tạo thiết bị đầu tiên của bạn để bắt đầu.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="esp-name">Tên thiết bị</Label>
                    <Input 
                      id="esp-name"
                      placeholder="ESP32 - Living Room" 
                      value={form.name} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('name', e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="esp-mac">Địa chỉ MAC</Label>
                    <Input 
                      id="esp-mac"
                      placeholder="AA:BB:CC:DD:EE:FF" 
                      value={form.macAddress} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('macAddress', e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="esp-firmware">Phiên bản Firmware</Label>
                    <Input 
                      id="esp-firmware"
                      type="number" 
                      placeholder="1" 
                      value={form.firmwareVersion} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('firmwareVersion', Number(e.target.value))} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="esp-pub">Topic Pub</Label>
                    <Input 
                      id="esp-pub"
                      placeholder="esp32/pub" 
                      value={form.topicPub} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('topicPub', e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="esp-sub">Topic Sub</Label>
                    <Input 
                      id="esp-sub"
                      placeholder="esp32/sub" 
                      value={form.topicSub} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('topicSub', e.target.value)} 
                    />
                  </div>
                </CardContent>
                <CardContent className="flex gap-2 pt-0">
                  <Button onClick={handleCreate} disabled={createEspMut.isPending}>
                    {createEspMut.isPending ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Đang tạo...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Tạo ESP32
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => setForm({ name: '', macAddress: '', firmwareVersion: 1, topicPub: '', topicSub: '' })}
                  >
                    Đặt lại
                  </Button>
                </CardContent>
              </Card>
            )
          }
          
          // Show error for other errors
          return (
            <Card className="border-dashed">
              <CardContent className="p-12 flex flex-col items-center justify-center">
                <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                <p className="text-lg font-semibold mb-2">Không thể tải thiết bị</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {e && typeof e === 'object' && 'message' in e 
                    ? String((e as { message?: unknown }).message)
                    : 'Đã xảy ra lỗi không xác định'}
                </p>
                <Button onClick={() => refetch()} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Thử lại
                </Button>
              </CardContent>
            </Card>
          )
        })()
      ) : !esp ? (
        /* Create ESP32 Dialog */
        <Card className="border-dashed">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Wifi className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Tạo ESP32 mới</CardTitle>
            </div>
            <CardDescription>
              Chưa có thiết bị ESP32 nào. Tạo thiết bị đầu tiên của bạn để bắt đầu.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="esp-name">Tên thiết bị</Label>
              <Input 
                id="esp-name"
                placeholder="ESP32 - Living Room" 
                value={form.name} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('name', e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="esp-mac">Địa chỉ MAC</Label>
              <Input 
                id="esp-mac"
                placeholder="AA:BB:CC:DD:EE:FF" 
                value={form.macAddress} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('macAddress', e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="esp-firmware">Phiên bản Firmware</Label>
              <Input 
                id="esp-firmware"
                type="number" 
                placeholder="1" 
                value={form.firmwareVersion} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('firmwareVersion', Number(e.target.value))} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="esp-pub">Topic Pub</Label>
              <Input 
                id="esp-pub"
                placeholder="esp32/pub" 
                value={form.topicPub} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('topicPub', e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="esp-sub">Topic Sub</Label>
              <Input 
                id="esp-sub"
                placeholder="esp32/sub" 
                value={form.topicSub} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('topicSub', e.target.value)} 
              />
            </div>
          </CardContent>
          <CardContent className="flex gap-2 pt-0">
            <Button onClick={handleCreate} disabled={createEspMut.isPending}>
              {createEspMut.isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo ESP32
                </>
              )}
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setForm({ name: '', macAddress: '', firmwareVersion: 1, topicPub: '', topicSub: '' })}
            >
              Đặt lại
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - ESP32 Info & Stats */}
          <div className="lg:col-span-4 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-l-4 border-l-primary shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Tổng thiết bị</p>
                      <p className="text-2xl font-bold mt-1">{devices.length}</p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Activity className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-green-500 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Đang bật</p>
                      <p className="text-2xl font-bold mt-1 text-green-600">{Object.values(deviceStates).filter(Boolean).length}</p>
                    </div>
                    <div className="p-3 bg-green-500/10 rounded-lg">
                      <Zap className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ESP32 Info Card */}
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
                    <Wifi className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{esp.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1.5">
                      <Signal className="h-3 w-3" />
                      <span className="text-xs">{esp.macAddress}</span>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    <Power className="h-3 w-3 mr-1" />
                    Firmware v{esp.firmwareVersion}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    <Activity className="h-3 w-3 mr-1" />
                    ESP32
                  </Badge>
                </div>
                <Separator className="mt-4" />
                <div className="flex items-center justify-between mt-4">
                <div className="flex gap-2">
                  <Button 
                    variant={isEditing ? "outline" : "default"} 
                    size="sm"
                    onClick={() => setIsEditing(v => !v)}
                  >
                    {isEditing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Hủy
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={handleDelete} 
                    disabled={deleteEspMut.isPending}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa
                  </Button>
                </div>
              </div>
            </CardHeader>

            {isEditing && (
              <CardContent className="space-y-4 border-t pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Tên thiết bị</Label>
                    <Input 
                      id="edit-name"
                      value={form.name} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('name', e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-mac">Địa chỉ MAC</Label>
                    <Input 
                      id="edit-mac"
                      value={form.macAddress} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('macAddress', e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-firmware">Phiên bản Firmware</Label>
                    <Input 
                      id="edit-firmware"
                      type="number" 
                      value={form.firmwareVersion} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('firmwareVersion', Number(e.target.value))} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-pub">Topic Pub</Label>
                    <Input 
                      id="edit-pub"
                      value={form.topicPub} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('topicPub', e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="edit-sub">Topic Sub</Label>
                    <Input 
                      id="edit-sub"
                      value={form.topicSub} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('topicSub', e.target.value)} 
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleUpdate} disabled={updateEspMut.isPending}>
                    {updateEspMut.isPending ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Lưu thay đổi
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => { 
                      setIsEditing(false)
                      setForm({ 
                        name: esp.name, 
                        macAddress: esp.macAddress, 
                        firmwareVersion: esp.firmwareVersion, 
                        topicPub: esp.topicPub, 
                        topicSub: esp.topicSub 
                      })
                    }}
                  >
                    Hủy
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
          </div>

          {/* Main Content - Devices Grid */}
          <div className="lg:col-span-8 space-y-6">
          <Card className="shadow-lg">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Settings className="h-6 w-6 text-primary" />
                    Thiết bị thông minh
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {devices.length === 0 ? 'Chưa có thiết bị nào' : `Quản lý ${devices.length} thiết bị đã kết nối`}
                  </CardDescription>
                </div>
                <Button 
                  onClick={() => {
                    setEditingDevice(null)
                    setDeviceForm({ name: '', type: '' })
                    setShowDeviceDialog(true)
                  }}
                  size="lg"
                  className="shadow-md"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm thiết bị
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {devices.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Settings className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Chưa có thiết bị nào được thêm</p>
                  <p className="text-sm mt-1">Nhấn &quot;Thêm thiết bị&quot; để bắt đầu</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {devices.map((device: Esp32Device) => {
                    const DeviceIcon = getDeviceIcon(device.type)
                    const isOn = deviceStates[device.name] || false
                    return (
                      <Card 
                        key={device.name} 
                        className={`overflow-hidden transition-all duration-300 hover:shadow-xl border-2 ${
                          isOn ? 'border-primary/50 bg-primary/5' : 'border-transparent'
                        }`}
                      >
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`p-3 rounded-xl transition-all ${
                                isOn 
                                  ? 'bg-gradient-to-br from-primary to-primary/60 shadow-lg' 
                                  : 'bg-muted'
                              }`}>
                                <DeviceIcon className={`h-6 w-6 ${
                                  isOn ? 'text-primary-foreground' : 'text-muted-foreground'
                                }`} />
                              </div>
                              <div>
                                <h3 className="font-semibold text-base mb-1">{device.name}</h3>
                                <Badge 
                                  variant={isOn ? "default" : "secondary"} 
                                  className="text-xs"
                                >
                                  {device.type}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 hover:bg-primary/10"
                                onClick={() => handleEditDevice(device)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                onClick={() => handleRemoveDevice(device.name)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <Separator className="my-4" />
                          
                          {/* Main Control */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Power className={`h-4 w-4 ${
                                  isOn ? 'text-green-500' : 'text-muted-foreground'
                                }`} />
                                <span className="text-sm font-medium">Nguồn điện</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <Button
                                  size="sm"
                                  variant={isOn ? "default" : "outline"}
                                  onClick={() => handleToggleDevice(device.name, isOn)}
                                  disabled={sendMessageMut.isPending}
                                  className={isOn ? "bg-green-500 hover:bg-green-600" : ""}
                                >
                                  <Power className="h-4 w-4 mr-2" />
                                  {isOn ? 'Tắt' : 'Bật'}
                                </Button>
                              </div>
                            </div>
                            
                            {/* Status Indicator */}
                            {isOn && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span>Thiết bị đang hoạt động</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
          </div>
        </div>
      )}
      </div>

      {/* Device Dialog */}
      <Dialog open={showDeviceDialog} onOpenChange={setShowDeviceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingDevice ? 'Chỉnh sửa thiết bị' : 'Thêm thiết bị mới'}
            </DialogTitle>
            <DialogDescription>
              {editingDevice 
                ? 'Cập nhật thông tin thiết bị của bạn' 
                : 'Thêm một thiết bị thông minh mới vào ESP32'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="device-name">Tên thiết bị</Label>
              <Input 
                id="device-name"
                placeholder="Đèn phòng khách" 
                value={deviceForm.name} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDeviceChange('name', e.target.value)}
                disabled={!!editingDevice}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="device-type">Loại thiết bị</Label>
              <Select 
                value={deviceForm.type} 
                onValueChange={(value) => handleDeviceChange('type', value)}
              >
                <SelectTrigger id="device-type">
                  <SelectValue placeholder="Chọn loại thiết bị" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LED">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      <span>Đèn LED</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="FAN">
                    <div className="flex items-center gap-2">
                      <Fan className="h-4 w-4" />
                      <span>Quạt</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="TEMP_SENSOR">
                    <div className="flex items-center gap-2">
                      <ThermometerSun className="h-4 w-4" />
                      <span>Cảm biến nhiệt độ</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="OTHER">
                    <div className="flex items-center gap-2">
                      <Power className="h-4 w-4" />
                      <span>Khác</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowDeviceDialog(false)
                setEditingDevice(null)
                setDeviceForm({ name: '', type: '' })
              }}
            >
              Hủy
            </Button>
            <Button 
              onClick={editingDevice ? handleSaveDevice : handleAddDevice}
              disabled={!deviceForm.name || !deviceForm.type || addDeviceMut.isPending || updateDeviceMut.isPending}
            >
              {(addDeviceMut.isPending || updateDeviceMut.isPending) ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : editingDevice ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Cập nhật
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}