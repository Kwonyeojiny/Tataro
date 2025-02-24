'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

import useLayerCardStore from '@/stores/layerCardStore';
import { getAccessToken } from '@/utils/auth';

type Notification = {
  id: string;
  message: string;
  timestamp: Date;
};
const AlarmBox = () => {
  const { hideLayerCard } = useLayerCardStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const retryCountRef = useRef(retryCount);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    retryCountRef.current = retryCount;
  }, [retryCount]);

  const connectWebSocket = useCallback(async () => {
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) throw new Error('No authentication token');

      wsRef.current = new WebSocket(
        `wss://hakunamatatarot.com/ws/notification/?token=${accessToken}`,
      );

      // const scheduleReconnection = () => {
      //   if (reconnectTimeoutRef.current) {
      //     clearTimeout(reconnectTimeoutRef.current);
      //   }

      //   const delay = Math.min(1000 * Math.pow(2, retryCountRef.current), 30000);
      //   reconnectTimeoutRef.current = setTimeout(() => {
      //     // 재시도 횟수 업데이트 및 화면 반영
      //     setRetryCount(prev => prev + 1);
      //     connectWebSocket();
      //   }, delay);
      // };

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setRetryCount(0); // 재연결 성공 시 횟수 초기화
      };

      wsRef.current.onmessage = event => {
        const newNotification = JSON.parse(event.data);
        setNotifications(prev => [
          {
            id: Date.now().toString(),
            message: newNotification.content,
            timestamp: new Date(),
          },
          ...prev,
        ]);
      };
      //try catch로 감싸주기

      wsRef.current.onerror = error => {
        console.error('WebSocket error:', error);
      };

      wsRef.current.onclose = event => {
        setIsConnected(false);
        console.log(`WebSocket closed: ${event.reason}`);
      };
    } catch (error) {
      console.error('Connection error:', error);
      // 에러 발생 시에도 재연결 시도
      const delay = Math.min(1000 * Math.pow(2, retryCountRef.current), 30000);
      reconnectTimeoutRef.current = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        connectWebSocket();
      }, delay);
    }
  }, []);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connectWebSocket]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="absolute top-1 left-[106px] font-lilita text-lightBlue text-3xl stroke">
          alarm
        </h1>
        <button onClick={hideLayerCard} className="absolute top-1 right-1">
          <X strokeWidth={1.5} className="text-purple" />
        </button>
      </div>

      <div className=" flex flex-col items-cente space-y-2 max-h-60 overflow-y-auto pr-2">
        {!isConnected && (
          <div className="font-gMedium text-sm text-gray-500">{`(재연결 시도 ${retryCount})`}</div>
        )}
        {notifications.length === 0 ? (
          <div className="font-gMedium text-sm text-gray-500">새로운 알림이 없습니다.</div>
        ) : (
          notifications.map(notification => (
            <div key={notification.id} className="p-3 bg-blue-50 rounded-lg animate-fade-in">
              <div className="font-gMedium text-sm text-darkBlue">{notification.message}</div>
              <div className="text-xs text-gray-400 mt-1">
                {notification.timestamp.toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlarmBox;
