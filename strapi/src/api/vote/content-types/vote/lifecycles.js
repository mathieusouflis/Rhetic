module.exports = {
  async afterCreate(event) {
    const { result } = event;
    
    if (result.post) {
      await recalculatePostVotes(result.post);
    }
    
    if (result.comment) {
      await recalculateCommentVotes(result.comment);
    }
  },
  
  async afterUpdate(event) {
    const { result } = event;
    
    if (result.post) {
      await recalculatePostVotes(result.post);
    }
    
    if (result.comment) {
      await recalculateCommentVotes(result.comment);
    }
  },
  
  async afterDelete(event) {
    const { result } = event;
    
    if (result.post) {
      await recalculatePostVotes(result.post);
    }
    
    if (result.comment) {
      await recalculateCommentVotes(result.comment);
    }
  }
};

async function recalculatePostVotes(postId) {
  const votes = await strapi.db.query('api::vote.vote').findMany({
    where: { post: postId }
  });
  
  const upvotes = votes.filter(vote => vote.type === 'upvote').length;
  const downvotes = votes.filter(vote => vote.type === 'downvote').length;
  
  await strapi.entityService.update('api::post.post', postId, {
    data: {
      upvotes,
      downvotes,
      total_votes: upvotes - downvotes
    }
  });
}

async function recalculateCommentVotes(commentId) {
  const votes = await strapi.db.query('api::vote.vote').findMany({
    where: { comment: commentId }
  });
  
  const upvotes = votes.filter(vote => vote.type === 'upvote').length;
  const downvotes = votes.filter(vote => vote.type === 'downvote').length;
  
  await strapi.entityService.update('api::comment.comment', commentId, {
    data: {
      upvotes,
      downvotes,
      total_votes: upvotes - downvotes
    }
  });
}