import { factories } from '@strapi/strapi';
import { StrapiContext, Comment, Vote } from '../../../../types/generated/custom';

export default factories.createCoreController('api::comment.comment', ({ strapi, nexus }) => ({
  async upvote(ctx: StrapiContext) {
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
      ) as Comment;
      
      if (!comment) {
        return ctx.notFound("Commentaire introuvable");
      }
      
      let existingVote: Vote | undefined;
      
      if (comment.votes && Array.isArray(comment.votes)) {
        existingVote = comment.votes.find((vote: Vote) => {
          const voteUserId = typeof vote.user === 'object' ? vote.user.id : vote.user;
          return voteUserId === userId;
        });
      }
      
      if (existingVote) {
        if (existingVote.type === 'upvote') {
          await strapi.entityService.delete(
            'api::vote.vote', 
            existingVote.id
          );
          
          const updatedComment = await strapi.entityService.update(
            'api::comment.comment',
            id,
            {
              data: {
                upvotes: Math.max((comment.upvotes || 0) - 1, 0),
                total_votes: (comment.total_votes || 0) - 1
              }
            }
          ) as Comment;
          
          return nexus.sanitizeOutput(updatedComment, ctx);
        } 
        else {
          const updatedVote = await strapi.entityService.update(
            'api::vote.vote', 
            existingVote.id, 
            {
              data: {
                type: 'upvote'
              }
            }
          ) as Vote;
          
          const updatedComment = await strapi.entityService.update(
            'api::comment.comment',
            id,
            {
              data: {
                upvotes: (comment.upvotes || 0) + 1,
                downvotes: Math.max((comment.downvotes || 0) - 1, 0),
                total_votes: (comment.total_votes || 0) + 2
              }
            }
          ) as Comment;
          
          return nexus.sanitizeOutput({ ...updatedComment, vote: updatedVote }, ctx);
        }
      }
      
      const vote = await strapi.entityService.create(
        'api::vote.vote', 
        {
          data: {
            type: 'upvote',
            user: userId,
            comment: id
          }
        }
      ) as Vote;
      
      const updatedComment = await strapi.entityService.update(
        'api::comment.comment',
        id,
        {
          data: {
            upvotes: (comment.upvotes || 0) + 1,
            total_votes: (comment.total_votes || 0) + 1
          }
        }
      ) as Comment;
      
      return nexus.sanitizeOutput({ ...updatedComment, vote }, ctx);
    } catch (error) {
      console.error('Error in comment upvote:', error);
      return ctx.badRequest(`An error occurred: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
  
  async downvote(ctx: StrapiContext) {
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
      ) as Comment;
      
      if (!comment) {
        return ctx.notFound("Commentaire introuvable");
      }
      
      let existingVote: Vote | undefined;
      
      if (comment.votes && Array.isArray(comment.votes)) {
        existingVote = comment.votes.find((vote: Vote) => {
          const voteUserId = typeof vote.user === 'object' ? vote.user.id : vote.user;
          return voteUserId === userId;
        });
      }
      
      if (existingVote) {
        if (existingVote.type === 'downvote') {
          await strapi.entityService.delete(
            'api::vote.vote', 
            existingVote.id
          );
          
          const updatedComment = await strapi.entityService.update(
            'api::comment.comment',
            id,
            {
              data: {
                downvotes: Math.max((comment.downvotes || 0) - 1, 0),
                total_votes: (comment.total_votes || 0) + 1
              }
            }
          ) as Comment;
          
          return nexus.sanitizeOutput(updatedComment, ctx);
        } 
        else {
          const updatedVote = await strapi.entityService.update(
            'api::vote.vote', 
            existingVote.id, 
            {
              data: {
                type: 'downvote'
              }
            }
          ) as Vote;
          
          const updatedComment = await strapi.entityService.update(
            'api::comment.comment',
            id,
            {
              data: {
                downvotes: (comment.downvotes || 0) + 1,
                upvotes: Math.max((comment.upvotes || 0) - 1, 0),
                total_votes: (comment.total_votes || 0) - 2
              }
            }
          ) as Comment;
          
          return nexus.sanitizeOutput({ ...updatedComment, vote: updatedVote }, ctx);
        }
      }
      
      const vote = await strapi.entityService.create(
        'api::vote.vote', 
        {
          data: {
            type: 'downvote',
            user: userId,
            comment: id
          }
        }
      ) as Vote;
      
      const updatedComment = await strapi.entityService.update(
        'api::comment.comment',
        id,
        {
          data: {
            downvotes: (comment.downvotes || 0) + 1,
            total_votes: (comment.total_votes || 0) - 1
          }
        }
      ) as Comment;
      
      return nexus.sanitizeOutput({ ...updatedComment, vote }, ctx);
    } catch (error) {
      console.error('Error in comment downvote:', error);
      return ctx.badRequest(`An error occurred: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
}));