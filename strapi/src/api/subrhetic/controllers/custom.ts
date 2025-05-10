import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::subrhetic.subrhetic', ({ strapi }) => ({
  async create(ctx) {
    const { data } = ctx.request.body;
    const creatorId = ctx.state.user.id;
    
    if (!data.creator) {
      data.creator = creatorId;
    }
    
    const entity = await strapi.entityService.create('api::subrhetic.subrhetic', {
      data: data
    });
    
    if (entity && entity.id) {
      const subrhetic = await strapi.entityService.findOne('api::subrhetic.subrhetic', entity.id, {
        populate: ['members', 'moderators']
      });
      
      const currentMembers = subrhetic.members?.map(member => 
        typeof member === 'object' ? member.id : member
      ) || [];
      
      const currentModerators = subrhetic.moderators?.map(moderator => 
        typeof moderator === 'object' ? moderator.id : moderator
      ) || [];
      
      if (!currentMembers.includes(creatorId)) {
        currentMembers.push(creatorId);
      }
      
      if (!currentModerators.includes(creatorId)) {
        currentModerators.push(creatorId);
      }
      
      await strapi.entityService.update('api::subrhetic.subrhetic', entity.id, {
        data: {
          members: currentMembers,
          moderators: currentModerators
        }
      });
    }
    
    const updatedEntity = await strapi.entityService.findOne('api::subrhetic.subrhetic', entity.id, {
      populate: ['members', 'creator', 'moderators']
    });
    
    try {
      await strapi.entityService.create('api::user-activity-log.user-activity-log', {
        data: {
          users_permissions_user: creatorId,
          activity_type: 'subrhetic_create',
          item_id: entity.id,
          item_type: 'subrhetic',
          ip_adress: ctx.request.ip,
          user_agent: ctx.request.header['user-agent']
        }
      });
    } catch (error) {
      console.error("Erreur lors de la création du log d'activité:", error);
    }
    
    return updatedEntity;
  }
}));