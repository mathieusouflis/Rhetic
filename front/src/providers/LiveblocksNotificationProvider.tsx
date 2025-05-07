"use client";
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { liveblocksClient } from '@/lib/liveblocks/liveblocksClient';
import { useAuth } from './AuthProvider';
import { NotificationType } from '@/types/notification';

interface LiveblocksNotificationContextType {
  liveNotifications: NotificationType[];
  notifications: NotificationType[];
  clearLiveNotifications: () => void;
}

const LiveblocksNotificationContext = createContext<LiveblocksNotificationContextType | undefined>(undefined);

export const LiveblocksNotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [liveNotifications, setLiveNotifications] = useState<NotificationType[]>([]);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  
  useEffect(() => {
    if (!user?.id) return;
    
    const roomId = `user-${user.id}`;
    let unsubscribe: (() => void) | undefined;
    
    const setupSubscription = async () => {
      try {
        // Utilisez "as any" pour contourner temporairement les erreurs de type
        const client = liveblocksClient as any;
        
        if (typeof client.subscribe === 'function') {
          unsubscribe = client.subscribe({
            id: roomId,
            onEvent: (event: any) => {
              if (event.type === 'NOTIFICATION') {
                const notification = event.data as NotificationType;
                
                setLiveNotifications(prev => {
                  if (prev.some(n => n.id === notification.id)) {
                    return prev;
                  }
                  return [notification, ...prev];
                });
                
                setNotifications(prev => {
                  if (prev.some(n => n.id === notification.id)) {
                    return prev;
                  }
                  return [notification, ...prev];
                });
              }
            },
          });
        } else {
          console.error('La méthode subscribe n\'est pas disponible sur le client Liveblocks');
        }
      } catch (error) {
        console.error('Erreur lors de la création de la souscription Liveblocks:', error);
      }
    };
    
    setupSubscription();
    
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [user?.id]);
  
  const clearLiveNotifications = () => {
    setLiveNotifications([]);
  };
  
  return (
    <LiveblocksNotificationContext.Provider value={{ 
      liveNotifications, 
      notifications,
      clearLiveNotifications 
    }}>
      {children}
    </LiveblocksNotificationContext.Provider>
  );
};

export const useLiveblocksNotifications = () => {
  const context = useContext(LiveblocksNotificationContext);
  if (context === undefined) {
    throw new Error('useLiveblocksNotifications must be used within a LiveblocksNotificationProvider');
  }
  return context;
};