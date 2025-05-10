import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::comment.comment', ({ strapi }) => ({
  async create(ctx) {
    try {
      const { data } = ctx.request.body;
      const { content, post, parent } = data;
      const userId = ctx.state.user?.id;
      
      if (!userId) {
        return ctx.unauthorized("Vous devez être connecté pour créer un commentaire");
      }
      
      if (post) {
        const postExists = await strapi.entityService.findOne('api::post.post', post, {
          populate: ['subrhetic.banned_users']
        });
        
        if (!postExists) {
          return ctx.notFound("Le post spécifié n'existe pas");
        }
        
        if (postExists.subrhetic && postExists.subrhetic.banned_users) {
          const isBanned = postExists.subrhetic.banned_users.some(bannedUser => 
            (typeof bannedUser === 'object' ? bannedUser.id : bannedUser) === userId
          );
          
          if (isBanned) {
            return ctx.forbidden("Vous êtes banni de ce subrhetic et ne pouvez pas commenter");
          }
        }
      }
      
      if (parent) {
        const parentComment = await strapi.entityService.findOne('api::comment.comment', parent);
        
        if (!parentComment) {
          return ctx.notFound("Le commentaire parent spécifié n'existe pas");
        }
      }
      
      const entity = await strapi.entityService.create('api::comment.comment', {
        data: {
          content,
          author: userId,
          post,
          parent,
          publishedDate: new Date(),
        },
        populate: ['author']
      });
      
      try {
        await strapi.entityService.create('api::user-activity-log.user-activity-log', {
          data: {
            users_permissions_user: userId,
            activity_type: 'comment_create',
            item_id: entity.id,
            item_type: 'comment',
            ip_adress: ctx.request.ip,
            user_agent: ctx.request.header['user-agent']
          }
        });
      } catch (error) {
        console.error("Erreur lors de la création du log d'activité:", error);
      }
      
      return entity;
    } catch (error) {
      console.error("Erreur lors de la création du commentaire:", error);
      return ctx.badRequest(`Une erreur est survenue: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}));