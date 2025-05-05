import { factories } from '@strapi/strapi';
import { StrapiContext, Subrhetic, User } from '../../../../types/generated/custom';

export default factories.createCoreController('api::subrhetic.subrhetic', ({ strapi, nexus }) => ({
  async join(ctx: StrapiContext) {
    try {
      const { id } = ctx.params;
      const userId = ctx.state.user?.id;
      
      if (!userId) {
        return ctx.unauthorized("Vous devez être connecté pour rejoindre un subrhetic");
      }
      
      // Supprimer le type générique <Subrhetic>
      const subrhetic = await strapi.entityService.findOne(
        'api::subrhetic.subrhetic', 
        id, 
        { populate: ['members', 'banned_users'] }
      );
      
      if (!subrhetic) {
        return ctx.notFound("Subrhetic introuvable");
      }
      
      if (subrhetic.banned_users && Array.isArray(subrhetic.banned_users)) {
        const isBanned = subrhetic.banned_users.some((user) => {
          const bannedId = typeof user === 'object' ? user.id : user;
          return bannedId === userId;
        });
        
        if (isBanned) {
          return ctx.forbidden("Vous êtes banni de ce subrhetic");
        }
      }
      
      if (subrhetic.members && Array.isArray(subrhetic.members)) {
        const isMember = subrhetic.members.some((user) => {
          const memberId = typeof user === 'object' ? user.id : user;
          return memberId === userId;
        });
        
        if (isMember) {
          return ctx.badRequest("Vous êtes déjà membre de ce subrhetic");
        }
      }
      
      // Supprimer le type générique <Subrhetic>
      const updatedSubrhetic = await strapi.entityService.update(
        'api::subrhetic.subrhetic', 
        id, 
        {
          data: {
            members: { connect: [userId] }
          },
          populate: ['members']
        }
      );
      
      return nexus.sanitizeOutput(updatedSubrhetic, ctx);
    } catch (error) {
      console.error('Erreur lors de l\'adhésion au subrhetic:', error);
      return ctx.badRequest(`Une erreur est survenue: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
  
  // Appliquer les mêmes corrections au reste des méthodes
  // ...
}));