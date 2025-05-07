"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { liveblocksClient } from "@/lib/liveblocks/liveblocksClient";
import { useAuth } from "@/providers/AuthProvider";
import { NotificationType } from "@/types/notification";

interface LiveblocksNotificationContextType {
  notifications: NotificationType[];
  addNotification: (notification: NotificationType) => void;
}

const LiveblocksNotificationContext = createContext<LiveblocksNotificationContextType | null>(null);

export function LiveblocksNotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchSession = async () => {
      try {
        const response = await fetch('/api/liveblocks/auth', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to authenticate with Liveblocks');
        
        const session = await response.json();
        setSessionId(session.id);

        liveblocksClient.enterRoom(`user-${user.id}`);
      } catch (error) {
        console.error('Error connecting to Liveblocks:', error);
      }
    };

    fetchSession();

    return () => {
      if (user?.id) {
        liveblocksClient.leaveRoom(`user-${user.id}`);
      }
    };
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;

    const room = liveblocksClient.getRoom(`user-${user.id}`);
    
    const unsubscribe = room?.subscribe('event', (event) => {
      if (event.type === 'NOTIFICATION') {
        addNotification(event.data);
      }
    });

    return () => {
      unsubscribe?.();
    };
  }, [user]);

  const addNotification = (notification: NotificationType) => {
    setNotifications(prev => [notification, ...prev]);
    if (Notification.permission === 'granted') {
      new Notification('Nouvelle notification', {
        body: typeof notification.content === 'string' 
          ? JSON.parse(notification.content).message 
          : notification.content.message,
      });
    }
  };

  return (
    <LiveblocksNotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
    </LiveblocksNotificationContext.Provider>
  );
}

export const useLiveblocksNotifications = () => {
  const context = useContext(LiveblocksNotificationContext);
  if (!context) {
    throw new Error('useLiveblocksNotifications must be used within a LiveblocksNotificationProvider');
  }
  return context;
};