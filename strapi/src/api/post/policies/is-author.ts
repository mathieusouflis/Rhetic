// strapi/src/api/post/policies/is-author.ts
import { StrapiContext, Post, User } from '../../../../types/generated/custom';

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
        { populate: ['author'] }
      );

      if (!post) {
        return ctx.notFound("Post introuvable");
      }

      if (post.author) {
        const authorId = typeof post.author === 'object' 
          ? post.author.id 
          : post.author;
        
        if (authorId === user.id) {
          return await next();
        }
      }

      return ctx.forbidden("Vous n'êtes pas l'auteur de ce post");
    } catch (error) {
      return ctx.internalServerError(`Erreur dans la politique d'auteur: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
};