import { StrapiContext, Comment, Post, Subrhetic, User } from '../../../../types/generated/custom';

interface PolicyContext {
  strapi: any;
  [key: string]: any;
}

export default (policyContext: PolicyContext, config: any, { strapi }: { strapi: any }) => {
  return async (ctx: StrapiContext, next: () => Promise<any>) => {
    try {
      const user = ctx.state.user;
      
      if (!user) {
        return ctx.unauthorized("Vous devez être connecté pour effectuer cette action");
      }

      const commentId = ctx.params.id;
      if (!commentId) {
        return ctx.badRequest("ID du commentaire requis");
      }

      const comment = await strapi.entityService.findOne(
        'api::comment.comment', 
        commentId, 
        { 
          populate: {
            post: {
              populate: {
                subrhetic: {
                  populate: ['moderators', 'creator']
                },
                author: true
              }
            }
          }
        }
      ) as Comment;

      if (!comment) {
        return ctx.notFound("Commentaire introuvable");
      }

      if (!comment.post) {
        return ctx.badRequest("Ce commentaire n'est pas lié à un post");
      }

      const post = typeof comment.post === 'object' ? comment.post : null;
      
      if (!post) {
        return ctx.badRequest("Informations du post manquantes");
      }

      if (post.author && typeof post.author === 'object') {
        if (post.author.id === user.id) {
          return await next();
        }
      }

      if (post.subrhetic && typeof post.subrhetic === 'object') {
        const subrhetic = post.subrhetic;
        
        if (subrhetic.creator && typeof subrhetic.creator === 'object') {
          if (subrhetic.creator.id === user.id) {
            return await next();
          }
        }

        if (subrhetic.moderators && Array.isArray(subrhetic.moderators)) {
          const isModerator = subrhetic.moderators.some((moderator) => {
            const moderatorId = typeof moderator === 'object' 
              ? moderator.id 
              : moderator;
              
            return moderatorId === user.id;
          });

          if (isModerator) {
            return await next();
          }
        }
      }

      return ctx.forbidden("Vous n'avez pas les droits nécessaires pour modérer ce commentaire");
    } catch (error) {
      return ctx.internalServerError(`Erreur dans la politique de modérateur: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
};