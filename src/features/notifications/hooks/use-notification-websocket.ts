import { useEffect, useRef, useState, useCallback } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { Notification } from "@/types/notification";
import { userServiceSocketUrl } from "@/app/constants/constants";

interface UseNotificationWebSocketProps {
  accountId: string | null;
  onNotificationReceived?: (notification: Notification) => void;
}

const MAX_RECONNECT_ATTEMPTS = 3;
const RECONNECT_DELAY = 5000;

export const useNotificationWebSocket = ({
  accountId,
  onNotificationReceived,
}: UseNotificationWebSocketProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const hasShownErrorRef = useRef(false);
  const isMountedRef = useRef(true);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleNotificationReceived = useCallback(
    (notification: Notification) => {
      console.log("📬 New notification received:", notification);
      // ✅ Chỉ gọi callback, KHÔNG hiển thị toast ở đây
      onNotificationReceived?.(notification);
    },
    [onNotificationReceived]
  );

  useEffect(() => {
    if (!accountId) return;

    isMountedRef.current = true;
    reconnectAttemptsRef.current = 0;
    hasShownErrorRef.current = false;

    const token = sessionStorage.getItem("accessToken");
    const socketFactory = () => new SockJS(userServiceSocketUrl);

    const client = new Client({
      webSocketFactory: socketFactory,
      reconnectDelay: 0, // tự quản lý reconnect
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      connectionTimeout: 10000,
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      debug: (str) => {
        if (str.includes("ERROR") || str.includes("CONNECT")) console.log("STOMP:", str);
      },
      onConnect: () => {
        console.log("✅ WebSocket Connected!");
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
        hasShownErrorRef.current = false;

        const topic = `/topic/notifications/${accountId}`;
        client.subscribe(topic, (message: IMessage) => {
          try {
            const notification: Notification = JSON.parse(message.body);
            console.log("📬 Received notification:", notification);
            handleNotificationReceived(notification);
          } catch (err) {
            console.error("❌ Error parsing notification:", err);
          }
        });
      },
      onDisconnect: () => {
        setIsConnected(false);
        attemptReconnect();
      },
      onStompError: (frame) => {
        console.error("❌ STOMP Error:", frame);
      },
      onWebSocketError: (event) => {
        console.warn("⚠️ WebSocket connection failed:", event);
        attemptReconnect();
      },
    });

    const attemptReconnect = () => {
      if (!isMountedRef.current) return;
      reconnectAttemptsRef.current++;
      if (reconnectAttemptsRef.current > MAX_RECONNECT_ATTEMPTS) {
        if (!hasShownErrorRef.current) {
          console.error("❌ Max reconnect attempts reached. WebSocket offline.");
          hasShownErrorRef.current = true;
        }
        return;
      }
      reconnectTimeoutRef.current = setTimeout(() => {
        if (!isMountedRef.current) return;
        console.log("♻️ Reconnecting WebSocket...");
        try {
          client.activate();
        } catch (error) {
          console.warn("WebSocket activation failed:", error);
        }
      }, RECONNECT_DELAY);
    };

    clientRef.current = client;
    client.activate();

    return () => {
      console.log("🔌 Cleaning up WebSocket connection");
      isMountedRef.current = false;
      reconnectTimeoutRef.current && clearTimeout(reconnectTimeoutRef.current);
      try {
        clientRef.current?.deactivate();
      } catch (error) {
        console.warn("Error during WebSocket cleanup:", error);
      }
      clientRef.current = null;
    };
  }, [accountId, handleNotificationReceived]);

  return { isConnected };
};
