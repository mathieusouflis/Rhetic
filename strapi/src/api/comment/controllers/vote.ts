// strapi/src/api/comment/controllers/vote.ts
import { factories } from '@strapi/strapi';
import { StrapiContext, Comment, Vote } from '../../../../types/generated/custom';

export default factories.createCoreController('api::comment.comment', ({ strapi }) => ({
  async upvote(ctx: StrapiContext) {
    try {
      const { id } = ctx.params;
      const userId = ctx.state.user.id;
      
      const comment = await strapi.entityService.findOne<Comment>(
        'api::comment.comment',
        id,
        { populate: ['votes'] }
      );
      
      if (!comment) {
        return ctx.notFound("Commentaire introuvable");
      }
      
      // Vérifier si l'utilisateur a déjà voté
      const existingVote = comment.votes?.find((vote: Vote) => 
        vote.user === userId
      );
      
      // Reste du code...
      // Utilisez un typage approprié pour toutes les variables
    } catch (error: any) {
      console.error('Erreur dans comment upvote:', error);
      return ctx.badRequest(`Une erreur est survenue: ${error.message}`);
    }
  },
  
  // Changements similaires pour la méthode downvote
}));