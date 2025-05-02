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
          { populate: ['post', 'post.subrhetic', 'post.subrhetic.moderators', 'post.subrhetic.creator', 'post.author'] }
        );
  
        if (!comment) {
          return ctx.notFound("Commentaire introuvable");
        }
  
        if (!comment.post) {
          return ctx.badRequest("Ce commentaire n'est pas lié à un post");
        }
  
        if (comment.post.author && comment.post.author.id === user.id) {
          return await next();
        }
  
        if (comment.post.subrhetic) {
          if (comment.post.subrhetic.creator && comment.post.subrhetic.creator.id === user.id) {
            return await next();
          }
  
          const isModerator = comment.post.subrhetic.moderators?.some(
            moderator => moderator.id === user.id
          );
  
          if (isModerator) {
            return await next();
          }
        }
  
        return ctx.forbidden("Vous n'avez pas les droits nécessaires pour modérer ce commentaire");
      } catch (error) {
        ctx.internalServerError(`Erreur dans la politique de modérateur: ${error.message}`);
      }
    };
  };