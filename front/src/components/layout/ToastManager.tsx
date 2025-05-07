"use client";

import { useState, useEffect } from "react";
import { Toast } from "@/components/ui/Toast";
import { NotificationType } from "@/types/notification";
import { useLiveblocksNotifications } from "@/providers/LiveblocksNotificationProvider";

export const ToastManager: React.FC = () => {
  const [toasts, setToasts] = useState<NotificationType[]>([]);
  const { notifications } = useLiveblocksNotifications();
  
  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[0];
      if (!toasts.some(t => t.id === latestNotification.id)) {
        setToasts(prev => [latestNotification, ...prev].slice(0, 5));
      }
    }
  }, [notifications]);
  
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  if (toasts.length === 0) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-4">
      {toasts.map(toast => (
        <Toast 
          key={toast.id} 
          notification={toast} 
          onClose={() => removeToast(toast.id)} 
        />
      ))}
    </div>
  );
};