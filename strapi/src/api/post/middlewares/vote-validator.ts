import { StrapiContext, Vote, Post } from '../../../../types/generated/custom';

export default () => {
  return async (ctx: StrapiContext, next: () => Promise<any>) => {
    try {
      const { id } = ctx.params;
      const user = ctx.state.user;
      
      if (!user) {
        return ctx.unauthorized("Vous devez être connecté pour voter");
      }
      
      const post = await strapi.entityService.findOne(
        'api::post.post',
        id,
        { 
          populate: ['votes', 'subrhetic.banned_users']
        }
      ) as Post;
      
      if (!post) {
        return ctx.notFound("Post introuvable");
      }
      
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
      
      const isUpvote = ctx.request.url.includes('/upvote');
      const isDownvote = ctx.request.url.includes('/downvote');
      
      ctx.state.vote = {
        postId: id,
        userId: user.id,
        type: isUpvote ? 'upvote' : 'downvote'
      };
      
      return await next();
    } catch (error) {
      return ctx.internalServerError(`Erreur lors de la validation du vote: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
};