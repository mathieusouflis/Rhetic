import { StrapiContext, Subrhetic, User } from '../../../../types/generated/custom';

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

      const subId = ctx.params.id;
      if (!subId) {
        return ctx.badRequest("ID du Subrhetic requis");
      }

      const subrhetic = await strapi.entityService.findOne(
        'api::subrhetic.subrhetic', 
        subId, 
        { populate: ['moderators', 'creator'] }
      ) as Subrhetic;

      if (!subrhetic) {
        return ctx.notFound("Subrhetic non trouvé");
      }

      if (subrhetic.creator) {
        const creatorId = typeof subrhetic.creator === 'object' 
          ? subrhetic.creator.id 
          : subrhetic.creator;
        
        if (creatorId === user.id) {
          return await next();
        }
      }

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