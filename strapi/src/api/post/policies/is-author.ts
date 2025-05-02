export default (policyContext, config, { strapi }) => {
    return async (ctx, next) => {
      try {
        const user = ctx.state.user;
        
        if (!user) {
          return ctx.unauthorized("Vous devez être connecté pour effectuer cette action");
        }
  
        const postId = ctx.params.id;
        if (!postId) {
          return ctx.badRequest("ID du post requis");
        }
  
        const post = await strapi.entityService.findOne(
          'api::post.post', 
          postId, 
          { populate: ['author'] }
        );
  
        if (!post) {
          return ctx.notFound("Post introuvable");
        }
  
        if (post.author && post.author.id === user.id) {
          return await next();
        }
  
        return ctx.forbidden("Vous n'êtes pas l'auteur de ce post");
      } catch (error) {
        ctx.internalServerError(`Erreur dans la politique d'auteur: ${error.message}`);
      }
    };
  };