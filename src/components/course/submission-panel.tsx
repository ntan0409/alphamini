"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Upload, 
  Video, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Play,
  Square,
  Circle
} from 'lucide-react'
import { useCreateSubmission, useNewestSubmission } from '@/features/courses/hooks/use-submission'
import { presignSubmissionUpload } from '@/features/courses/api/submission-api'
import { uploadFileToPresignedUrl } from '@/features/courses/api/lesson-api'
import { toast } from 'sonner'
import { useSendRobotCommand } from '@/features/users/hooks/use-websocket'
import { WebSocketCommand } from '@/types/websocket'
import { useRobotStore } from '@/hooks/use-robot-store'

interface SubmissionPanelProps {
  accountLessonId: string
  onSubmissionSuccess?: () => void
}

interface RobotLog {
  timestamp: number
  type: string
  data: unknown
}

export function SubmissionPanel({ accountLessonId, onSubmissionSuccess }: SubmissionPanelProps) {
  const [submissionType, setSubmissionType] = useState<'video' | 'robot'>('robot')
  
  // Video submission states
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  
  // Robot log submission states
  const [isRecording, setIsRecording] = useState(false)
  const [robotLogs, setRobotLogs] = useState<RobotLog[]>([])
  const [recordingDuration, setRecordingDuration] = useState(0)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // API hooks
  const createSubmission = useCreateSubmission()
  const { data: latestSubmission } = useNewestSubmission(accountLessonId)
  const sendCommand = useSendRobotCommand()
  
  // Get selected robot from Redux store
  const { selectedRobotSerial, selectedRobot } = useRobotStore()
  const robotSerial = Array.isArray(selectedRobotSerial) ? selectedRobotSerial[0] : selectedRobotSerial

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview)
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
    }
  }, [videoPreview])

  // Handle video file selection
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file type
      if (!file.type.startsWith('video/')) {
        toast.error('Vui lòng chọn file video hợp lệ')
        return
      }

      setVideoFile(file)
      
      // Create preview URL
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview)
      }
      const previewUrl = URL.createObjectURL(file)
      setVideoPreview(previewUrl)
      toast.success('Đã chọn video thành công!')
    }
  }

  // Handle video submission
  const handleVideoSubmit = async () => {
    if (!videoFile) {
      toast.error('Vui lòng chọn video để nộp bài')
      return
    }

    try {
      setUploadProgress(5)

      // 1) Request presigned upload URL from backend
      const presign = await presignSubmissionUpload({
        filename: videoFile.name,
        contentType: videoFile.type || 'video/mp4',
        folder: 'submissions',
      })

      // 2) Upload file directly to storage using presigned URL
      await uploadFileToPresignedUrl(
        presign.uploadUrl,
        videoFile,
        videoFile.type,
        (percent) => setUploadProgress(Math.max(5, Math.min(95, percent)))
      )

      setUploadProgress(95)

      // 3) Create submission with returned public URL
      await createSubmission.mutateAsync({
        accountLessonId,
        videoUrl: presign.publicUrl,
        status: 0, // Pending review
      })

      setUploadProgress(100)
      toast.success('Nộp bài thành công! Đang chờ giáo viên chấm điểm.')
      
      // Reset states
      setVideoFile(null)
      setVideoPreview(null)
      setUploadProgress(0)
      
      onSubmissionSuccess?.()
    } catch (error) {
      console.error('Error submitting video:', error)
      toast.error('Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.')
      setUploadProgress(0)
    }
  }

  // Note: upload handled via presign => uploadFileToPresignedUrl

  // Start recording robot logs
  const handleStartRecording = () => {
    if (!robotSerial) {
      toast.error('Vui lòng chọn robot từ header trước')
      return
    }

    setIsRecording(true)
    setRobotLogs([])
    setRecordingDuration(0)

    // Start recording timer
    recordingIntervalRef.current = setInterval(() => {
      setRecordingDuration((prev) => prev + 1)
    }, 1000)

    // Send command to robot to start submission recording
    const command: WebSocketCommand = {
      type: 'submission_start',
      data: {
        account_lesson_id: accountLessonId
      },
      lang: 'vi'
    }

    sendCommand.mutate(
      { serial: robotSerial, command },
      {
        onSuccess: () => {
          toast.success('Đã bắt đầu ghi log robot')
          // Start listening for robot logs
          startListeningToRobotLogs()
        },
        onError: () => {
          handleStopRecording()
        }
      }
    )
  }

  // Stop recording robot logs
  const handleStopRecording = () => {
    setIsRecording(false)
    
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current)
      recordingIntervalRef.current = null
    }

    // Send command to robot to stop submission recording
    if (robotSerial) {
      const command: WebSocketCommand = {
        type: 'submission_end',
        data: {
          account_lesson_id: accountLessonId
        }
        , lang: 'vi'
      }
      sendCommand.mutate(
        { serial: robotSerial, command },
        {
          onSuccess: () => {
            toast.success('Đã dừng ghi log và nộp bài thành công!')
            
            // Reset states
            setRobotLogs([])
            setRecordingDuration(0)
            
            // Call success callback
            onSubmissionSuccess?.()
          },
          onError: () => {
            toast.error('Có lỗi khi dừng ghi log. Vui lòng thử lại.')
          }
        }
      )
    }

    // Stop listening
    stopListeningToRobotLogs()

    toast.info(`Thời gian ghi: ${formatDuration(recordingDuration)}`)
  }

  // Start listening to robot logs via WebSocket
  const startListeningToRobotLogs = () => {
    // TODO: Implement WebSocket connection to receive robot logs
    // For now, simulate receiving logs
    const simulationInterval = setInterval(() => {
      if (isRecording) {
        const newLog: RobotLog = {
          timestamp: Date.now(),
          type: 'robot-action',
          data: {
            action: 'move',
            direction: ['forward', 'backward', 'left', 'right'][Math.floor(Math.random() * 4)],
            distance: Math.floor(Math.random() * 100)
          }
        }
        setRobotLogs((prev) => [...prev, newLog])
      } else {
        clearInterval(simulationInterval)
      }
    }, 2000)
  }

  // Stop listening to robot logs
  const stopListeningToRobotLogs = () => {
    // TODO: Close WebSocket connection
  }

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Nộp bài
        </CardTitle>
        <CardDescription>
          Chọn cách nộp bài: upload video hoặc ghi log robot thực tế
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Show latest submission status if exists */}
        {latestSubmission && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-semibold">Bài nộp gần nhất:</p>
                <p className="text-sm text-muted-foreground">
                  Trạng thái: <Badge variant={latestSubmission.status === 2 ? 'default' : 'secondary'}>
                    {latestSubmission.statusText || 'Đang chờ chấm'}
                  </Badge>
                </p>
                <p className="text-sm text-muted-foreground">
                  Ngày nộp: {new Date(latestSubmission.createdDate).toLocaleString('vi-VN')}
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Submission Type Tabs */}
        <Tabs value={submissionType} onValueChange={(v) => setSubmissionType(v as 'video' | 'robot')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Nộp Video
            </TabsTrigger>
            <TabsTrigger value="robot" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Ghi Log Robot
            </TabsTrigger>
          </TabsList>

          {/* Video Submission Tab */}
          <TabsContent value="video" className="space-y-4">
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-500 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-4">
                  Chọn video để tải lên (MP4, AVI, MOV)
                </p>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="hidden"
                  id="video-upload"
                />
                <label htmlFor="video-upload">
                  <Button type="button" variant="outline" asChild>
                    <span>Chọn video</span>
                  </Button>
                </label>
              </div>

              {/* Video Preview */}
              {videoPreview && videoFile && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Video đã chọn:</p>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">{videoFile.name}</p>
                    <p className="text-xs text-gray-500">
                      Kích thước: {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <video
                    src={videoPreview}
                    controls
                    className="w-full rounded-lg"
                    style={{ maxHeight: '300px' }}
                  />
                </div>
              )}

              {/* Upload Progress */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Đang tải lên...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                onClick={handleVideoSubmit}
                disabled={!videoFile || createSubmission.isPending || uploadProgress > 0}
                className="w-full"
                size="lg"
              >
                {createSubmission.isPending || uploadProgress > 0 ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang nộp bài...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Nộp bài video
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Robot Log Submission Tab */}
          <TabsContent value="robot" className="space-y-4">
            <div className="space-y-4">
              {/* Robot Status Display */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Robot đã chọn</label>
                {robotSerial ? (
                  <div className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg bg-gray-50">
                    <Circle className={`w-3 h-3 ${selectedRobot?.status === 'online' ? 'text-green-500 fill-green-500' : 'text-gray-400 fill-gray-400'}`} />
                    <div className="flex-1">
                      <p className="font-semibold">{selectedRobot?.name || robotSerial}</p>
                      <p className="text-xs text-gray-500">Serial: {robotSerial}</p>
                    </div>
                    <Badge variant={selectedRobot?.status === 'online' ? 'default' : 'secondary'}>
                      {selectedRobot?.status === 'online' ? 'Online' : 'Offline'}
                    </Badge>
                  </div>
                ) : (
                  <Alert className="bg-yellow-50 border-yellow-200">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      Vui lòng chọn robot từ header trước khi ghi log
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Recording Controls */}
              <div className="flex gap-2">
                {!isRecording ? (
                  <Button
                    onClick={handleStartRecording}
                    disabled={!robotSerial || sendCommand.isPending}
                    className="flex-1"
                    size="lg"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Bắt đầu ghi log
                  </Button>
                ) : (
                  <Button
                    onClick={handleStopRecording}
                    variant="destructive"
                    className="flex-1"
                    size="lg"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Dừng ghi log
                  </Button>
                )}
              </div>

              {/* Recording Status */}
              {isRecording && (
                <Alert className="bg-red-50 border-red-200">
                  <Circle className="h-4 w-4 text-red-500 animate-pulse" />
                  <AlertDescription className="flex justify-between items-center">
                    <span className="font-semibold text-red-700">Đang ghi log robot...</span>
                    <Badge variant="destructive">{formatDuration(recordingDuration)}</Badge>
                  </AlertDescription>
                </Alert>
              )}

              {/* Log Preview */}
              {robotLogs.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Log đã ghi: {robotLogs.length} sự kiện</p>
                    <Badge variant="outline">Thời gian: {formatDuration(recordingDuration)}</Badge>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg max-h-40 overflow-y-auto">
                    <pre className="text-xs font-mono">
                      {JSON.stringify(robotLogs.slice(-5), null, 2)}
                    </pre>
                    {robotLogs.length > 5 && (
                      <p className="text-xs text-gray-500 mt-2">
                        ... và {robotLogs.length - 5} sự kiện khác
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Info Alert */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <p className="font-semibold mb-1">Hướng dẫn:</p>
                  <ul className="space-y-1 text-xs">
                    <li>1. Chọn robot từ header (góc phải màn hình)</li>
                    <li>2. Nhấn &quot;Bắt đầu ghi log&quot; để bắt đầu</li>
                    <li>3. Thực hiện các thao tác với robot</li>
                    <li>4. Nhấn &quot;Dừng ghi log&quot; - Bài sẽ tự động được nộp</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
