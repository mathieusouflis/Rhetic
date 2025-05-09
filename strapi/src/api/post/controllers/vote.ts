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
        { populate: ['votes'] }
      );
      
      if (!post) {
        return ctx.notFound("Post introuvable");
      }
      
      let existingVote;
      
      if (post.votes && Array.isArray(post.votes)) {
        existingVote = post.votes.find((vote) => {
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
                upvotes: Math.max((post.upvotes || 0) - 1, 0),
                total_votes: (post.total_votes || 0) - 1
              }
            }
          );
          
          return { ...updatedPost };
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
          );
          
          const updatedPost = await strapi.entityService.update(
            'api::post.post',
            id,
            {
              data: {
                upvotes: (post.upvotes || 0) + 1,
                downvotes: Math.max((post.downvotes || 0) - 1, 0),
                total_votes: (post.total_votes || 0) + 2
              }
            }
          );
          
          return { ...updatedPost, vote: updatedVote };
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
      );
      
      const updatedPost = await strapi.entityService.update(
        'api::post.post',
        id,
        {
          data: {
            upvotes: (post.upvotes || 0) + 1,
            total_votes: (post.total_votes || 0) + 1
          }
        }
      );
      
      return { ...updatedPost, vote };
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
      
      const post = await strapi.entityService.findOne(
        'api::post.post',
        id,
        { populate: ['votes'] }
      );
      
      if (!post) {
        return ctx.notFound("Post introuvable");
      }
      
      let existingVote;
      
      if (post.votes && Array.isArray(post.votes)) {
        existingVote = post.votes.find((vote) => {
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
                downvotes: Math.max((post.downvotes || 0) - 1, 0),
                total_votes: (post.total_votes || 0) + 1
              }
            }
          );
          
          return { ...updatedPost };
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
          );
          
          const updatedPost = await strapi.entityService.update(
            'api::post.post',
            id,
            {
              data: {
                downvotes: (post.downvotes || 0) + 1,
                upvotes: Math.max((post.upvotes || 0) - 1, 0),
                total_votes: (post.total_votes || 0) - 2
              }
            }
          );
          
          return { ...updatedPost, vote: updatedVote };
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
      );
      
      const updatedPost = await strapi.entityService.update(
        'api::post.post',
        id,
        {
          data: {
            downvotes: (post.downvotes || 0) + 1,
            total_votes: (post.total_votes || 0) - 1
          }
        }
      );
      
      return { ...updatedPost, vote };
    } catch (error) {
      console.error('Error in post downvote:', error);
      return ctx.badRequest(`An error occurred: ${error.message || error}`);
    }
  },
}));