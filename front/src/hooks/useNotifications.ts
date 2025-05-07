import { useState, useEffect } from 'react';
import { notificationService } from "@/lib/api/services/notificationService";
import { NotificationType } from "@/types/notification";
import { useAuth } from "@/providers/AuthProvider";
import { useLiveblocksNotifications } from "@/providers/LiveblocksNotificationProvider";

export const useNotifications = () => {
  const { user } = useAuth();
  const [storedNotifications, setStoredNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const { notifications: liveNotifications } = useLiveblocksNotifications();
  
  const allNotifications = [...liveNotifications, ...storedNotifications]
    .filter((notification, index, self) => 
      index === self.findIndex(n => n.id === notification.id))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const fetchNotifications = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await notificationService.getNotifications(user.id);
      setStoredNotifications(response.data);
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
      setStoredNotifications(prevNotifications =>
        prevNotifications.map(notif =>
          notif.id === id ? { ...notif, is_read: true, read_at: new Date() } : notif
        )
      );
    } catch (err) {
      console.error('Erreur lors du marquage de la notification comme lue:', err);
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = allNotifications
      .filter(n => !n.is_read)
      .map(n => n.id);
    
    if (unreadIds.length === 0 || !user?.id) return;
    
    try {
      await notificationService.markAllAsRead(user.id, unreadIds);
      
      setStoredNotifications(prevNotifications =>
        prevNotifications.map(notif =>
          !notif.is_read ? { ...notif, is_read: true, read_at: new Date() } : notif
        )
      );
    } catch (err) {
      console.error('Erreur lors du marquage de toutes les notifications comme lues:', err);
    }
  };

  const unreadCount = allNotifications.filter(n => !n.is_read).length;

  return {
    notifications: allNotifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications
  };
};