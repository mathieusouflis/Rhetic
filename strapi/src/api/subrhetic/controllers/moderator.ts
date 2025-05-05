import { factories } from '@strapi/strapi';
import { StrapiContext, Subrhetic, User } from '../../../../types/generated/custom';

export default factories.createCoreController('api::subrhetic.subrhetic', ({ strapi }) => ({
  async addModerator(ctx: StrapiContext) {
    try {
      const { id } = ctx.params;
      const { userId } = ctx.request.body?.data || ctx.request.body || {};
      
      if (!userId) {
        return ctx.badRequest('User ID is required');
      }
      
      const userIdNumber = parseInt(userId);
      
      if (isNaN(userIdNumber)) {
        return ctx.badRequest('User ID invalide');
      }
      
      const user = await strapi.entityService.findOne<User>(
        'plugin::users-permissions.user', 
        userIdNumber
      );
      
      if (!user) {
        return ctx.notFound('User not found');
      }
      
      const subrhetic = await strapi.entityService.findOne<Subrhetic>(
        'api::subrhetic.subrhetic', 
        id, 
        {
          populate: ['moderators']
        }
      );
      
      if (!subrhetic) {
        return ctx.notFound('Subrhetic not found');
      }
      
      if (subrhetic.moderators && Array.isArray(subrhetic.moderators)) {
        const isModerator = subrhetic.moderators.some((mod) => {
          const modId = typeof mod === 'object' ? mod.id : mod;
          return modId === userIdNumber;
        });
        
        if (isModerator) {
          return ctx.badRequest('User is already a moderator');
        }
      }
      
      const updatedSubrhetic = await strapi.entityService.update<Subrhetic>(
        'api::subrhetic.subrhetic', 
        id, 
        {
          data: {
            moderators: { connect: [userIdNumber] }
          },
          populate: ['moderators']
        }
      );
      
      return this.sanitizeOutput(updatedSubrhetic, ctx);
    } catch (error) {
      console.error('Error in addModerator:', error);
      return ctx.badRequest(`An error occurred: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
  
  async removeModerator(ctx: StrapiContext) {
    try {
      const { id } = ctx.params;
      const { userId } = ctx.request.body?.data || ctx.request.body || {};
      
      if (!userId) {
        return ctx.badRequest('User ID is required');
      }
      
      const userIdNumber = parseInt(userId);
      
      if (isNaN(userIdNumber)) {
        return ctx.badRequest('User ID invalide');
      }
      
      const subrhetic = await strapi.entityService.findOne<Subrhetic>(
        'api::subrhetic.subrhetic', 
        id, 
        {
          populate: ['moderators', 'creator']
        }
      );
      
      if (!subrhetic) {
        return ctx.notFound('Subrhetic not found');
      }
      
      if (subrhetic.creator) {
        const creatorId = typeof subrhetic.creator === 'object' 
          ? subrhetic.creator.id 
          : subrhetic.creator;
          
        if (creatorId === userIdNumber) {
          return ctx.badRequest('Cannot remove the creator as moderator');
        }
      }
      
      let isModerator = false;
      
      if (subrhetic.moderators && Array.isArray(subrhetic.moderators)) {
        isModerator = subrhetic.moderators.some((mod) => {
          const modId = typeof mod === 'object' ? mod.id : mod;
          return modId === userIdNumber;
        });
      }
      
      if (!isModerator) {
        return ctx.badRequest('User is not a moderator');
      }
      
      const updatedSubrhetic = await strapi.entityService.update<Subrhetic>(
        'api::subrhetic.subrhetic', 
        id, 
        {
          data: {
            moderators: { disconnect: [userIdNumber] }
          },
          populate: ['moderators']
        }
      );
      
      return this.sanitizeOutput(updatedSubrhetic, ctx);
    } catch (error) {
      console.error('Error in removeModerator:', error);
      return ctx.badRequest(`An error occurred: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
}));