import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::comment.comment', ({ strapi }) => ({
  async upvote(ctx) {
    try {
      const { id } = ctx.params;
      const userId = ctx.state.user?.id;
      
      if (!userId) {
        return ctx.unauthorized("Vous devez être connecté pour voter");
      }
      
      const comment = await strapi.db.query('api::comment.comment').findOne({
        where: { id },
        populate: ['post.subrhetic.banned_users']
      });
      
      if (!comment) {
        return ctx.notFound("Commentaire introuvable");
      }
      
      if (comment.post && comment.post.subrhetic && comment.post.subrhetic.banned_users) {
        const isBanned = comment.post.subrhetic.banned_users.some(
          (banned) => typeof banned === 'object' ? banned.id === userId : banned === userId
        );
        
        if (isBanned) {
          return ctx.forbidden("Vous êtes banni de ce subrhetic et ne pouvez pas voter");
        }
      }
      
      const existingVote = await strapi.db.query('api::vote.vote').findOne({
        where: {
          comment: id,
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
            comment: id
          }
        });
      }
      
      const votes = await strapi.db.query('api::vote.vote').findMany({
        where: { comment: id }
      });
      
      const upvotes = votes.filter(vote => vote.type === 'upvote').length;
      const downvotes = votes.filter(vote => vote.type === 'downvote').length;
      
      await strapi.db.query('api::comment.comment').update({
        where: { id },
        data: {
          upvotes,
          downvotes,
          total_votes: upvotes - downvotes
        }
      });
      
      const updatedComment = await strapi.db.query('api::comment.comment').findOne({
        where: { id }
      });
      
      return updatedComment;
    } catch (error) {
      console.error('Error in comment upvote:', error);
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
      
      const comment = await strapi.db.query('api::comment.comment').findOne({
        where: { id },
        populate: ['post.subrhetic.banned_users']
      });
      
      if (!comment) {
        return ctx.notFound("Commentaire introuvable");
      }
      
      if (comment.post && comment.post.subrhetic && comment.post.subrhetic.banned_users) {
        const isBanned = comment.post.subrhetic.banned_users.some(
          (banned) => typeof banned === 'object' ? banned.id === userId : banned === userId
        );
        
        if (isBanned) {
          return ctx.forbidden("Vous êtes banni de ce subrhetic et ne pouvez pas voter");
        }
      }
      
      const existingVote = await strapi.db.query('api::vote.vote').findOne({
        where: {
          comment: id,
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
            comment: id
          }
        });
      }
      
      const votes = await strapi.db.query('api::vote.vote').findMany({
        where: { comment: id }
      });
      
      const upvotes = votes.filter(vote => vote.type === 'upvote').length;
      const downvotes = votes.filter(vote => vote.type === 'downvote').length;
      
      await strapi.db.query('api::comment.comment').update({
        where: { id },
        data: {
          upvotes,
          downvotes,
          total_votes: upvotes - downvotes
        }
      });
      
      const updatedComment = await strapi.db.query('api::comment.comment').findOne({
        where: { id }
      });
      
      return updatedComment;
    } catch (error) {
      console.error('Error in comment downvote:', error);
      return ctx.badRequest(`An error occurred: ${error.message || error}`);
    }
  },
}));