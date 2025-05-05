import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::post.post', ({ strapi }) => ({
  async upvote(ctx) {
    try {
      const { id } = ctx.params;
      const userId = ctx.state.user.id;
      
      // Vérifier si le post existe
      const post = await strapi.entityService.findOne(
        'api::post.post',
        id,
        { populate: ['votes'] }
      );
      
      if (!post) {
        return ctx.notFound("Post introuvable");
      }
      
      // Vérifier si l'utilisateur a déjà voté
      const existingVote = post.votes?.find(vote => 
        vote.user === userId
      );
      
      // Si un vote existe déjà
      if (existingVote) {
        // Si c'est le même type de vote (upvote), on le supprime (annulation)
        if (existingVote.type === 'upvote') {
          await strapi.entityService.delete('api::vote.vote', existingVote.id);
          
          const updatedPost = await strapi.entityService.update(
            'api::post.post',
            id,
            {
              data: {
                upvotes: Math.max((post.upvotes || 0) - 1, 0)
              }
            }
          );
          
          return this.sanitizeOutput(updatedPost, ctx);
        } 
        // Si c'est un type différent (downvote), on le met à jour
        else {
          const updatedVote = await strapi.entityService.update('api::vote.vote', existingVote.id, {
            data: {
              type: 'upvote'
            }
          });
          
          const updatedPost = await strapi.entityService.update(
            'api::post.post',
            id,
            {
              data: {
                upvotes: (post.upvotes || 0) + 1,
                downvotes: Math.max((post.downvotes || 0) - 1, 0)
              }
            }
          );
          
          return this.sanitizeOutput({ ...updatedPost, vote: updatedVote }, ctx);
        }
      }
      
      // Si aucun vote n'existe, on en crée un nouveau
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
      
      // Vérifier si l'utilisateur a déjà voté
      const existingVote = post.votes?.find(vote => 
        vote.user === userId
      );
      
      // Si un vote existe déjà
      if (existingVote) {
        // Si c'est le même type de vote (downvote), on le supprime (annulation)
        if (existingVote.type === 'downvote') {
          await strapi.entityService.delete('api::vote.vote', existingVote.id);
          
          const updatedPost = await strapi.entityService.update(
            'api::post.post',
            id,
            {
              data: {
                downvotes: Math.max((post.downvotes || 0) - 1, 0)
              }
            }
          );
          
          return this.sanitizeOutput(updatedPost, ctx);
        } 
        // Si c'est un type différent (upvote), on le met à jour
        else {
          const updatedVote = await strapi.entityService.update('api::vote.vote', existingVote.id, {
            data: {
              type: 'downvote'
            }
          });
          
          const updatedPost = await strapi.entityService.update(
            'api::post.post',
            id,
            {
              data: {
                downvotes: (post.downvotes || 0) + 1,
                upvotes: Math.max((post.upvotes || 0) - 1, 0)
              }
            }
          );
          
          return this.sanitizeOutput({ ...updatedPost, vote: updatedVote }, ctx);
        }
      }
      
      // Si aucun vote n'existe, on en crée un nouveau
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
}));