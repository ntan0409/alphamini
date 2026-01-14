"use client"

import React, { useEffect, useState } from 'react'
import { useEsp32 } from '@/features/esp32/hooks'
import { Esp32Device } from '@/types/esp32'
import { getUserIdFromToken } from '@/utils/tokenUtils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import LoadingState from '@/components/loading-state'
import { 
  HomeIcon, 
  Wifi, 
  Lightbulb, 
  ThermometerSun, 
  Fan, 
  Power, 
  RefreshCw, 
  AlertCircle,
  Activity,
  Zap,
  Signal
} from 'lucide-react'

export default function ChildrenSmartHomePage() {
  const { useGetEsp32ByAccountId, useSendEsp32Message } = useEsp32()
  const [accountId, setAccountId] = useState<string>('')
  const [deviceStates, setDeviceStates] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('accessToken')
      if (token) {
        const id = getUserIdFromToken(token)
        if (id) setAccountId(id)
      }
    }
  }, [])

  const { data: esp, isLoading, isError, error, refetch } = useGetEsp32ByAccountId(accountId)
  const sendMessageMut = useSendEsp32Message()

  // Extract devices from ESP32 metadata
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

  // Device type icons
  const getDeviceIcon = (type: string) => {
    const typeUpper = type.toUpperCase()
    if (typeUpper.includes('LED') || typeUpper.includes('LIGHT')) return Lightbulb
    if (typeUpper.includes('FAN')) return Fan
    if (typeUpper.includes('TEMP') || typeUpper.includes('SENSOR')) return ThermometerSun
    return Power
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="container max-w-6xl mx-auto p-4 md:p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <div className="p-4 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-3xl shadow-2xl transform hover:scale-110 transition-transform">
              <HomeIcon className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              🏠 Nhà Thông Minh
            </h1>
          </div>
          <p className="text-xl text-gray-700 font-semibold">✨ Điều khiển thiết bị của bạn ✨</p>
          {esp && (
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-400 rounded-full shadow-lg">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              <span className="text-base font-bold text-white">🟢 Đang kết nối</span>
            </div>
          )}
        </div>

      {/* Content */}
      {isLoading ? (
        <Card className="bg-white/80 backdrop-blur-sm border-4 border-blue-300 rounded-3xl shadow-2xl">
          <CardContent className="p-16 flex flex-col items-center justify-center">
            <div className="text-6xl mb-4 animate-bounce">⏳</div>
            <p className="text-2xl font-bold text-gray-700">Đang tải...</p>
          </CardContent>
        </Card>
      ) : isError ? (
        (() => {
          const e = error as unknown
          const is404 = e && typeof e === 'object' && 'response' in e && 
                       (e as { response?: { status?: number } })?.response?.status === 404
          
          if (is404) {
            return (
              <Card className="bg-white/80 backdrop-blur-sm border-4 border-yellow-300 rounded-3xl shadow-2xl">
                <CardContent className="p-16 flex flex-col items-center justify-center text-center">
                  <div className="text-6xl mb-6">🏠</div>
                  <p className="text-3xl font-bold text-gray-700 mb-3">Chưa có thiết bị nào</p>
                  <p className="text-xl text-gray-600">
                    Hãy nhờ ba mẹ thiết lập thiết bị nhé! 😊
                  </p>
                </CardContent>
              </Card>
            )
          }
          
          return (
            <Card className="bg-white/80 backdrop-blur-sm border-4 border-red-300 rounded-3xl shadow-2xl">
              <CardContent className="p-16 flex flex-col items-center justify-center text-center">
                <div className="text-6xl mb-6">😕</div>
                <p className="text-3xl font-bold text-gray-700 mb-4">Có lỗi xảy ra</p>
                <Button 
                  onClick={() => refetch()} 
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold text-lg px-8 py-6 rounded-2xl shadow-lg"
                >
                  <RefreshCw className="h-6 w-6 mr-2" />
                  🔄 Thử lại
                </Button>
              </CardContent>
            </Card>
          )
        })()
      ) : !esp ? (
        <Card className="bg-white/80 backdrop-blur-sm border-4 border-yellow-300 rounded-3xl shadow-2xl">
          <CardContent className="p-16 flex flex-col items-center justify-center text-center">
            <div className="text-6xl mb-6">🏠</div>
            <p className="text-3xl font-bold text-gray-700 mb-3">Chưa có thiết bị</p>
            <p className="text-xl text-gray-600">
              Hãy nhờ ba mẹ thêm thiết bị nhé! 😊
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-blue-400 to-blue-500 border-0 shadow-2xl transform hover:scale-105 transition-transform">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-5xl mb-2">📱</div>
                  <p className="text-white text-lg font-bold mb-1">Tổng thiết bị</p>
                  <p className="text-white text-4xl font-black">{devices.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-400 to-green-500 border-0 shadow-2xl transform hover:scale-105 transition-transform">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-5xl mb-2">⚡</div>
                  <p className="text-white text-lg font-bold mb-1">Đang bật</p>
                  <p className="text-white text-4xl font-black">{Object.values(deviceStates).filter(Boolean).length}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Devices Grid */}
          <div>
            {devices.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur-sm border-4 border-yellow-300 rounded-3xl shadow-2xl">
                <CardContent className="p-16 flex flex-col items-center justify-center text-center">
                  <div className="text-6xl mb-6">💡</div>
                  <p className="text-3xl font-bold text-gray-700 mb-3">Chưa có thiết bị</p>
                  <p className="text-xl text-gray-600">Hãy nhờ ba mẹ thêm thiết bị nhé! 😊</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {devices.map((device: Esp32Device) => {
                  const isOn = deviceStates[device.name] || false
                  const getDeviceEmoji = (type: string) => {
                    const typeUpper = type.toUpperCase()
                    if (typeUpper.includes('LED') || typeUpper.includes('LIGHT')) return '💡'
                    if (typeUpper.includes('FAN')) return '🌀'
                    if (typeUpper.includes('TEMP') || typeUpper.includes('SENSOR')) return '🌡️'
                    return '⚡'
                  }
                  const getDeviceColor = (type: string) => {
                    const typeUpper = type.toUpperCase()
                    if (typeUpper.includes('LED') || typeUpper.includes('LIGHT')) return isOn ? 'from-yellow-400 to-orange-400' : 'from-gray-300 to-gray-400'
                    if (typeUpper.includes('FAN')) return isOn ? 'from-cyan-400 to-blue-400' : 'from-gray-300 to-gray-400'
                    if (typeUpper.includes('TEMP') || typeUpper.includes('SENSOR')) return isOn ? 'from-red-400 to-pink-400' : 'from-gray-300 to-gray-400'
                    return isOn ? 'from-purple-400 to-pink-400' : 'from-gray-300 to-gray-400'
                  }
                  return (
                    <Card 
                      key={device.name} 
                      className={`bg-white/90 backdrop-blur-sm border-4 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300 ${
                        isOn ? 'border-yellow-400 shadow-yellow-300/50' : 'border-gray-300'
                      }`}
                    >
                      <CardContent className="p-8">
                        <div className="space-y-6">
                          {/* Device Icon & Name */}
                          <div className="text-center space-y-4">
                            <div className={`mx-auto w-24 h-24 bg-gradient-to-br ${getDeviceColor(device.type)} rounded-3xl shadow-2xl flex items-center justify-center transform transition-transform ${
                              isOn ? 'animate-pulse' : ''
                            }`}>
                              <span className="text-5xl">{getDeviceEmoji(device.type)}</span>
                            </div>
                            <div>
                              <h3 className="text-2xl font-black text-gray-800 mb-2">
                                {device.name}
                              </h3>
                              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-base ${
                                isOn ? 'bg-green-400 text-white' : 'bg-gray-300 text-gray-700'
                              }`}>
                                <div className={`h-3 w-3 rounded-full ${
                                  isOn ? 'bg-white animate-pulse' : 'bg-gray-500'
                                }`} />
                                {isOn ? '✅ Đang bật' : '⭕ Đã tắt'}
                              </div>
                            </div>
                          </div>

                          {/* Control Button */}
                          <Button
                            onClick={() => handleToggleDevice(device.name, isOn)}
                            disabled={sendMessageMut.isPending}
                            size="lg"
                            className={`w-full h-16 rounded-2xl font-black text-xl shadow-xl transform hover:scale-105 transition-all ${
                              isOn 
                                ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white' 
                                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                            }`}
                          >
                            {isOn ? '🔴 TẮT' : '🟢 BẬT'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
