'use strict';

module.exports = ({ strapi }) => ({
  async getSession(ctx) {
    const { user } = ctx.state;
    
    if (!user) {
      return ctx.unauthorized('Vous devez être connecté');
    }
    
    try {
      const liveblocksService = strapi.plugin('liveblocks').service('liveblocks');
      const session = await liveblocksService.createLiveblocksSession(user.id.toString());
      return session;
    } catch (error) {
      strapi.log.error('Error creating Liveblocks session:', error);
      return ctx.badRequest('Erreur lors de la création de la session Liveblocks');
    }
  },

  async testNotification(ctx) {
    const { user } = ctx.state;
    
    if (!user) {
      return ctx.unauthorized('Vous devez être connecté');
    }
    
    try {
      const notification = await strapi.entityService.create('api::notification.notification', {
        data: {
          type: 'system',
          content: JSON.stringify({
            message: 'Ceci est une notification de test',
            title: 'Test de notification'
          }),
          users_permissions_user: user.id,
          is_read: false,
          publishedAt: new Date(),
        },
      });
      
      const liveblocksService = strapi.plugin('liveblocks').service('liveblocks');
      const delivered = await liveblocksService.broadcastNotification(user.id.toString(), {
        id: notification.id,
        type: notification.type,
        content: notification.content,
        createdAt: notification.createdAt
      });
      
      if (delivered) {
        await strapi.entityService.update('api::notification.notification', notification.id, {
          data: {
            liveblocks_delivered: true
          }
        });
      }
      
      return { success: true, notification, delivered };
    } catch (error) {
      strapi.log.error('Error testing notification:', error);
      return ctx.badRequest('Erreur lors du test de notification');
    }
  }
});