// strapi/src/api/comment/middlewares/vote-validator.ts
import { StrapiContext, Comment, Vote } from '../../../../types/generated/custom';

export default () => {
  return async (ctx: StrapiContext, next: () => Promise<any>) => {
    try {
      const { id } = ctx.params;
      const user = ctx.state.user;
      
      if (!user) {
        return ctx.unauthorized("Vous devez être connecté pour voter");
      }
      
      const comment = await strapi.entityService.findOne<Comment>(
        'api::comment.comment',
        id,
        { 
          populate: {
            post: {
              populate: {
                subrhetic: {
                  populate: ['banned_users']
                }
              }
            },
            votes: true
          }
        }
      );
      
      if (!comment) {
        return ctx.notFound("Commentaire introuvable");
      }
      
      // Vérifier si l'utilisateur est banni du subrhetic
      if (comment.post && 
          typeof comment.post === 'object' && 
          comment.post.subrhetic && 
          typeof comment.post.subrhetic === 'object' && 
          comment.post.subrhetic.banned_users) {
        
        const isBanned = comment.post.subrhetic.banned_users.some(
          (banned: any) => {
            const bannedId = typeof banned === 'object' ? banned.id : banned;
            return bannedId === user.id;
          }
        );
        
        if (isBanned) {
          return ctx.forbidden("Vous êtes banni de ce subrhetic et ne pouvez pas voter");
        }
      }
      
      const isUpvote = ctx.request.url.includes('/upvote');
      const isDownvote = ctx.request.url.includes('/downvote');
      
      // Vérifier si l'utilisateur a déjà voté ce type de vote
      const userVoteExists = comment.votes?.some((vote: Vote) => {
        const voteUserId = typeof vote.user === 'object' ? vote.user.id : vote.user;
        return voteUserId === user.id && 
               ((isUpvote && vote.type === 'upvote') || 
                (isDownvote && vote.type === 'downvote'));
      });
      
      if (userVoteExists) {
        return ctx.badRequest(`Vous avez déjà ${isUpvote ? 'upvoté' : 'downvoté'} ce commentaire`);
      }
      
      ctx.state.vote = {
        commentId: id,
        userId: user.id,
        type: isUpvote ? 'upvote' : 'downvote'
      };
      
      return await next();
    } catch (error) {
      return ctx.internalServerError(`Erreur lors de la validation du vote: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
};