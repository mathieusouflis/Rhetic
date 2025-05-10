module.exports = {
  async beforeDelete(event) {
    const { params } = event;
    const subrheticId = params.where.id;
    
    const subrhetic = await strapi.entityService.findOne('api::subrhetic.subrhetic', subrheticId, {
      populate: [
        'posts',
        'subrhetic_emojis',
        'post_flairs',
        'user_flairs',
        'subrhetic_emoji_reactions',
        'user_flair_assignments',
        'subrhetic_rules',
        'moderation_actions',
        'reports'
      ],
    });
    
    if (!subrhetic) return;
    
    if (subrhetic.subrhetic_emoji_reactions && subrhetic.subrhetic_emoji_reactions.length > 0) {
      for (const reaction of subrhetic.subrhetic_emoji_reactions) {
        await strapi.entityService.delete('api::subrhetic-emoji-reaction.subrhetic-emoji-reaction', reaction.id);
      }
    }
    
    if (subrhetic.subrhetic_emojis && subrhetic.subrhetic_emojis.length > 0) {
      for (const emoji of subrhetic.subrhetic_emojis) {
        await strapi.entityService.delete('api::subrhetic-emoji.subrhetic-emoji', emoji.id);
      }
    }
    
    if (subrhetic.post_flairs && subrhetic.post_flairs.length > 0) {
      for (const flair of subrhetic.post_flairs) {
        await strapi.entityService.delete('api::post-flair.post-flair', flair.id);
      }
    }
    
    if (subrhetic.user_flairs && subrhetic.user_flairs.length > 0) {
      for (const flair of subrhetic.user_flairs) {
        await strapi.entityService.delete('api::user-flair.user-flair', flair.id);
      }
    }
    
    if (subrhetic.user_flair_assignments && subrhetic.user_flair_assignments.length > 0) {
      for (const assignment of subrhetic.user_flair_assignments) {
        await strapi.entityService.delete('api::user-flair-assignment.user-flair-assignment', assignment.id);
      }
    }
    
    if (subrhetic.subrhetic_rules && subrhetic.subrhetic_rules.length > 0) {
      for (const rule of subrhetic.subrhetic_rules) {
        await strapi.entityService.delete('api::subrhetic-rule.subrhetic-rule', rule.id);
      }
    }
    
    if (subrhetic.moderation_actions && subrhetic.moderation_actions.length > 0) {
      for (const action of subrhetic.moderation_actions) {
        await strapi.entityService.delete('api::moderation-action.moderation-action', action.id);
      }
    }
    
    if (subrhetic.reports && subrhetic.reports.length > 0) {
      for (const report of subrhetic.reports) {
        await strapi.entityService.delete('api::report.report', report.id);
      }
    }
    
    if (subrhetic.posts && subrhetic.posts.length > 0) {
      for (const post of subrhetic.posts) {
        await strapi.entityService.delete('api::post.post', post.id);
      }
    }
  }
};