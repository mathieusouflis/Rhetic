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
      
      // Vérifier si l'utilisateur a déjà voté
      const existingVote = comment.votes?.find(vote => 
        vote.user === userId
      );
      
      // Si un vote existe déjà
      if (existingVote) {
        // Si c'est le même type de vote (upvote), on le supprime (annulation)
        if (existingVote.type === 'upvote') {
          await strapi.entityService.delete('api::vote.vote', existingVote.id);
          
          const updatedComment = await strapi.entityService.update(
            'api::comment.comment',
            id,
            {
              data: {
                upvotes: Math.max((comment.upvotes || 0) - 1, 0)
              }
            }
          );
          
          return this.sanitizeOutput(updatedComment, ctx);
        } 
        // Si c'est un type différent (downvote), on le met à jour
        else {
          const updatedVote = await strapi.entityService.update('api::vote.vote', existingVote.id, {
            data: {
              type: 'upvote'
            }
          });
          
          const updatedComment = await strapi.entityService.update(
            'api::comment.comment',
            id,
            {
              data: {
                upvotes: (comment.upvotes || 0) + 1,
                downvotes: Math.max((comment.downvotes || 0) - 1, 0)
              }
            }
          );
          
          return this.sanitizeOutput({ ...updatedComment, vote: updatedVote }, ctx);
        }
      }
      
      // Si aucun vote n'existe, on en crée un nouveau
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
        vote.user === userId
      );
      
      if (existingVote) {
        if (existingVote.type === 'downvote') {
          await strapi.entityService.delete('api::vote.vote', existingVote.id);
          
          const updatedComment = await strapi.entityService.update(
            'api::comment.comment',
            id,
            {
              data: {
                downvotes: Math.max((comment.downvotes || 0) - 1, 0)
              }
            }
          );
          
          return this.sanitizeOutput(updatedComment, ctx);
        } 
        else {
          const updatedVote = await strapi.entityService.update('api::vote.vote', existingVote.id, {
            data: {
              type: 'downvote'
            }
          });
          
          const updatedComment = await strapi.entityService.update(
            'api::comment.comment',
            id,
            {
              data: {
                downvotes: (comment.downvotes || 0) + 1,
                upvotes: Math.max((comment.upvotes || 0) - 1, 0)
              }
            }
          );
          
          return this.sanitizeOutput({ ...updatedComment, vote: updatedVote }, ctx);
        }
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
}));