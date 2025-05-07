import { API_PATHS } from "@/lib/api/config";
import { fetchMany, update } from "@/lib/api/apiClient";
import { NotificationType } from "@/types/notification";

export const notificationService = {
  getNotifications: async (userId: string | number) => {
    return fetchMany<NotificationType>(API_PATHS.NOTIFICATION, {
      filters: {
        users_permissions_user: {
          id: {
            $eq: userId,
          },
        },
      },
      sort: ['createdAt:desc'],
    });
  },
  
  markAsRead: async (notificationId: string) => {
    return update<NotificationType>(API_PATHS.NOTIFICATION, notificationId, {
      is_read: true,
      read_at: new Date(),
    });
  },
  
  markAllAsRead: async (userId: string | number, notificationIds: string[]) => {
    const promises = notificationIds.map(id => 
      update<NotificationType>(API_PATHS.NOTIFICATION, id, {
        is_read: true,
        read_at: new Date(),
      })
    );
    
    return Promise.all(promises);
  }
};