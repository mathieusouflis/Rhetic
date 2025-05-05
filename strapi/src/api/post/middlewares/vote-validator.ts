export default () => {
  return async (ctx, next) => {
    try {
      const { id } = ctx.params;
      const user = ctx.state.user;
      
      if (!user) {
        return ctx.unauthorized("Vous devez être connecté pour voter");
      }
      
      const post = await strapi.entityService.findOne(
        'api::post.post',
        id,
        { populate: { subrhetic: { populate: ['banned_users'] } } }
      );
      
      if (!post) {
        return ctx.notFound("Post introuvable");
      }
      
      if (post.subrhetic && post.subrhetic.banned_users) {
        const isBanned = post.subrhetic.banned_users.some(
          bannedUser => bannedUser.id === user.id
        );
        
        if (isBanned) {
          return ctx.forbidden("Vous êtes banni de ce subrhetic et ne pouvez pas voter");
        }
      }
      
      
      return await next();
    } catch (error) {
      ctx.internalServerError(`Erreur lors de la validation du vote: ${error.message}`);
    }
  };
};