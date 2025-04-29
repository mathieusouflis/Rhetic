/**
 * `is-moderator` policy
 * Checks if the current user is a moderator of the subrhetic being modified
 */

export default (policyContext, config, { strapi }) => {
    return async (ctx, next) => {
      try {
        const user = ctx.state.user;
        
        if (!user) {
          return ctx.unauthorized("You need to be logged in to perform this action");
        }
  
        const subId = ctx.params.id;
        if (!subId) {
          return ctx.badRequest("Subrhetic ID is required");
        }
  
        const subrhetic = await strapi.entityService.findOne(
          'api::subrhetic.subrhetic', 
          subId, 
          { populate: ['moderators', 'creator'] }
        );
  
        if (!subrhetic) {
          return ctx.notFound("Subrhetic not found");
        }
  
        if (subrhetic.creator && subrhetic.creator.id === user.id) {
          return await next();
        }
  
        const isModerator = subrhetic.moderators?.some(
          moderator => moderator.id === user.id
        );
  
        if (!isModerator) {
          return ctx.forbidden("You are not a moderator of this subrhetic");
        }
  
        return await next();
      } catch (error) {
        ctx.internalServerError(`Error in moderator policy: ${error.message}`);
      }
    };
  };