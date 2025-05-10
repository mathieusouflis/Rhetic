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
  const upvotes = await strapi.db.query('api::vote.vote').count({
    where: { post: postId, type: 'upvote' }
  });
  
  const downvotes = await strapi.db.query('api::vote.vote').count({
    where: { post: postId, type: 'downvote' }
  });
  
  await strapi.entityService.update('api::post.post', postId, {
    data: {
      upvotes,
      downvotes,
      total_votes: upvotes - downvotes
    }
  });
}

async function recalculateCommentVotes(commentId) {
  const upvotes = await strapi.db.query('api::vote.vote').count({
    where: { comment: commentId, type: 'upvote' }
  });
  
  const downvotes = await strapi.db.query('api::vote.vote').count({
    where: { comment: commentId, type: 'downvote' }
  });
  
  await strapi.entityService.update('api::comment.comment', commentId, {
    data: {
      upvotes,
      downvotes,
      total_votes: upvotes - downvotes
    }
  });
}