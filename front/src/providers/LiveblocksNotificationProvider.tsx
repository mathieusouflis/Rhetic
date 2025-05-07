"use client";
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { liveblocksClient, getUserRoomId } from '@/lib/liveblocks/liveblocksClient';
import { useAuth } from './AuthProvider';
import { NotificationType } from '@/types/notification';
import { addToast } from '@/components/ui/Toast';

interface LiveblocksNotificationContextType {
  liveNotifications: NotificationType[];
  clearLiveNotifications: () => void;
}

const LiveblocksNotificationContext = createContext<LiveblocksNotificationContextType | undefined>(undefined);

export const LiveblocksNotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [liveNotifications, setLiveNotifications] = useState<NotificationType[]>([]);
  
  useEffect(() => {
    if (!user?.id) return;
    
    const roomId = getUserRoomId(user.id);
    let unsubscribe: (() => void) | null = null;
    
    const setupSubscription = async () => {
      try {
        unsubscribe = liveblocksClient.subscribe({
          id: roomId,
          onEvent: (event) => {
            if (event.type === 'NOTIFICATION') {
              const notification = event.data as NotificationType;
              
              setLiveNotifications(prev => {
                // Vérifier si la notification existe déjà
                if (prev.some(n => n.id === notification.id)) {
                  return prev;
                }
                return [notification, ...prev];
              });
              
              // Afficher un toast pour la nouvelle notification
              const content = typeof notification.content === 'string' 
                ? JSON.parse(notification.content) 
                : notification.content;
                
              addToast({
                title: content.title || 'Nouvelle notification',
                message: content.message || '',
                type: 'info',
                duration: 5000,
              });
            }
          },
        });
      } catch (error) {
        console.error('Erreur lors de la création de la souscription Liveblocks:', error);
      }
    };
    
    setupSubscription();
    
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user?.id]);
  
  const clearLiveNotifications = () => {
    setLiveNotifications([]);
  };
  
  return (
    <LiveblocksNotificationContext.Provider value={{ liveNotifications, clearLiveNotifications }}>
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