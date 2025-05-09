module.exports = {
  async beforeDelete(event) {
    const { params } = event;
    const emojiId = params.where.id;
    
    const emoji = await strapi.entityService.findOne('api::subrhetic-emoji.subrhetic-emoji', emojiId, {
      populate: ['subrhetic_emoji_reactions'],
    });
    
    if (!emoji) return;
    
    if (emoji.subrhetic_emoji_reactions && emoji.subrhetic_emoji_reactions.length > 0) {
      for (const reaction of emoji.subrhetic_emoji_reactions) {
        await strapi.entityService.delete('api::subrhetic-emoji-reaction.subrhetic-emoji-reaction', reaction.id);
      }
    }
  }
};