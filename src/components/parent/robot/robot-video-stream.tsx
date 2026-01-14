"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { socketUrl } from "@/app/constants/constants";
import { useRobotCommand } from "@/hooks/use-robot-command";
import { 
  Loader2, 
  AlertCircle,
  Radio,
  Play,
  Square,
  Maximize2,
  Minimize2,
  Bot
} from "lucide-react";

interface RobotVideoStreamProps {
  robotSerial: string | null;
  isCompact?: boolean;
  showControls?: boolean;
  className?: string;
  onError?: (error: string) => void;
  onStatusChange?: (isStreaming: boolean) => void;
}

export default function RobotVideoStream({
  robotSerial,
  isCompact = false,
  showControls = true,
  className = "",
  onError,
  onStatusChange
}: RobotVideoStreamProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [robotError, setRobotError] = useState<string | null>(null);
  const [isWebRTCStarted, setIsWebRTCStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const robotVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  // Toast notification system
  const setNotify = useCallback((msg: string, type: "success" | "error") => {
    console.log(`${type === "success" ? "✅" : "❌"} ${msg}`);
    if (type === "error" && onError) {
      onError(msg);
    }
  }, [onError]);

  // Robot Command Hook for WebRTC
  const { sendWebRTCCommand } = useRobotCommand(setNotify);

  // Status change callback
  useEffect(() => {
    if (onStatusChange) {
      onStatusChange(isWebRTCStarted);
    }
  }, [isWebRTCStarted, onStatusChange]);

  // WebRTC Control Functions
  const sendWebRTCStart = useCallback(async () => {
    if (!robotSerial || isLoading || isWebRTCStarted) return;
    
    console.log("📤 Starting WebRTC for robot:", robotSerial);
    setIsLoading(true);
    setRobotError(null);
    
    try {
      // 1. Gửi start command qua HTTP API trước
      await sendWebRTCCommand(robotSerial, "webrtc_start");
      
      // 2. Sau đó khởi tạo WebSocket signaling connection
      initializeWebRTCConnection();
      
    } catch (error) {
      console.error("❌ Failed to send webrtc_start:", error);
      const errorMsg = "Không thể bắt đầu WebRTC";
      setRobotError(errorMsg);
      setIsLoading(false);
      if (onError) onError(errorMsg);
    }
  }, [robotSerial, isLoading, isWebRTCStarted, sendWebRTCCommand, onError]);

  const sendWebRTCStop = useCallback(async () => {
    if (!robotSerial || isLoading || !isWebRTCStarted) return;
    
    console.log("📤 Stopping WebRTC for robot:", robotSerial);
    setIsLoading(true);
    
    try {
      // 1. Gửi stop command qua HTTP API
      await sendWebRTCCommand(robotSerial, "webrtc_stop");
      
      // 2. Đóng signaling connection
      cleanupWebRTCConnection();
      
    } catch (error) {
      console.error("❌ Failed to send webrtc_stop:", error);
      const errorMsg = "Không thể dừng WebRTC";
      setRobotError(errorMsg);
      if (onError) onError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [robotSerial, isLoading, isWebRTCStarted, sendWebRTCCommand, onError]);

  // Hàm khởi tạo WebRTC connection
  const initializeWebRTCConnection = useCallback(() => {
    if (!robotSerial) return;

    console.log("🔗 Initializing WebRTC signaling connection");

    let pc: RTCPeerConnection | null = null;
    let ws: WebSocket | null = null;
    let isClosed = false;

    try {
      pc = new RTCPeerConnection();
      pcRef.current = pc;

      // Debug signaling state
      pc.onsignalingstatechange = () => {
        console.log("🔄 Signaling state:", pc?.signalingState);
      };

      // Khi robot gửi video track
      pc.ontrack = (event) => {
        console.log("📹 Received video track from robot");
        if (robotVideoRef.current) {
          robotVideoRef.current.srcObject = event.streams[0];
          setIsLoading(false);
        }
      };

      // Khi browser có ICE candidate mới
      pc.onicecandidate = (event) => {
        if (event.candidate && ws?.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "ice", candidate: event.candidate.toJSON() }));
        }
      };

      // Tạo WebSocket signaling
      ws = new WebSocket(`${socketUrl}/signaling/${robotSerial}/web`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("✅ WebSocket signaling connected");
      };

      ws.onmessage = async (event) => {
        if (isClosed) return;
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === "webrtc_start_response") {
            console.log("📨 Robot confirmed WebRTC start");
            setIsWebRTCStarted(true);
            setIsLoading(false);
            setRobotError(null);
          }
          else if (data.type === "webrtc_stop_response") {
            console.log("📨 Robot confirmed WebRTC stop");
            setIsWebRTCStarted(false);
            setIsLoading(false);
          }
          else if (data.type === "offer") {
            console.log("📨 Received offer from robot");
            if (!pc || pc.signalingState !== "stable") {
              console.warn("⚠️ Ignoring offer, state:", pc?.signalingState);
              return;
            }

            await pc.setRemoteDescription({ type: "offer", sdp: data.sdp });
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            ws?.send(JSON.stringify({ type: "answer", sdp: answer.sdp }));
          }
          else if (data.type === "answer") {
            console.log("📨 Received answer from robot");
            if (pc?.signalingState === "have-local-offer") {
              await pc.setRemoteDescription({ type: "answer", sdp: data.sdp });
            }
          }
          else if (data.type === "ice" && data.candidate) {
            try {
              if (pc) {
                await pc.addIceCandidate(data.candidate);
              }
            } catch (iceErr) {
              console.warn("⚠️ Failed to add ICE candidate:", iceErr);
            }
          }
        } catch (err) {
          console.error("💥 WebRTC signaling error:", err);
          const errorMsg = "Lỗi xử lý signaling";
          setRobotError(errorMsg);
          setIsLoading(false);
          if (onError) onError(errorMsg);
        }
      };

      ws.onerror = (err) => {
        console.error("❌ WebSocket signaling error:", err);
        const errorMsg = "Lỗi kết nối signaling";
        setRobotError(errorMsg);
        setIsLoading(false);
        if (onError) onError(errorMsg);
      };

      ws.onclose = () => {
        console.warn("⚠️ WebSocket signaling closed");
        isClosed = true;
        setIsWebRTCStarted(false);
      };

    } catch (err) {
      console.error("💥 Failed to initialize WebRTC:", err);
      const errorMsg = "Không thể khởi tạo WebRTC";
      setRobotError(errorMsg);
      setIsLoading(false);
      if (onError) onError(errorMsg);
    }
  }, [robotSerial, onError]);

  // Hàm cleanup WebRTC connection
  const cleanupWebRTCConnection = useCallback(() => {
    console.log("🧹 Cleaning up WebRTC connection");
    
    setIsWebRTCStarted(false);
    
    // Clear video
    if (robotVideoRef.current) {
      robotVideoRef.current.srcObject = null;
    }
    
    // Close WebSocket
    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
      wsRef.current = null;
    } catch (e) {
      console.warn("⚠️ Error closing WebSocket:", e);
    }
    
    // Close PeerConnection
    try {
      if (pcRef.current) {
        pcRef.current.close();
      }
      pcRef.current = null;
    } catch (e) {
      console.warn("⚠️ Error closing PeerConnection:", e);
    }
  }, []);

  // Cleanup when robot changes or component unmounts
  useEffect(() => {
    if (!robotSerial) {
      cleanupWebRTCConnection();
      setRobotError(null);
      return;
    }

    console.log("🤖 Robot video stream ready for", robotSerial);
    setIsLoading(false);
    setRobotError(null);
    setIsWebRTCStarted(false);

    // Cleanup function
    return () => {
      console.log("🧹 Robot video stream cleanup");
      
      // Gửi stop command nếu đang active
      if (isWebRTCStarted && robotSerial) {
        try {
          sendWebRTCCommand(robotSerial, "webrtc_stop");
        } catch (e) {
          console.warn("⚠️ Error sending stop during cleanup:", e);
        }
      }
      
      cleanupWebRTCConnection();
    };
  }, [robotSerial, cleanupWebRTCConnection]);

  // Fullscreen functionality
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  if (!robotSerial) {
    return (
      <div className={`relative bg-gray-100 rounded-lg flex items-center justify-center ${isCompact ? 'h-32' : 'aspect-video'} ${className}`}>
        <div className="text-center text-gray-500">
          <Bot className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Chưa chọn robot</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Status Badge */}
      {!isCompact && (
        <div className="mb-3 flex items-center justify-between">
          <Badge 
            variant={isLoading ? "secondary" : robotError ? "destructive" : isWebRTCStarted ? "default" : "outline"}
            className="px-3 py-1 text-xs font-medium"
          >
            <div className="flex items-center gap-2">
              {isLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : robotError ? (
                <AlertCircle className="w-3 h-3" />
              ) : isWebRTCStarted ? (
                <Radio className="w-3 h-3" />
              ) : (
                <Radio className="w-3 h-3 opacity-50" />
              )}
              <span>
                {isLoading
                  ? "Đang kết nối..."
                  : robotError
                    ? robotError
                    : isWebRTCStarted
                      ? "Đang truyền"
                      : "Chưa kết nối"}
              </span>
            </div>
          </Badge>

          {/* Controls */}
          {showControls && (
            <div className="flex items-center gap-1">
              <Button
                onClick={sendWebRTCStart}
                disabled={isLoading || isWebRTCStarted}
                size="sm"
                variant="default"
                className="h-7 px-2 text-xs gap-1"
              >
                <Play className="w-3 h-3" />
                Start
              </Button>
              
              <Button
                onClick={sendWebRTCStop}
                disabled={isLoading || !isWebRTCStarted}
                size="sm"
                variant="destructive"
                className="h-7 px-2 text-xs gap-1"
              >
                <Square className="w-3 h-3" />
                Stop
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Video Container */}
      <div
        ref={containerRef}
        className={`relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden border border-gray-200 shadow-lg group ${
          isCompact ? 'h-32' : 'aspect-video'
        }`}
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20">
            <div className="text-white text-center">
              <Loader2 className={`${isCompact ? 'w-6 h-6' : 'w-8 h-8'} animate-spin mx-auto mb-2 text-purple-400`} />
              <p className={`${isCompact ? 'text-xs' : 'text-sm'} font-medium`}>Đang kết nối...</p>
            </div>
          </div>
        )}
        
        {/* Error Overlay */}
        {robotError && (
          <div className="absolute inset-0 flex items-center justify-center text-white bg-black/60 backdrop-blur-sm z-20">
            <div className="text-center">
              <AlertCircle className={`${isCompact ? 'w-6 h-6' : 'w-8 h-8'} mx-auto mb-2 text-red-400`} />
              <p className={`${isCompact ? 'text-xs' : 'text-sm'} font-medium`}>{robotError}</p>
            </div>
          </div>
        )}
        
        {/* Video Element */}
        <div className="relative w-full h-full overflow-hidden rounded-lg bg-gray-900">
          <video
            ref={robotVideoRef}
            autoPlay
            playsInline
            className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover"
            style={{
              transform: 'translate(-50%, -50%) rotate(270deg)',
              transformOrigin: 'center center',
            }}
          />
        </div>

        {/* Compact Controls Overlay */}
        {isCompact && showControls && (
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              onClick={sendWebRTCStart}
              disabled={isLoading || isWebRTCStarted}
              size="sm"
              variant="secondary"
              className="h-6 w-6 p-0 bg-black/40 hover:bg-black/60 text-white border-0 backdrop-blur-sm"
            >
              <Play className="w-3 h-3" />
            </Button>
            
            <Button
              onClick={sendWebRTCStop}
              disabled={isLoading || !isWebRTCStarted}
              size="sm"
              variant="secondary"
              className="h-6 w-6 p-0 bg-black/40 hover:bg-black/60 text-white border-0 backdrop-blur-sm"
            >
              <Square className="w-3 h-3" />
            </Button>
          </div>
        )}

        {/* Fullscreen Button */}
        {!isCompact && (
          <Button
            onClick={toggleFullscreen}
            size="sm"
            variant="secondary"
            className="absolute top-2 right-2 bg-black/40 hover:bg-black/60 text-white border-0 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        )}

        {/* Video overlay info */}
        {!robotError && !isLoading && isWebRTCStarted && (
          <div className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-sm text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex items-center gap-1">
              <Bot className="w-3 h-3" />
              <span>Robot camera</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}