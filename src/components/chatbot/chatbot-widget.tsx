"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  MessageCircle,
  X,
  Send,
  User,
  Loader2,
  Minimize2,
  RefreshCw,
} from "lucide-react";
import { sendChatbotQuery, ChatMessage } from "@/features/chatbot/api/chatbot-api";
import { toast } from "sonner";
import Image from "next/image";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState<'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'>('bottom-right');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Xin chào! Tôi là trợ lý robot của AlphaCode. Tôi có thể giúp bạn tìm hiểu về các sản phẩm robot và giải đáp thắc mắc của bạn. Bạn muốn biết gì?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load saved position from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPosition = localStorage.getItem('chatbot-position');
      if (savedPosition && ['bottom-right', 'bottom-left', 'top-right', 'top-left'].includes(savedPosition)) {
        setPosition(savedPosition as 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left');
      }
    }
  }, []);

  // Save position to localStorage when changed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chatbot-position', position);
    }
  }, [position]);

  const cyclePosition = () => {
    const positions: Array<'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'> = ['bottom-right', 'bottom-left', 'top-left', 'top-right'];
    const currentIndex = positions.indexOf(position);
    const nextIndex = (currentIndex + 1) % positions.length;
    setPosition(positions[nextIndex]);
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-right':
        return 'bottom-6 right-6';
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'top-right':
        return 'top-6 right-6';
      case 'top-left':
        return 'top-6 left-6';
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      const response = await sendChatbotQuery(
        userMessage.content,
        abortControllerRef.current.signal
      );

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.answer,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setHasError(false);
    } catch (error) {
      if (error instanceof Error && (error.name === "AbortError" || error.name === "CanceledError")) {
        // Request was cancelled, do nothing
        return;
      }

      console.error("Chatbot error:", error);
      setHasError(true);
      toast.error("Không thể kết nối với chatbot", {
        description: "Vui lòng thử lại sau",
      });
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleRetry = () => {
    setHasError(false);
    // Clear error message if exists
    setMessages((prev) => {
      const filtered = prev.filter(msg => msg.content !== "ERROR");
      return filtered;
    });
  };

  if (!isOpen) {
    return (
      <div className={`fixed z-50 ${getPositionClasses()}`}>
        <div className="relative">
          <Button
            onClick={toggleOpen}
            onContextMenu={(e) => {
              e.preventDefault();
              cyclePosition();
            }}
            className="w-20 h-20 rounded-full bg-blue-600 hover:bg-blue-700 shadow-2xl group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            <div className="relative w-12 h-12">
              <Image
                src="/img_item_robot.webp"
                alt="Robot Assistant"
                fill
                className="object-contain group-hover:scale-110 transition-transform"
              />
            </div>
          </Button>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg animate-pulse" />
          {/* Position indicator hint */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
            Chuột phải để đổi vị trí
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed z-50 ${getPositionClasses()}`}>
      <Card
        className={`w-[400px] shadow-2xl border-0 rounded-3xl overflow-hidden transition-all duration-300 ${
          isMinimized ? "h-[70px]" : "h-[600px]"
        }`}
      >
        {/* Header */}
        <CardHeader className="bg-blue-600 text-white p-5 flex flex-row items-center justify-between space-y-0 relative overflow-hidden border-b-4 border-blue-700">
          <div className="absolute inset-0 bg-[url('/img_item_robot.webp')] opacity-5 bg-cover bg-center" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center relative overflow-hidden">
              <Image
                src="/img_item_robot.webp"
                alt="Robot"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Trợ lý Robot AI</CardTitle>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <p className="text-xs opacity-90">Trực tuyến</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 relative z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMinimize}
              className="text-white hover:bg-white/20 rounded-full w-9 h-9"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleOpen}
              className="text-white hover:bg-white/20 rounded-full w-9 h-9"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            {/* Messages */}
            <CardContent className="p-4 h-[450px] overflow-y-auto bg-gray-50">
              {hasError ? (
                // Error State
                <div className="h-full flex flex-col items-center justify-center space-y-4">
                  <div className="relative w-48 h-48">
                    <Image
                      src="/biding_eror_img.webp"
                      alt="Error"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      Oops! Có lỗi xảy ra
                    </h3>
                    <p className="text-sm text-gray-600 max-w-[280px]">
                      Không thể kết nối với trợ lý robot. Vui lòng thử lại sau.
                    </p>
                  </div>
                  <Button
                    onClick={handleRetry}
                    className="bg-white hover:bg-gray-50 text-blue-600 rounded-full px-6 border-2 border-blue-600 font-medium shadow-lg"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Thử lại
                  </Button>
                </div>
              ) : (
                // Normal Chat State
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 ${
                        message.role === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      {/* Avatar */}
                      <div className="flex-shrink-0 w-10 h-10 rounded-full shadow-md overflow-hidden relative">
                        {message.role === "user" ? (
                          <div className="w-full h-full bg-blue-600 flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                        ) : (
                          <Image
                            src="/img_item_robot.webp"
                            alt="Robot"
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>

                      {/* Message bubble */}
                      <div
                        className={`flex-1 max-w-[280px] ${
                          message.role === "user" ? "text-right" : ""
                        }`}
                      >
                        <div
                          className={`inline-block p-4 rounded-2xl shadow-sm ${
                            message.role === "user"
                              ? "bg-blue-600 text-white rounded-tr-sm"
                              : "bg-white text-gray-800 rounded-tl-sm border border-gray-200"
                          }`}
                        >
                          <div 
                            className="text-sm leading-relaxed whitespace-pre-wrap [&>strong]:font-bold [&>strong]:text-inherit [&>em]:italic"
                            dangerouslySetInnerHTML={{ 
                              __html: message.content
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1.5 px-2">
                          {message.timestamp.toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full shadow-md overflow-hidden relative">
                        <Image
                          src="/img_item_robot.webp"
                          alt="Robot"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="inline-block px-6 py-4 rounded-2xl rounded-tl-sm bg-white shadow-sm border border-gray-200">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </CardContent>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Hỏi về robot..."
                  disabled={isLoading || hasError}
                  className="flex-1 rounded-full border-gray-300 focus:border-blue-600 focus:ring-blue-600 h-12 px-5 bg-gray-50 focus:bg-white transition-colors"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading || hasError}
                  className="rounded-full w-12 h-12 p-0 bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 shadow-lg disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                Powered by AlphaCode
              </p>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
