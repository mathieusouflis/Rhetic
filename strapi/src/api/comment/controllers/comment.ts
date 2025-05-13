import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::comment.comment', ({ strapi }) => ({
  async create(ctx) {
    const { data } = ctx.request.body;
    const userId = ctx.state.user?.id;
    
    if (!userId) {
      return ctx.unauthorized("Vous devez être connecté pour créer un commentaire");
    }
    
    const entity = await strapi.entityService.create('api::comment.comment', {
      data: {
        ...data,
        author: userId,
        publishedDate: new Date(),
      },
      populate: ['author']
    });
    
    return entity;
  },
  
  async delete(ctx) {
    try {
      const { id } = ctx.params;
      const userId = ctx.state.user?.id;
      
      if (!userId) {
        return ctx.unauthorized("Vous devez être connecté pour supprimer un commentaire");
      }
      
      const comment = await strapi.entityService.findOne('api::comment.comment', id, {
        populate: ['author', 'post.subrhetic']
      });
      
      if (!comment) {
        return ctx.notFound("Commentaire introuvable");
      }

      const authorId = typeof comment.author === 'object' ? comment.author.id : comment.author;
      
      const deletedEntity = await strapi.entityService.delete('api::comment.comment', id);
      
      if (authorId !== userId) {
        try {
          let context = 'la plateforme';
          
          if (comment.post && typeof comment.post === 'object' && comment.post.subrhetic && typeof comment.post.subrhetic === 'object') {
            context = comment.post.subrhetic.name;
          }

          await strapi.entityService.create('api::notification.notification', {
            data: {
              type: 'mod_action',
              content: JSON.stringify({
                action: 'comment_deleted',
                context: context,
                deletedBy: userId
              }),
              is_read: false,
              users_permissions_user: authorId,
              reference_type: 'comment',
              reference_id: id
            }
          });
          
          if (comment.post && typeof comment.post === 'object' && comment.post.subrhetic) {
            const subrheticId = typeof comment.post.subrhetic === 'object'
              ? comment.post.subrhetic.id
              : comment.post.subrhetic;
              
            await strapi.entityService.create('api::moderation-action.moderation-action', {
              data: {
                action_type: 'comment_removed',
                target_id: id,
                target_type: 'comment',
                users_permissions_user: userId,
                subrhetic: subrheticId,
                details: JSON.stringify({
                  commentAuthor: authorId,
                  postId: typeof comment.post === 'object' ? comment.post.id : comment.post
                })
              }
            });
          }
        } catch (error) {
          console.error('Erreur lors de la création de la notification:', error);
        }
      }
      
      return deletedEntity;
    } catch (error) {
      console.error("Erreur lors de la suppression du commentaire:", error);
      return ctx.badRequest(`Une erreur est survenue: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}));