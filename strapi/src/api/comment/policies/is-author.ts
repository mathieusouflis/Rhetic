export default (policyContext, config, { strapi }) => {
    return async (ctx, next) => {
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
          { populate: ['author'] }
        );
  
        if (!comment) {
          return ctx.notFound("Commentaire introuvable");
        }
  
        if (comment.author && comment.author.id === user.id) {
          return await next();
        }
  
        return ctx.forbidden("Vous n'êtes pas l'auteur de ce commentaire");
      } catch (error) {
        ctx.internalServerError(`Erreur dans la politique d'auteur: ${error.message}`);
      }
    };
  };