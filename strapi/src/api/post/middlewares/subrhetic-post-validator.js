export default () => {
    return async (ctx, next) => {
      try {
        const { subrhetic } = ctx.request.body.data;
        const user = ctx.state.user;
        
        if (!user) {
          return ctx.unauthorized("Vous devez être connecté pour publier");
        }
        
        if (!subrhetic) {
          return ctx.badRequest("Vous devez sélectionner un subrhetic");
        }
        
        // @ts-ignore 
        const subData = await strapi.entityService.findOne('api::subrhetic.subrhetic', subrhetic, {
          populate: ['banned_users', 'members']
        });
        
        if (!subData) {
          return ctx.notFound("Subrhetic introuvable");
        }
        
        const isBanned = subData.banned_users?.some(
          bannedUser => bannedUser.id === user.id
        );
        
        if (isBanned) {
          return ctx.forbidden("Vous êtes banni de ce subrhetic");
        }
        
        if (subData.members?.length > 0) {
          const isMember = subData.members.some(
            member => member.id === user.id
          );
          
          if (!isMember) {
            return ctx.forbidden("Vous devez rejoindre ce subrhetic avant de publier");
          }
        }
        
        return await next();
      } catch (error) {
        ctx.internalServerError(`Erreur lors de la validation du post: ${error.message}`);
      }
    };
  };