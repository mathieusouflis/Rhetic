import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::post.post', ({ strapi }) => ({
  async upvote(ctx) {
    try {
      const { id } = ctx.params;
      const userId = ctx.state.user.id;
      
      const post = await strapi.entityService.findOne(
        'api::post.post',
        id,
        { populate: ['votes'] }
      );
      
      if (!post) {
        return ctx.notFound("Post introuvable");
      }
      
      const existingVote = post.votes?.find(vote => 
        vote.user === userId && vote.type === 'upvote'
      );
      
      if (existingVote) {
        return ctx.badRequest("Vous avez déjà upvoté ce post");
      }
      
      const vote = await strapi.entityService.create('api::vote.vote', {
        data: {
          type: 'upvote',
          user: userId,
          post: id
        }
      });
      
      const updatedPost = await strapi.entityService.update(
        'api::post.post',
        id,
        {
          data: {
            upvotes: (post.upvotes || 0) + 1
          }
        }
      );
      
      return this.sanitizeOutput({ ...updatedPost, vote }, ctx);
    } catch (error) {
      console.error('Erreur dans post upvote:', error);
      return ctx.badRequest(`Une erreur est survenue: ${error.message}`);
    }
  },
  
  async downvote(ctx) {
    try {
      const { id } = ctx.params;
      const userId = ctx.state.user.id;
      
      const post = await strapi.entityService.findOne(
        'api::post.post',
        id,
        { populate: ['votes'] }
      );
      
      if (!post) {
        return ctx.notFound("Post introuvable");
      }
      
      const existingVote = post.votes?.find(vote => 
        vote.user === userId && vote.type === 'downvote'
      );
      
      if (existingVote) {
        return ctx.badRequest("Vous avez déjà downvoté ce post");
      }
      
      const vote = await strapi.entityService.create('api::vote.vote', {
        data: {
          type: 'downvote',
          user: userId,
          post: id
        }
      });
      
      const updatedPost = await strapi.entityService.update(
        'api::post.post',
        id,
        {
          data: {
            downvotes: (post.downvotes || 0) + 1
          }
        }
      );
      
      return this.sanitizeOutput({ ...updatedPost, vote }, ctx);
    } catch (error) {
      console.error('Erreur dans post downvote:', error);
      return ctx.badRequest(`Une erreur est survenue: ${error.message}`);
    }
  },
});