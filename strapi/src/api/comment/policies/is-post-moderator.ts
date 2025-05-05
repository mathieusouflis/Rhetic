// strapi/src/api/comment/policies/is-post-moderator.ts
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

      const comment = await strapi.entityService.findOne<Comment>(
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
      );

      if (!comment) {
        return ctx.notFound("Commentaire introuvable");
      }

      if (!comment.post) {
        return ctx.badRequest("Ce commentaire n'est pas lié à un post");
      }

      // Vérifier si l'utilisateur est l'auteur du post
      if (comment.post.author && typeof comment.post.author === 'object') {
        if (comment.post.author.id === user.id) {
          return await next();
        }
      }

      // Vérifier si l'utilisateur est le créateur du subrhetic
      if (comment.post.subrhetic && typeof comment.post.subrhetic === 'object') {
        const subrhetic = comment.post.subrhetic;
        
        if (subrhetic.creator && typeof subrhetic.creator === 'object') {
          if (subrhetic.creator.id === user.id) {
            return await next();
          }
        }

        // Vérifier si l'utilisateur est modérateur
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