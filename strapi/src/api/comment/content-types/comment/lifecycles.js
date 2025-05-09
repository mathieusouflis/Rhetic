module.exports = {
  async beforeDelete(event) {
    const { params } = event;
    const commentId = params.where.id;
    
    const comment = await strapi.entityService.findOne('api::comment.comment', commentId, {
      populate: ['votes', 'saved_items', 'reports', 'childrens', 'user_flair_assignments'],
    });
    
    if (!comment) return;
    
    if (comment.votes && comment.votes.length > 0) {
      for (const vote of comment.votes) {
        await strapi.entityService.delete('api::vote.vote', vote.id);
      }
    }
    
    if (comment.saved_items && comment.saved_items.length > 0) {
      for (const savedItem of comment.saved_items) {
        await strapi.entityService.delete('api::saved-item.saved-item', savedItem.id);
      }
    }
    
    if (comment.reports && comment.reports.length > 0) {
      for (const report of comment.reports) {
        await strapi.entityService.delete('api::report.report', report.id);
      }
    }
    
    if (comment.user_flair_assignments && comment.user_flair_assignments.length > 0) {
      for (const assignment of comment.user_flair_assignments) {
        await strapi.entityService.delete('api::user-flair-assignment.user-flair-assignment', assignment.id);
      }
    }
    
    if (comment.childrens && comment.childrens.length > 0) {
      for (const child of comment.childrens) {
        await strapi.entityService.delete('api::comment.comment', child.id);
      }
    }
  }
};