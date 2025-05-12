import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::post.post', ({ strapi }) => ({
  async upvote(ctx) {
    try {
      const { id } = ctx.params;
      const userId = ctx.state.user?.id;
      
      if (!userId) {
        return ctx.unauthorized("Vous devez être connecté pour voter");
      }
      
      const post = await strapi.entityService.findOne(
        'api::post.post',
        id,
        { populate: ['author', 'subrhetic.banned_users'] }
      );
      
      if (!post) {
        return ctx.notFound("Post introuvable");
      }
      
      if (post.subrhetic && typeof post.subrhetic === 'object') {
        const subrhetic = post.subrhetic;
        
        if (subrhetic.banned_users && Array.isArray(subrhetic.banned_users)) {
          const isBanned = subrhetic.banned_users.some(
            (banned: any) => {
              const bannedId = typeof banned === 'object' ? banned.id : banned;
              return bannedId === userId;
            }
          );
          
          if (isBanned) {
            return ctx.forbidden("Vous êtes banni de ce subrhetic et ne pouvez pas voter");
          }
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
          await strapi.entityService.delete('api::vote.vote', existingVote.id);
        } else {
          await strapi.entityService.update('api::vote.vote', existingVote.id, {
            data: { type: 'upvote' }
          });
        }
      } else {
        await strapi.entityService.create('api::vote.vote', {
          data: {
            type: 'upvote',
            user: userId,
            post: id
          }
        });
      }
      
      const allVotes = await strapi.db.query('api::vote.vote').findMany({
        where: { post: id }
      });
      
      const upvotes = allVotes.filter(vote => vote.type === 'upvote').length;
      const downvotes = allVotes.filter(vote => vote.type === 'downvote').length;
      
      const updatedPost = await strapi.entityService.update('api::post.post', id, {
        data: {
          upvotes,
          downvotes,
          total_votes: upvotes - downvotes
        }
      });
      
      const milestones = [100, 500, 1000, 5000, 10000];
      if (post.author) {
        const authorId = typeof post.author === 'object' ? post.author.id : post.author;
        
        if (milestones.includes(upvotes)) {
          await strapi.notification.createNotification(
            'like_milestone',
            authorId,
            'post',
            id,
            {
              contentType: 'post',
              milestone: upvotes
            }
          );
        }
      }
      
      return updatedPost;
    } catch (error) {
      console.error('Error in post upvote:', error);
      return ctx.badRequest(`An error occurred: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
  
  async downvote(ctx) {
    try {
      const { id } = ctx.params;
      const userId = ctx.state.user?.id;
      
      if (!userId) {
        return ctx.unauthorized("Vous devez être connecté pour voter");
      }
      
      const post = await strapi.entityService.findOne(
        'api::post.post',
        id,
        { populate: 'subrhetic.banned_users' }
      );
      
      if (!post) {
        return ctx.notFound("Post introuvable");
      }
      
      if (post.subrhetic && typeof post.subrhetic === 'object') {
        const subrhetic = post.subrhetic;
        
        if (subrhetic.banned_users && Array.isArray(subrhetic.banned_users)) {
          const isBanned = subrhetic.banned_users.some(
            (banned: any) => {
              const bannedId = typeof banned === 'object' ? banned.id : banned;
              return bannedId === userId;
            }
          );
          
          if (isBanned) {
            return ctx.forbidden("Vous êtes banni de ce subrhetic et ne pouvez pas voter");
          }
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
          await strapi.entityService.delete('api::vote.vote', existingVote.id);
        } else {
          await strapi.entityService.update('api::vote.vote', existingVote.id, {
            data: { type: 'downvote' }
          });
        }
      } else {
        await strapi.entityService.create('api::vote.vote', {
          data: {
            type: 'downvote',
            user: userId,
            post: id
          }
        });
      }
      
      const allVotes = await strapi.db.query('api::vote.vote').findMany({
        where: { post: id }
      });
      
      const upvotes = allVotes.filter(vote => vote.type === 'upvote').length;
      const downvotes = allVotes.filter(vote => vote.type === 'downvote').length;
      
      const updatedPost = await strapi.entityService.update('api::post.post', id, {
        data: {
          upvotes,
          downvotes,
          total_votes: upvotes - downvotes
        }
      });
      
      return updatedPost;
    } catch (error) {
      console.error('Error in post downvote:', error);
      return ctx.badRequest(`An error occurred: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
}));