import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::comment.comment', ({ strapi }) => ({
  async upvote(ctx) {
    try {
      const { id } = ctx.params;
      const userId = ctx.state.user.id;
      
      const comment = await strapi.entityService.findOne(
        'api::comment.comment',
        id,
        { populate: ['votes'] }
      );
      
      if (!comment) {
        return ctx.notFound("Commentaire introuvable");
      }
      
      const existingVote = comment.votes?.find(vote => 
        vote.user === userId && vote.type === 'upvote'
      );
      
      if (existingVote) {
        return ctx.badRequest("Vous avez déjà upvoté ce commentaire");
      }
      
      const vote = await strapi.entityService.create('api::vote.vote', {
        data: {
          type: 'upvote',
          user: userId,
          comment: id
        }
      });
      
      const updatedComment = await strapi.entityService.update(
        'api::comment.comment',
        id,
        {
          data: {
            upvotes: (comment.upvotes || 0) + 1
          }
        }
      );
      
      return this.sanitizeOutput({ ...updatedComment, vote }, ctx);
    } catch (error) {
      console.error('Erreur dans comment upvote:', error);
      return ctx.badRequest(`Une erreur est survenue: ${error.message}`);
    }
  },
  
  async downvote(ctx) {
    try {
      const { id } = ctx.params;
      const userId = ctx.state.user.id;
      
      const comment = await strapi.entityService.findOne(
        'api::comment.comment',
        id,
        { populate: ['votes'] }
      );
      
      if (!comment) {
        return ctx.notFound("Commentaire introuvable");
      }
      
      const existingVote = comment.votes?.find(vote => 
        vote.user === userId && vote.type === 'downvote'
      );
      
      if (existingVote) {
        return ctx.badRequest("Vous avez déjà downvoté ce commentaire");
      }
      
      const vote = await strapi.entityService.create('api::vote.vote', {
        data: {
          type: 'downvote',
          user: userId,
          comment: id
        }
      });
      
      const updatedComment = await strapi.entityService.update(
        'api::comment.comment',
        id,
        {
          data: {
            downvotes: (comment.downvotes || 0) + 1
          }
        }
      );
      
      return this.sanitizeOutput({ ...updatedComment, vote }, ctx);
    } catch (error) {
      console.error('Erreur dans comment downvote:', error);
      return ctx.badRequest(`Une erreur est survenue: ${error.message}`);
    }
  },
});