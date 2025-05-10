const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::user-follow.user-follow', ({ strapi }) => ({
  async follow(ctx) {
    const { targetUserId } = ctx.request.body;
    const currentUserId = ctx.state.user.id;
    
    if (!targetUserId) {
      return ctx.badRequest('targetUserId is required');
    }
    
    if (targetUserId == currentUserId) {
      return ctx.badRequest("You cannot follow yourself");
    }
    
    const existingFollow = await strapi.entityService.findMany('api::user-follow.user-follow', {
      filters: {
        follower: currentUserId,
        following: targetUserId
      }
    });
    
    if (existingFollow.length > 0) {
      return ctx.badRequest('You are already following this user');
    }
    
    const follow = await strapi.entityService.create('api::user-follow.user-follow', {
      data: {
        follower: currentUserId,
        following: targetUserId
      }
    });
    
    return ctx.send({ 
      message: 'User followed successfully',
      followed: true
    });
  },
  
  async unfollow(ctx) {
    const { targetUserId } = ctx.request.body;
    const currentUserId = ctx.state.user.id;
    
    if (!targetUserId) {
      return ctx.badRequest('targetUserId is required');
    }
    
    const existingFollow = await strapi.entityService.findMany('api::user-follow.user-follow', {
      filters: {
        follower: currentUserId,
        following: targetUserId
      }
    });
    
    if (existingFollow.length === 0) {
      return ctx.badRequest('You are not following this user');
    }
    
    await strapi.entityService.delete('api::user-follow.user-follow', existingFollow[0].id);
    
    return ctx.send({ 
      message: 'User unfollowed successfully',
      followed: false
    });
  }
}));