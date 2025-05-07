import { useState, useEffect } from 'react';
import { notificationService } from "@/lib/api/services/notificationService";
import { NotificationType } from "@/types/notification";
import { useAuth } from "@/providers/AuthProvider";
import { useLiveblocksNotifications } from "@/providers/LiveblocksNotificationProvider";

export const useNotifications = () => {
  const { user } = useAuth();
  const { liveNotifications } = useLiveblocksNotifications();
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (liveNotifications.length > 0) {
      setNotifications(prev => {
        // Fusionner les notifications en évitant les doublons
        const merged = [...prev];
        
        liveNotifications.forEach(newNotif => {
          if (!merged.some(existingNotif => existingNotif.id === newNotif.id)) {
            merged.unshift(newNotif);
          }
        });
        
        return merged;
      });
    }
  }, [liveNotifications]);

  const fetchNotifications = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await notificationService.getNotifications(user.id);
      setNotifications(response.data);
    } catch (err) {
      console.error('Erreur lors de la récupération des notifications:', err);
      setError(err instanceof Error ? err : new Error('Erreur inconnue'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
    }
  }, [user]);

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prevNotifications =>
        prevNotifications.map(notif =>
          notif.id === id ? { ...notif, is_read: true, read_at: new Date() } : notif
        )
      );
    } catch (err) {
      console.error('Erreur lors du marquage de la notification comme lue:', err);
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications
      .filter(n => !n.is_read)
      .map(n => n.id);
    
    if (unreadIds.length === 0 || !user?.id) return;
    
    try {
      await notificationService.markAllAsRead(user.id, unreadIds);
      setNotifications(prevNotifications =>
        prevNotifications.map(notif =>
          !notif.is_read ? { ...notif, is_read: true, read_at: new Date() } : notif
        )
      );
    } catch (err) {
      console.error('Erreur lors du marquage de toutes les notifications comme lues:', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications
  };
};