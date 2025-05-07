module.exports = {
    async afterCreate(event) {
      const { result } = event;
      
      if (result.users_permissions_user) {
        try {
          const liveblocksService = strapi.plugin('liveblocks').service('liveblocks');
          
          const userId = typeof result.users_permissions_user === 'object' 
            ? result.users_permissions_user.id 
            : result.users_permissions_user;
          
          if (!userId) {
            strapi.log.error('Erreur lors de l\'envoi de notification via Liveblocks: Aucun ID utilisateur trouvé');
            return;
          }
          
          const notificationData = {
            id: result.id,
            documentId: result.id,
            type: result.type,
            content: result.content,
            createdAt: result.createdAt,
            reference_id: result.reference_id,
            reference_type: result.reference_type,
            is_read: false
          };
          
          const delivered = await liveblocksService.broadcastNotification(userId.toString(), notificationData);
          
          if (delivered) {
            await strapi.entityService.update('api::notification.notification', result.id, {
              data: {
                liveblocks_delivered: true
              }
            });
          }
        } catch (error) {
          strapi.log.error('Erreur lors de l\'envoi de notification via Liveblocks:', error);
        }
      }
    }
  };