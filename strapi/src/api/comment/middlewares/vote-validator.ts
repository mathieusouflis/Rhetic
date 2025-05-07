import { StrapiContext, Comment, Vote } from '../../../../types/generated/custom';

export default () => {
  return async (ctx: StrapiContext, next: () => Promise<any>) => {
    try {
      const { id } = ctx.params;
      const user = ctx.state.user;
      
      if (!user) {
        return ctx.unauthorized("Vous devez être connecté pour voter");
      }
      
      const comment = await strapi.entityService.findOne(
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
      ) as Comment;
      
      if (!comment) {
        return ctx.notFound("Commentaire introuvable");
      }
      
      if (comment.post && typeof comment.post === 'object') {
        const post = comment.post;
        
        if (post.subrhetic && typeof post.subrhetic === 'object') {
          const subrhetic = post.subrhetic;
          
          if (subrhetic.banned_users && Array.isArray(subrhetic.banned_users)) {
            const isBanned = subrhetic.banned_users.some(
              (banned: any) => {
                const bannedId = typeof banned === 'object' ? banned.id : banned;
                return bannedId === user.id;
              }
            );
            
            if (isBanned) {
              return ctx.forbidden("Vous êtes banni de ce subrhetic et ne pouvez pas voter");
            }
          }
        }
      }
      
      const isUpvote = ctx.request.url.includes('/upvote');
      const isDownvote = ctx.request.url.includes('/downvote');
      
      if (comment.votes && Array.isArray(comment.votes)) {
        const userVoteExists = comment.votes.some((vote: Vote) => {
          const voteUserId = typeof vote.user === 'object' ? vote.user.id : vote.user;
          return voteUserId === user.id && 
                ((isUpvote && vote.type === 'upvote') || 
                 (isDownvote && vote.type === 'downvote'));
        });
        
        if (userVoteExists) {
          return ctx.badRequest(`Vous avez déjà ${isUpvote ? 'upvoté' : 'downvoté'} ce commentaire`);
        }
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