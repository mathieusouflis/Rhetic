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
          { populate: ['subrhetic', 'subrhetic.moderators', 'subrhetic.creator'] }
        );
  
        if (!post) {
          return ctx.notFound("Post introuvable");
        }
  
        if (!post.subrhetic) {
          return ctx.badRequest("Ce post n'appartient pas à un subrhetic");
        }
  
        if (post.subrhetic.creator && post.subrhetic.creator.id === user.id) {
          return await next();
        }
  
        const isModerator = post.subrhetic.moderators?.some(
          moderator => moderator.id === user.id
        );
  
        if (!isModerator) {
          return ctx.forbidden("Vous n'êtes pas modérateur de ce subrhetic");
        }
  
        return await next();
      } catch (error) {
        ctx.internalServerError(`Erreur dans la politique de modérateur: ${error.message}`);
      }
    };
  };