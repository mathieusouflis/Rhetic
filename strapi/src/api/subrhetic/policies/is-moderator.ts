import { StrapiContext } from '../../../../types/generated/custom';

export default (policyContext: any, config: any, { strapi }: any) => {
  return async (ctx: StrapiContext, next: () => Promise<any>) => {
    try {
      const user = ctx.state.user;
      
      if (!user) {
        return ctx.unauthorized("Vous devez être connecté pour effectuer cette action");
      }

      const subId = ctx.params.id;
      if (!subId) {
        return ctx.badRequest("ID du Subrhetic requis");
      }

      const subrhetic = await strapi.entityService.findOne(
        'api::subrhetic.subrhetic', 
        subId, 
        { populate: ['moderators', 'creator'] }
      );

      if (!subrhetic) {
        return ctx.notFound("Subrhetic non trouvé");
      }

      if (subrhetic.creator && subrhetic.creator.id === user.id) {
        return await next();
      }

      const isModerator = subrhetic.moderators?.some(
        (moderator: any) => moderator.id === user.id
      );

      if (!isModerator) {
        return ctx.forbidden("Vous n'êtes pas modérateur de ce subrhetic");
      }

      return await next();
    } catch (error: any) {
      ctx.internalServerError(`Erreur dans la politique de modérateur: ${error.message}`);
    }
  };
};