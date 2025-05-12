import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::subrhetic.subrhetic', ({ strapi, nexus }) => ({
  async delete(ctx) {
    try {
      const { id } = ctx.params;
      const userId = ctx.state.user?.id;
      
      if (!userId) {
        return ctx.unauthorized("Vous devez être connecté pour supprimer un subrhetic");
      }
      
      const subrhetic = await strapi.entityService.findOne('api::subrhetic.subrhetic', id, {
        populate: ['creator', 'moderators']
      });
      
      if (!subrhetic) {
        return ctx.notFound("Subrhetic introuvable");
      }
      
      const creatorId = typeof subrhetic.creator === 'object' ? subrhetic.creator.id : subrhetic.creator;
      
      if (creatorId !== userId) {
        const userWithRole = await strapi.entityService.findOne('plugin::users-permissions.user', userId, {
          populate: ['role']
        });
        
        if (userWithRole?.role?.type !== 'admin') {
          return ctx.forbidden("Seul le créateur ou un administrateur peut supprimer ce subrhetic");
        }
      }
      
      await this.deleteSubrheticAndRelatedContent(id, userId);
      
      return { message: "Subrhetic supprimé avec succès" };
    } catch (error) {
      console.error('Erreur lors de la suppression du subrhetic:', error);
      return ctx.badRequest(`Une erreur est survenue: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
  
  async deleteSubrheticAndRelatedContent(subrheticId: number, deletedBy: number) {
    try {
      const posts = await strapi.db.query('api::post.post').findMany({
        where: { subrhetic: subrheticId }
      });
      
      for (const post of posts) {
        const comments = await strapi.db.query('api::comment.comment').findMany({
          where: { post: post.id }
        });
        
        for (const comment of comments) {
          await strapi.entityService.delete('api::comment.comment', comment.id);
        }
        
        const postVotes = await strapi.db.query('api::vote.vote').findMany({
          where: { post: post.id }
        });
        
        for (const vote of postVotes) {
          await strapi.entityService.delete('api::vote.vote', vote.id);
        }
        
        const savedItems = await strapi.db.query('api::saved-item.saved-item').findMany({
          where: { post: post.id }
        });
        
        for (const savedItem of savedItems) {
          await strapi.entityService.delete('api::saved-item.saved-item', savedItem.id);
        }
        
        const postReports = await strapi.db.query('api::report.report').findMany({
          where: { post: post.id }
        });
        
        for (const report of postReports) {
          await strapi.entityService.delete('api::report.report', report.id);
        }
        
        const postFlairAssignments = await strapi.db.query('api::post-flair-assignment.post-flair-assignment').findMany({
          where: { post: post.id }
        });
        
        for (const assignment of postFlairAssignments) {
          await strapi.entityService.delete('api::post-flair-assignment.post-flair-assignment', assignment.id);
        }
        
        await strapi.entityService.delete('api::post.post', post.id);
      }
      
      const subrheticEmojiReactions = await strapi.db.query('api::subrhetic-emoji-reaction.subrhetic-emoji-reaction').findMany({
        where: { subrhetic: subrheticId }
      });
      
      for (const reaction of subrheticEmojiReactions) {
        await strapi.entityService.delete('api::subrhetic-emoji-reaction.subrhetic-emoji-reaction', reaction.id);
      }
      
      const subrheticEmojis = await strapi.db.query('api::subrhetic-emoji.subrhetic-emoji').findMany({
        where: { subrhetic: subrheticId }
      });
      
      for (const emoji of subrheticEmojis) {
        await strapi.entityService.delete('api::subrhetic-emoji.subrhetic-emoji', emoji.id);
      }
      
      const postFlairs = await strapi.db.query('api::post-flair.post-flair').findMany({
        where: { subrhetic: subrheticId }
      });
      
      for (const flair of postFlairs) {
        await strapi.entityService.delete('api::post-flair.post-flair', flair.id);
      }
      
      const userFlairs = await strapi.db.query('api::user-flair.user-flair').findMany({
        where: { subrhetic: subrheticId }
      });
      
      for (const flair of userFlairs) {
        await strapi.entityService.delete('api::user-flair.user-flair', flair.id);
      }
      
      const userFlairAssignments = await strapi.db.query('api::user-flair-assignment.user-flair-assignment').findMany({
        where: { subrhetic: subrheticId }
      });
      
      for (const assignment of userFlairAssignments) {
        await strapi.entityService.delete('api::user-flair-assignment.user-flair-assignment', assignment.id);
      }
      
      const subrheticRules = await strapi.db.query('api::subrhetic-rule.subrhetic-rule').findMany({
        where: { subrhetic: subrheticId }
      });
      
      for (const rule of subrheticRules) {
        await strapi.entityService.delete('api::subrhetic-rule.subrhetic-rule', rule.id);
      }
      
      const moderationActions = await strapi.db.query('api::moderation-action.moderation-action').findMany({
        where: { subrhetic: subrheticId }
      });
      
      for (const action of moderationActions) {
        await strapi.entityService.delete('api::moderation-action.moderation-action', action.id);
      }
      
      const subrheticReports = await strapi.db.query('api::report.report').findMany({
        where: { subrhetic: subrheticId }
      });
      
      for (const report of subrheticReports) {
        await strapi.entityService.delete('api::report.report', report.id);
      }
      
      await strapi.entityService.delete('api::subrhetic.subrhetic', subrheticId);
      
      try {
        await strapi.entityService.create('api::user-activity-log.user-activity-log', {
          data: {
            users_permissions_user: deletedBy,
            activity_type: 'subrhetic_delete',
            item_id: subrheticId,
            item_type: 'subrhetic',
            ip_adress: '',
            user_agent: ''
          }
        });
      } catch (error) {
        console.error("Erreur lors de la création du log d'activité:", error);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression en cascade du subrhetic:', error);
      throw error;
    }
  },
  
  async deletePost(ctx) {
    try {
      const { id, postId } = ctx.params;
      
      const post = await strapi.entityService.findOne('api::post.post', postId, {
        populate: ['subrhetic'],
      });
      
      if (!post) {
        return ctx.notFound('Post not found');
      }
      
      const postAny = post as any;
      const subrhetic = postAny.subrhetic;
      
      if (!subrhetic || subrhetic.id != id) {
        return ctx.badRequest('Post does not belong to this subrhetic');
      }
      
      const deletedPost = await strapi.entityService.delete('api::post.post', postId);
      
      return nexus.sanitizeOutput(deletedPost, ctx);
    } catch (error) {
      console.error('Error in deletePost:', error);
      return ctx.badRequest(`An error occurred: ${error.message}`);
    }
  },
}))