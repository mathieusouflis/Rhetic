/**
 * Subrhetic moderator controller 
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::subrhetic.subrhetic', ({ strapi }) => ({
  async addModerator(ctx) {
    try {
      const { id } = ctx.params;
      const { userId } = ctx.request.body;
      
      if (!userId) {
        return ctx.badRequest('User ID is required');
      }
      
      const user = await strapi.entityService.findOne('plugin::users-permissions.user', userId);
      if (!user) {
        return ctx.notFound('User not found');
      }
      
      // @ts-ignore 
      const subrhetic = await strapi.entityService.findOne('api::subrhetic.subrhetic', id, {
        populate: '*',
      });
      
      if (!subrhetic) {
        return ctx.notFound('Subrhetic not found');
      }
      
      console.log('Subrhetic structure:', JSON.stringify(subrhetic, null, 2));
      
      const subrheticAny = subrhetic as any;
      
      let moderatorField = null;
      let moderators = null;
      
      if (Array.isArray(subrheticAny.moderator)) {
        moderatorField = 'moderator';
        moderators = subrheticAny.moderator;
      } else if (Array.isArray(subrheticAny.moderators)) {
        moderatorField = 'moderators';
        moderators = subrheticAny.moderators;
      } else if (Array.isArray(subrheticAny.Moderator)) {
        moderatorField = 'Moderator';
        moderators = subrheticAny.Moderator;
      } else if (Array.isArray(subrheticAny.Moderators)) {
        moderatorField = 'Moderators';
        moderators = subrheticAny.Moderators;
      } else {
        const fieldsToTry = ['moderator', 'moderators', 'Moderator', 'Moderators'];
        for (const field of fieldsToTry) {
          if (field in subrheticAny) {
            moderatorField = field;
            moderators = subrheticAny[field] || [];
            break;
          }
        }
      }
      
      if (!moderatorField) {
        moderatorField = 'moderator';
        moderators = [];
        console.warn(`No moderator field found, defaulting to '${moderatorField}'`);
      }
      
      const isModerator = Array.isArray(moderators) && 
        moderators.some(mod => mod.id === parseInt(userId));
      
      if (isModerator) {
        return ctx.badRequest('User is already a moderator');
      }
      
      const updateData = {};
      // @ts-ignore 
      updateData[moderatorField] = { connect: [userId] };
      
      // @ts-ignore 
      const updatedSubrhetic = await strapi.entityService.update('api::subrhetic.subrhetic', id, {
        data: updateData,
        populate: '*',
      });
      
      return this.sanitizeOutput(updatedSubrhetic, ctx);
    } catch (error) {
      console.error('Error in addModerator:', error);
      return ctx.badRequest(`An error occurred: ${error.message}`);
    }
  },
  
  async removeModerator(ctx) {
    try {
      const { id } = ctx.params;
      const { userId } = ctx.request.body;
      
      if (!userId) {
        return ctx.badRequest('User ID is required');
      }
      
      // @ts-ignore 
      const subrhetic = await strapi.entityService.findOne('api::subrhetic.subrhetic', id, {
        populate: '*',
      });
      
      if (!subrhetic) {
        return ctx.notFound('Subrhetic not found');
      }
      
      console.log('Subrhetic structure:', JSON.stringify(subrhetic, null, 2));
      
      const subrheticAny = subrhetic as any;
      
      let moderatorField = null;
      let moderators = null;
      
      if (Array.isArray(subrheticAny.moderator)) {
        moderatorField = 'moderator';
        moderators = subrheticAny.moderator;
      } else if (Array.isArray(subrheticAny.moderators)) {
        moderatorField = 'moderators';
        moderators = subrheticAny.moderators;
      } else if (Array.isArray(subrheticAny.Moderator)) {
        moderatorField = 'Moderator';
        moderators = subrheticAny.Moderator;
      } else if (Array.isArray(subrheticAny.Moderators)) {
        moderatorField = 'Moderators';
        moderators = subrheticAny.Moderators;
      } else {
        const fieldsToTry = ['moderator', 'moderators', 'Moderator', 'Moderators'];
        for (const field of fieldsToTry) {
          if (field in subrheticAny) {
            moderatorField = field;
            moderators = subrheticAny[field] || [];
            break;
          }
        }
      }
      
      if (!moderatorField) {
        moderatorField = 'moderator';
        moderators = [];
        console.warn(`No moderator field found, defaulting to '${moderatorField}'`);
      }
      
      let creatorField = null;
      let creator = null;
      
      const creatorFieldsToTry = ['creator', 'Creator', 'users_permissions_user', 'user', 'User'];
      for (const field of creatorFieldsToTry) {
        if (subrheticAny[field]) {
          creatorField = field;
          creator = subrheticAny[field];
          break;
        }
      }
      
      const isModerator = Array.isArray(moderators) && 
        moderators.some(mod => mod.id === parseInt(userId));
      
      if (!isModerator) {
        return ctx.badRequest('User is not a moderator');
      }
      
      if (creatorField && creator && creator.id === parseInt(userId)) {
        return ctx.badRequest('Cannot remove the creator as moderator');
      }
      
      const updateData = {};
      // @ts-ignore 
      updateData[moderatorField] = { disconnect: [userId] };
      
      // @ts-ignore 
      const updatedSubrhetic = await strapi.entityService.update('api::subrhetic.subrhetic', id, {
        data: updateData,
        populate: '*',
      });
      
      return this.sanitizeOutput(updatedSubrhetic, ctx);
    } catch (error) {
      console.error('Error in removeModerator:', error);
      return ctx.badRequest(`An error occurred: ${error.message}`);
    }
  },
}));