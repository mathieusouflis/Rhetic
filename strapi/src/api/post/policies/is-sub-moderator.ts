// strapi/src/api/post/policies/is-sub-moderator.ts
import { StrapiContext, Post, Subrhetic, User } from '../../../../types/generated/custom';

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

      const postId = ctx.params.id;
      if (!postId) {
        return ctx.badRequest("ID du post requis");
      }

      const post = await strapi.entityService.findOne<Post>(
        'api::post.post', 
        postId, 
        { 
          populate: {
            subrhetic: {
              populate: ['moderators', 'creator']
            }
          }
        }
      );

      if (!post) {
        return ctx.notFound("Post introuvable");
      }

      if (!post.subrhetic) {
        return ctx.badRequest("Ce post n'appartient pas à un subrhetic");
      }
      
      const subrhetic = typeof post.subrhetic === 'object' ? post.subrhetic : null;
      
      if (!subrhetic) {
        return ctx.badRequest("Information du subrhetic manquante");
      }

      // Vérifier si l'utilisateur est le créateur
      if (subrhetic.creator) {
        const creatorId = typeof subrhetic.creator === 'object' 
          ? subrhetic.creator.id 
          : subrhetic.creator;
        
        if (creatorId === user.id) {
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

      return ctx.forbidden("Vous n'êtes pas modérateur de ce subrhetic");
    } catch (error) {
      return ctx.internalServerError(`Erreur dans la politique de modérateur: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
};