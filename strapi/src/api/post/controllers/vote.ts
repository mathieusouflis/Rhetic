import { factories } from '@strapi/strapi';
import { StrapiContext, Post, Vote } from '../../../../types/generated/custom';

export default factories.createCoreController('api::post.post', ({ strapi, nexus }) => ({
  async upvote(ctx: StrapiContext) {
    try {
      const { id } = ctx.params;
      const userId = ctx.state.user?.id;
      
      if (!userId) {
        return ctx.unauthorized("Vous devez être connecté pour voter");
      }
      
      const post = await strapi.entityService.findOne(
        'api::post.post',
        id,
        { populate: ['votes'] }
      ) as Post;
      
      if (!post) {
        return ctx.notFound("Post introuvable");
      }
      
      let existingVote: Vote | undefined;
      
      if (post.votes && Array.isArray(post.votes)) {
        existingVote = post.votes.find((vote: Vote) => {
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
          
          const updatedPost = await strapi.entityService.update(
            'api::post.post',
            id,
            {
              data: {
                upvotes: Math.max((post.upvotes || 0) - 1, 0)
              }
            }
          ) as Post;
          
          return nexus.sanitizeOutput(updatedPost, ctx);
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
          
          const updatedPost = await strapi.entityService.update(
            'api::post.post',
            id,
            {
              data: {
                upvotes: (post.upvotes || 0) + 1,
                downvotes: Math.max((post.downvotes || 0) - 1, 0)
              }
            }
          ) as Post;
          
          return nexus.sanitizeOutput({ ...updatedPost, vote: updatedVote }, ctx);
        }
      }
      
      const vote = await strapi.entityService.create(
        'api::vote.vote', 
        {
          data: {
            type: 'upvote',
            user: userId,
            post: id
          }
        }
      ) as Vote;
      
      const updatedPost = await strapi.entityService.update(
        'api::post.post',
        id,
        {
          data: {
            upvotes: (post.upvotes || 0) + 1
          }
        }
      ) as Post;
      
      return nexus.sanitizeOutput({ ...updatedPost, vote }, ctx);
    } catch (error) {
      console.error('Erreur dans post upvote:', error);
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
      
      const post = await strapi.entityService.findOne(
        'api::post.post',
        id,
        { populate: ['votes'] }
      ) as Post;
      
      if (!post) {
        return ctx.notFound("Post introuvable");
      }
      
      let existingVote: Vote | undefined;
      
      if (post.votes && Array.isArray(post.votes)) {
        existingVote = post.votes.find((vote: Vote) => {
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
          
          const updatedPost = await strapi.entityService.update(
            'api::post.post',
            id,
            {
              data: {
                downvotes: Math.max((post.downvotes || 0) - 1, 0)
              }
            }
          ) as Post;
          
          return nexus.sanitizeOutput(updatedPost, ctx);
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
          
          const updatedPost = await strapi.entityService.update(
            'api::post.post',
            id,
            {
              data: {
                downvotes: (post.downvotes || 0) + 1,
                upvotes: Math.max((post.upvotes || 0) - 1, 0)
              }
            }
          ) as Post;
          
          return nexus.sanitizeOutput({ ...updatedPost, vote: updatedVote }, ctx);
        }
      }
      
      const vote = await strapi.entityService.create(
        'api::vote.vote', 
        {
          data: {
            type: 'downvote',
            user: userId,
            post: id
          }
        }
      ) as Vote;
      
      const updatedPost = await strapi.entityService.update(
        'api::post.post',
        id,
        {
          data: {
            downvotes: (post.downvotes || 0) + 1
          }
        }
      ) as Post;
      
      return nexus.sanitizeOutput({ ...updatedPost, vote }, ctx);
    } catch (error) {
      console.error('Erreur dans post downvote:', error);
      return ctx.badRequest(`Une erreur est survenue: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
}));