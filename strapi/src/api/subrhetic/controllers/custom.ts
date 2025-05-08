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
        populate: ['members']
      });
      
      const currentMembers = subrhetic.members?.map(member => 
        typeof member === 'object' ? member.id : member
      ) || [];
      
      if (!currentMembers.includes(creatorId)) {
        currentMembers.push(creatorId);
        
        await strapi.entityService.update('api::subrhetic.subrhetic', entity.id, {
          data: {
            members: currentMembers
          }
        });
      }
    }
    
    const updatedEntity = await strapi.entityService.findOne('api::subrhetic.subrhetic', entity.id, {
      populate: ['members', 'creator']
    });
    
    return updatedEntity;
  }
}));