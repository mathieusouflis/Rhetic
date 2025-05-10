import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::comment.comment', ({ strapi }) => ({
  async upvote(ctx) {
    try {
      const { id } = ctx.params;
      const userId = ctx.state.user?.id;
      
      if (!userId) {
        return ctx.unauthorized("Vous devez être connecté pour voter");
      }
      
      const comment = await strapi.entityService.findOne(
        'api::comment.comment',
        id,
        { populate: ['votes'] }
      );
      
      if (!comment) {
        return ctx.notFound("Commentaire introuvable");
      }
      
      let existingVote = null;
      
      if (comment.votes && Array.isArray(comment.votes)) {
        existingVote = comment.votes.find(vote => {
          const voteUserId = typeof vote.user === 'object' ? vote.user.id : vote.user;
          return voteUserId === userId;
        });
      }
      
      if (existingVote) {
        if (existingVote.type === 'upvote') {
          await strapi.entityService.delete('api::vote.vote', existingVote.id);
          
          const updatedComment = await strapi.entityService.update('api::comment.comment', id, {
            data: {
              upvotes: Math.max((comment.upvotes || 0) - 1, 0),
              total_votes: (comment.upvotes || 0) - (comment.downvotes || 0) - 1
            }
          });
          
          return updatedComment;
        } 
        else {
          await strapi.entityService.update('api::vote.vote', existingVote.id, {
            data: {
              type: 'upvote'
            }
          });
          
          const updatedComment = await strapi.entityService.update('api::comment.comment', id, {
            data: {
              upvotes: (comment.upvotes || 0) + 1,
              downvotes: Math.max((comment.downvotes || 0) - 1, 0),
              total_votes: (comment.upvotes || 0) - (comment.downvotes || 0) + 2
            }
          });
          
          return updatedComment;
        }
      }
      
      await strapi.entityService.create('api::vote.vote', {
        data: {
          type: 'upvote',
          user: userId,
          comment: id
        }
      });
      
      const updatedComment = await strapi.entityService.update('api::comment.comment', id, {
        data: {
          upvotes: (comment.upvotes || 0) + 1,
          total_votes: (comment.upvotes || 0) - (comment.downvotes || 0) + 1
        }
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
      
      const comment = await strapi.entityService.findOne(
        'api::comment.comment',
        id,
        { populate: ['votes'] }
      );
      
      if (!comment) {
        return ctx.notFound("Commentaire introuvable");
      }
      
      let existingVote = null;
      
      if (comment.votes && Array.isArray(comment.votes)) {
        existingVote = comment.votes.find(vote => {
          const voteUserId = typeof vote.user === 'object' ? vote.user.id : vote.user;
          return voteUserId === userId;
        });
      }
      
      if (existingVote) {
        if (existingVote.type === 'downvote') {
          await strapi.entityService.delete('api::vote.vote', existingVote.id);
          
          const updatedComment = await strapi.entityService.update('api::comment.comment', id, {
            data: {
              downvotes: Math.max((comment.downvotes || 0) - 1, 0),
              total_votes: (comment.upvotes || 0) - (comment.downvotes || 0) + 1
            }
          });
          
          return updatedComment;
        } 
        else {
          await strapi.entityService.update('api::vote.vote', existingVote.id, {
            data: {
              type: 'downvote'
            }
          });
          
          const updatedComment = await strapi.entityService.update('api::comment.comment', id, {
            data: {
              downvotes: (comment.downvotes || 0) + 1,
              upvotes: Math.max((comment.upvotes || 0) - 1, 0),
              total_votes: (comment.upvotes || 0) - (comment.downvotes || 0) - 2
            }
          });
          
          return updatedComment;
        }
      }
      
      await strapi.entityService.create('api::vote.vote', {
        data: {
          type: 'downvote',
          user: userId,
          comment: id
        }
      });
      
      const updatedComment = await strapi.entityService.update('api::comment.comment', id, {
        data: {
          downvotes: (comment.downvotes || 0) + 1,
          total_votes: (comment.upvotes || 0) - (comment.downvotes || 0) - 1
        }
      });
      
      return updatedComment;
    } catch (error) {
      console.error('Error in comment downvote:', error);
      return ctx.badRequest(`An error occurred: ${error.message || error}`);
    }
  },
}));