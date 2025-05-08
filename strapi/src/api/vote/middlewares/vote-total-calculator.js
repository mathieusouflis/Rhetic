module.exports = () => {
    return async (ctx, next) => {
      const initialState = {
        type: ctx.request.method,
        postId: ctx.request.body?.data?.post,
        commentId: ctx.request.body?.data?.comment,
        voteType: ctx.request.body?.data?.type,
      };
  
      await next();
      
      try {
        if (initialState.postId) {
          await updatePostVotesTotal(initialState.postId);
        } else if (initialState.commentId) {
          await updateCommentVotesTotal(initialState.commentId);
        }
      } catch (error) {
        console.error('Erreur lors du calcul du total des votes:', error);
      }
    };
  };
  
  async function updatePostVotesTotal(postId) {
    const post = await strapi.entityService.findOne('api::post.post', postId, {
      fields: ['upvotes', 'downvotes']
    });
    
    if (!post) return;
    
    const total = (post.upvotes || 0) - (post.downvotes || 0);
    
    await strapi.entityService.update('api::post.post', postId, {
      data: {
        total_votes: total
      }
    });
  }
  
  async function updateCommentVotesTotal(commentId) {
    const comment = await strapi.entityService.findOne('api::comment.comment', commentId, {
      fields: ['upvotes', 'downvotes']
    });
    
    if (!comment) return;
    
    const total = (comment.upvotes || 0) - (comment.downvotes || 0);
    
    await strapi.entityService.update('api::comment.comment', commentId, {
      data: {
        total_votes: total
      }
    });
  }