import { create } from 'zustand';

type Notification = {
  id: string;
  title: string;
  url: string;
  category: string;
  created_at: Date;
};

type NotificationStore = {
  notifications: Notification[];
  ws: WebSocket | null;
  connectWebSocket: (accessToken: string) => void;
  disconnectWebSocket: () => void;
};

const useNotificationStore = create<NotificationStore>()((set, get) => ({
  notifications: [],
  ws: null,

  connectWebSocket: accessToken => {
    const newWs = new WebSocket(`wss://hakunamatatarot.com/ws/notification/?token=${accessToken}`);

    newWs.onopen = () => console.log('WebSocket Connected');

    newWs.onmessage = event => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received message:', data);

        // 1. 초기 배치 알림 처리
        if (data?.notifications) {
          const newNotifications = data.notifications.map((notification: Notification) => ({
            id: String(notification.id),
            title: notification.title,
            url: notification.url,
            category: notification.category,
            created_at: new Date(notification.created_at),
          }));

          set({ notifications: newNotifications });
        }
        // 2. 새로운 단일 알림 처리
        else if (data?.type === 'new_notification') {
          const notification = JSON.parse(data.notification);
          const newNotification = {
            id: String(notification.id),
            title: notification.title,
            url: notification.url,
            category: notification.category,
            created_at: new Date(notification.created_at),
          };

          set(state => ({
            notifications: [newNotification, ...state.notifications],
          }));
        }
      } catch (error) {
        console.error('메시지 처리 오류:', error);
      }
    };

    newWs.onerror = error => console.error('WebSocket Error:', error);

    newWs.onclose = () => {
      console.log('연결 끊김, 3초 후 재연결...');
    };

    set({ ws: newWs });
  },

  disconnectWebSocket: () => {
    const { ws } = get();
    if (ws) {
      ws.close();
      set({ ws: null });
    }
  },
}));

export default useNotificationStore;
