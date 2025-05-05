import { factories } from '@strapi/strapi';
import { StrapiContext, Comment, Vote } from '../../../../types/generated/custom';

export default factories.createCoreController('api::comment.comment', ({ strapi }) => ({
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
      
      const existingVote = comment.votes?.find((vote: Vote) => {
        const voteUserId = typeof vote.user === 'object' ? vote.user.id : vote.user;
        return voteUserId === userId;
      });
      
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
                upvotes: Math.max((comment.upvotes || 0) - 1, 0)
              }
            }
          ) as Comment;
          
          return this.sanitizeOutput(updatedComment, ctx);
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
                downvotes: Math.max((comment.downvotes || 0) - 1, 0)
              }
            }
          ) as Comment;
          
          return this.sanitizeOutput({ ...updatedComment, vote: updatedVote }, ctx);
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
            upvotes: (comment.upvotes || 0) + 1
          }
        }
      ) as Comment;
      
      return this.sanitizeOutput({ ...updatedComment, vote }, ctx);
    } catch (error) {
      console.error('Erreur dans comment upvote:', error);
      return ctx.badRequest(`Une erreur est survenue: ${error instanceof Error ? error.message : String(error)}`);
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
      
      const existingVote = comment.votes?.find((vote: Vote) => {
        const voteUserId = typeof vote.user === 'object' ? vote.user.id : vote.user;
        return voteUserId === userId;
      });
      
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
                downvotes: Math.max((comment.downvotes || 0) - 1, 0)
              }
            }
          ) as Comment;
          
          return this.sanitizeOutput(updatedComment, ctx);
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
                upvotes: Math.max((comment.upvotes || 0) - 1, 0)
              }
            }
          ) as Comment;
          
          return this.sanitizeOutput({ ...updatedComment, vote: updatedVote }, ctx);
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
            downvotes: (comment.downvotes || 0) + 1
          }
        }
      ) as Comment;
      
      return this.sanitizeOutput({ ...updatedComment, vote }, ctx);
    } catch (error) {
      console.error('Erreur dans comment downvote:', error);
      return ctx.badRequest(`Une erreur est survenue: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
}));