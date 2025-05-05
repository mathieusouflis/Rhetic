// strapi/src/api/post/middlewares/vote-validator.ts
import { StrapiContext } from '../../../../types/generated/custom';

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
        { populate: ['votes'] }
      );
      
      if (!post) {
        return ctx.notFound("Post introuvable");
      }
      
      const isUpvote = ctx.request.url.includes('/upvote');
      const isDownvote = ctx.request.url.includes('/downvote');
      
      const userVoteExists = post.votes?.some((vote: any) => 
        vote.user === user.id && 
        ((isUpvote && vote.type === 'upvote') || (isDownvote && vote.type === 'downvote'))
      );
      
      if (userVoteExists) {
        return ctx.badRequest(`Vous avez déjà ${isUpvote ? 'upvoté' : 'downvoté'} ce post`);
      }
      
      ctx.state.vote = {
        postId: id,
        userId: user.id,
        type: isUpvote ? 'upvote' : 'downvote'
      };
      
      return await next();
    } catch (error: any) {
      ctx.internalServerError(`Erreur lors de la validation du vote: ${error.message}`);
    }
  };
};