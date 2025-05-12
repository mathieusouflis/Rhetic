import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::post.post', ({ strapi }) => ({
  async create(ctx) {
    try {
      const { data } = ctx.request.body;
      const { title, content, subrhetic } = data;
      const userId = ctx.state.user?.id;
      
      if (!userId) {
        return ctx.unauthorized("Vous devez être connecté pour créer un post");
      }
      
      const postData = {
        ...data,
        author: userId,
        publishedDate: new Date()
      };
      
      if ((!title || title.trim() === '') && !subrhetic) {
        postData.title = '';
      }
      
      const entity = await strapi.entityService.create('api::post.post', {
        data: postData,
        populate: ['author', 'subrhetic', 'Media']
      });
      
      try {
        await strapi.entityService.create('api::user-activity-log.user-activity-log', {
          data: {
            users_permissions_user: userId,
            activity_type: 'post_create',
            item_id: entity.id,
            item_type: 'post',
            ip_adress: ctx.request.ip,
            user_agent: ctx.request.header['user-agent']
          }
        });
      } catch (error) {
      }
      
      if (entity.subrhetic) {
        const subrheticId = typeof entity.subrhetic === 'object' ? entity.subrhetic.id : entity.subrhetic;
        
        const subrhetic = await strapi.entityService.findOne('api::subrhetic.subrhetic', subrheticId, {
          populate: ['members']
        });
        
        if (subrhetic && subrhetic.members && Array.isArray(subrhetic.members)) {
          for (const member of subrhetic.members) {
            const memberId = typeof member === 'object' ? member.id : member;
            
            if (memberId !== userId) {
              await strapi.notification.createNotification(
                'new_post',
                memberId,
                'post',
                entity.id,
                {
                  postId: entity.id,
                  subrheticId: subrheticId,
                  postTitle: entity.title || 'Nouveau post'
                }
              );
            }
          }
        }
      }
      
      return entity;
    } catch (error) {
      return ctx.badRequest(`Une erreur est survenue: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
  
  async update(ctx) {
    try {
      const { id } = ctx.params;
      const { data } = ctx.request.body;
      const userId = ctx.state.user?.id;
      
      if (!userId) {
        return ctx.unauthorized("Vous devez être connecté pour modifier un post");
      }
      
      const post = await strapi.entityService.findOne('api::post.post', id, {
        populate: ['author', 'subrhetic']
      });
      
      if (!post) {
        return ctx.notFound("Post introuvable");
      }
      
      const authorId = typeof post.author === 'object' 
        ? post.author.id 
        : post.author;
      
      if (authorId !== userId) {
        return ctx.forbidden("Vous n'êtes pas l'auteur de ce post");
      }
      
      if (post.subrhetic) {
        const { title } = data;
        if (!title || title.trim() === '') {
          return ctx.badRequest("Le titre est obligatoire pour les posts dans un subrhetic");
        }
      }
      
      const updatedEntity = await strapi.entityService.update('api::post.post', id, {
        data,
        populate: ['author', 'subrhetic', 'Media']
      });
      
      return updatedEntity;
    } catch (error) {
      return ctx.badRequest(`Une erreur est survenue: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
  
  async delete(ctx) {
    try {
      const { id } = ctx.params;
      const userId = ctx.state.user?.id;
      
      if (!userId) {
        return ctx.unauthorized("Vous devez être connecté pour supprimer un post");
      }
      
      const post = await strapi.entityService.findOne('api::post.post', id, {
        populate: {
          author: true,
          subrhetic: {
            populate: ['creator', 'moderators']
          }
        }
      });
      
      if (!post) {
        return ctx.notFound("Post introuvable");
      }
      
      const authorId = typeof post.author === 'object' ? post.author.id : post.author;
      
      const deletePostAndRelatedContent = async () => {
        const comments = await strapi.db.query('api::comment.comment').findMany({
          where: { post: id }
        });
        
        for (const comment of comments) {
          await strapi.entityService.delete('api::comment.comment', comment.id);
        }
        
        const postVotes = await strapi.db.query('api::vote.vote').findMany({
          where: { post: id }
        });
        
        for (const vote of postVotes) {
          await strapi.entityService.delete('api::vote.vote', vote.id);
        }
        
        const savedItems = await strapi.db.query('api::saved-item.saved-item').findMany({
          where: { post: id }
        });
        
        for (const savedItem of savedItems) {
          await strapi.entityService.delete('api::saved-item.saved-item', savedItem.id);
        }
        
        const reports = await strapi.db.query('api::report.report').findMany({
          where: { post: id }
        });
        
        for (const report of reports) {
          await strapi.entityService.delete('api::report.report', report.id);
        }
        
        const postFlairAssignments = await strapi.db.query('api::post-flair-assignment.post-flair-assignment').findMany({
          where: { post: id }
        });
        
        for (const assignment of postFlairAssignments) {
          await strapi.entityService.delete('api::post-flair-assignment.post-flair-assignment', assignment.id);
        }
        
        const deletedEntity = await strapi.entityService.delete('api::post.post', id);
        
        return deletedEntity;
      };
      
      if (authorId === userId) {
        return await deletePostAndRelatedContent();
      }
      
      const userWithRole = await strapi.entityService.findOne('plugin::users-permissions.user', userId, {
        populate: ['role']
      });
      
      if (userWithRole?.role?.type === 'admin') {
        return await deletePostAndRelatedContent();
      }
      
      if (post.subrhetic && typeof post.subrhetic === 'object') {
        const subrhetic = post.subrhetic;
        
        if (subrhetic.creator) {
          const creatorId = typeof subrhetic.creator === 'object' 
            ? subrhetic.creator.id 
            : subrhetic.creator;
          
          if (creatorId === userId) {
            return await deletePostAndRelatedContent();
          }
        }
        
        if (subrhetic.moderators && Array.isArray(subrhetic.moderators)) {
          const isModerator = subrhetic.moderators.some((moderator) => {
            const moderatorId = typeof moderator === 'object' 
              ? moderator.id 
              : moderator;
            
            return moderatorId === userId;
          });
          
          if (isModerator) {
            return await deletePostAndRelatedContent();
          }
        }
      }
      
      return ctx.forbidden("Vous n'avez pas la permission de supprimer ce post");
    } catch (error) {
      return ctx.badRequest(`Une erreur est survenue: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}));