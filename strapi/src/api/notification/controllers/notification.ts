import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::notification.notification', ({ strapi }) => ({
  async findMine(ctx) {
    try {
      const userId = ctx.state.user?.id;
      
      if (!userId) {
        return ctx.unauthorized("Vous devez être connecté pour voir vos notifications");
      }
      
      const { page = 1, pageSize = 10, unreadOnly = false } = ctx.query;
      
      // Définir un type pour l'objet filters
      const filters: { users_permissions_user: any; is_read?: boolean } = {
        users_permissions_user: userId
      };
      
      if (unreadOnly === 'true' || unreadOnly === true) {
        filters.is_read = false;
      }
      
      const notifications = await strapi.entityService.findMany('api::notification.notification', {
        filters,
        sort: { createdAt: 'desc' },
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize)
        }
      });
      
      const total = await strapi.db.query('api::notification.notification').count({
        where: filters
      });
      
      const unreadCount = await strapi.db.query('api::notification.notification').count({
        where: {
          users_permissions_user: userId,
          is_read: false
        }
      });
      
      return {
        data: notifications,
        meta: {
          pagination: {
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            pageCount: Math.ceil(total / parseInt(pageSize)),
            total
          },
          unreadCount
        }
      };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return ctx.badRequest(`Une erreur est survenue: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
  
  async markAsRead(ctx) {
    try {
      const { id } = ctx.params;
      const userId = ctx.state.user?.id;
      
      if (!userId) {
        return ctx.unauthorized("Vous devez être connecté pour marquer une notification comme lue");
      }
      
      const notification = await strapi.entityService.findOne('api::notification.notification', id, {
        populate: ['users_permissions_user']
      });
      
      if (!notification) {
        return ctx.notFound("Notification introuvable");
      }
      
      const notificationUserId = typeof notification.users_permissions_user === 'object' 
        ? notification.users_permissions_user.id 
        : notification.users_permissions_user;
      
      if (notificationUserId !== userId) {
        return ctx.forbidden("Cette notification ne vous appartient pas");
      }
      
      const updatedNotification = await strapi.entityService.update('api::notification.notification', id, {
        data: {
          is_read: true,
          read_at: new Date()
        }
      });
      
      return updatedNotification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return ctx.badRequest(`Une erreur est survenue: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
  
  async markAllAsRead(ctx) {
    try {
      const userId = ctx.state.user?.id;
      
      if (!userId) {
        return ctx.unauthorized("Vous devez être connecté pour marquer toutes les notifications comme lues");
      }
      
      const notifications = await strapi.entityService.findMany('api::notification.notification', {
        filters: {
          users_permissions_user: userId,
          is_read: false
        }
      });
      
      if (!notifications || notifications.length === 0) {
        return { success: true, message: "Aucune notification à marquer comme lue" };
      }
      
      const now = new Date();
      
      for (const notification of notifications) {
        await strapi.entityService.update('api::notification.notification', notification.id, {
          data: {
            is_read: true,
            read_at: now
          }
        });
      }
      
      return { 
        success: true, 
        message: "Toutes les notifications ont été marquées comme lues",
        count: notifications.length
      };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return ctx.badRequest(`Une erreur est survenue: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
  
  async createNotification(type, userId, referenceType, referenceId, content) {
    try {
      const notification = await strapi.entityService.create('api::notification.notification', {
        data: {
          type,
          users_permissions_user: userId,
          reference_type: referenceType,
          reference_id: referenceId,
          content: JSON.stringify(content),
          is_read: false,
          publishedAt: new Date()
        }
      });
      
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  }
}));