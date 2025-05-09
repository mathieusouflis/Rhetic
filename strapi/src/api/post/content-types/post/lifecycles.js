module.exports = {
  async beforeDelete(event) {
    const { params } = event;
    const postId = params.where.id;
    
    const post = await strapi.entityService.findOne('api::post.post', postId, {
      populate: ['votes', 'comments', 'saved_items', 'reports', 'post_flair_assignments'],
    });
    
    if (!post) return;
    
    if (post.votes && post.votes.length > 0) {
      for (const vote of post.votes) {
        await strapi.entityService.delete('api::vote.vote', vote.id);
      }
    }
    
    if (post.saved_items && post.saved_items.length > 0) {
      for (const savedItem of post.saved_items) {
        await strapi.entityService.delete('api::saved-item.saved-item', savedItem.id);
      }
    }
    
    if (post.reports && post.reports.length > 0) {
      for (const report of post.reports) {
        await strapi.entityService.delete('api::report.report', report.id);
      }
    }
    
    if (post.post_flair_assignments && post.post_flair_assignments.length > 0) {
      for (const assignment of post.post_flair_assignments) {
        await strapi.entityService.delete('api::post-flair-assignment.post-flair-assignment', assignment.id);
      }
    }
    
    if (post.comments && post.comments.length > 0) {
      for (const comment of post.comments) {
        await strapi.entityService.delete('api::comment.comment', comment.id);
      }
    }
  }
};