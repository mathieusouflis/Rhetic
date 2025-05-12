import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::vote.vote', ({ strapi }) => ({
  async upvote(ctx) {
    try {
      const { id } = ctx.params;
      const userId = ctx.state.user?.id;
      
      if (!userId) {
        return ctx.unauthorized("Vous devez être connecté pour voter");
      }
      
      const post = await strapi.db.query('api::post.post').findOne({
        where: { id },
        populate: ['subrhetic.banned_users']
      });
      
      if (!post) {
        return ctx.notFound("Post introuvable");
      }
      
      if (post.subrhetic && post.subrhetic.banned_users) {
        const isBanned = post.subrhetic.banned_users.some(
          (banned) => typeof banned === 'object' ? banned.id === userId : banned === userId
        );
        
        if (isBanned) {
          return ctx.forbidden("Vous êtes banni de ce subrhetic et ne pouvez pas voter");
        }
      }
      
      const existingVote = await strapi.db.query('api::vote.vote').findOne({
        where: {
          post: id,
          user: userId
        }
      });
      
      if (existingVote) {
        if (existingVote.type === 'upvote') {
          await strapi.db.query('api::vote.vote').delete({
            where: { id: existingVote.id }
          });
        } else {
          await strapi.db.query('api::vote.vote').update({
            where: { id: existingVote.id },
            data: { type: 'upvote' }
          });
        }
      } else {
        await strapi.db.query('api::vote.vote').create({
          data: {
            type: 'upvote',
            user: userId,
            post: id
          }
        });
      }
      
      const votes = await strapi.db.query('api::vote.vote').findMany({
        where: { post: id }
      });
      
      const upvotes = votes.filter(vote => vote.type === 'upvote').length;
      const downvotes = votes.filter(vote => vote.type === 'downvote').length;
      
      await strapi.db.query('api::post.post').update({
        where: { id },
        data: {
          upvotes,
          downvotes,
          total_votes: upvotes - downvotes
        }
      });
      
      const updatedPost = await strapi.db.query('api::post.post').findOne({
        where: { id },
      });
      
      return updatedPost;
    } catch (error) {
      console.error('Error in post upvote:', error);
      return ctx.badRequest(`An error occurred: ${error.message || error}`);
    }
  },
  
  async downvote(ctx) {
    try {
      const { id } = ctx.params;
      const userId = ctx.state.user?.id;
      
      if (!userId) {
        return ctx.unauthorized("Vous devez être connecté pour voter");
      }
      
      const post = await strapi.db.query('api::post.post').findOne({
        where: { id },
        populate: ['subrhetic.banned_users']
      });
      
      if (!post) {
        return ctx.notFound("Post introuvable");
      }
      
      if (post.subrhetic && post.subrhetic.banned_users) {
        const isBanned = post.subrhetic.banned_users.some(
          (banned) => typeof banned === 'object' ? banned.id === userId : banned === userId
        );
        
        if (isBanned) {
          return ctx.forbidden("Vous êtes banni de ce subrhetic et ne pouvez pas voter");
        }
      }
      
      const existingVote = await strapi.db.query('api::vote.vote').findOne({
        where: {
          post: id,
          user: userId
        }
      });
      
      if (existingVote) {
        if (existingVote.type === 'downvote') {
          await strapi.db.query('api::vote.vote').delete({
            where: { id: existingVote.id }
          });
        } else {
          await strapi.db.query('api::vote.vote').update({
            where: { id: existingVote.id },
            data: { type: 'downvote' }
          });
        }
      } else {
        await strapi.db.query('api::vote.vote').create({
          data: {
            type: 'downvote',
            user: userId,
            post: id
          }
        });
      }
      
      const votes = await strapi.db.query('api::vote.vote').findMany({
        where: { post: id }
      });
      
      const upvotes = votes.filter(vote => vote.type === 'upvote').length;
      const downvotes = votes.filter(vote => vote.type === 'downvote').length;
      
      await strapi.db.query('api::post.post').update({
        where: { id },
        data: {
          upvotes,
          downvotes,
          total_votes: upvotes - downvotes
        }
      });
      
      const updatedPost = await strapi.db.query('api::post.post').findOne({
        where: { id },
      });
      
      return updatedPost;
    } catch (error) {
      console.error('Error in post downvote:', error);
      return ctx.badRequest(`An error occurred: ${error.message || error}`);
    }
  },
}));