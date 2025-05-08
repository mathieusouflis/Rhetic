module.exports = {
    async afterCreate(event) {
      await updateVoteTotals(event);
    },
    
    async afterUpdate(event) {
      await updateVoteTotals(event);
    },
    
    async afterDelete(event) {
      await updateVoteTotals(event);
    }
  };
  
  async function updateVoteTotals(event) {
    const { result } = event;
    
    if (result.post) {
      const postId = typeof result.post === 'object' ? result.post.id : result.post;
      await updateEntityVoteTotals('api::post.post', postId);
    }
    
    if (result.comment) {
      const commentId = typeof result.comment === 'object' ? result.comment.id : result.comment;
      await updateEntityVoteTotals('api::comment.comment', commentId);
    }
  }
  
  async function updateEntityVoteTotals(entityType, entityId) {
    const votes = await strapi.entityService.findMany('api::vote.vote', {
      filters: {
        [entityType === 'api::post.post' ? 'post' : 'comment']: entityId
      }
    });
    
    const upvotes = votes.filter(vote => vote.type === 'upvote').length;
    const downvotes = votes.filter(vote => vote.type === 'downvote').length;
    const total = upvotes - downvotes;
    
    await strapi.entityService.update(entityType, entityId, {
      data: {
        upvotes,
        downvotes,
        total_votes: total
      }
    });
  }