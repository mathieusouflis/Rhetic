import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::comment.comment', ({ strapi }) => ({
  async upvote(ctx) {
    try {
      const { id } = ctx.params;
      const userId = ctx.state.user?.id;
      
      if (!userId) {
        return ctx.unauthorized("Vous devez être connecté pour voter");
      }
      
      const comment = await strapi.entityService.findOne(
        'api::comment.comment',
        id,
        { 
          populate: {
            author: true,
            post: {
              populate: {
                subrhetic: {
                  populate: ['banned_users']
                }
              }
            }
          }
        }
      );
      
      if (!comment) {
        return ctx.notFound("Commentaire introuvable");
      }
      
      if (comment.post && typeof comment.post === 'object') {
        const post = comment.post;
        
        if (post.subrhetic && typeof post.subrhetic === 'object') {
          const subrhetic = post.subrhetic;
          
          if (subrhetic.banned_users && Array.isArray(subrhetic.banned_users)) {
            const isBanned = subrhetic.banned_users.some(
              (banned: any) => {
                const bannedId = typeof banned === 'object' ? banned.id : banned;
                return bannedId === userId;
              }
            );
            
            if (isBanned) {
              return ctx.forbidden("Vous êtes banni de ce subrhetic et ne pouvez pas voter");
            }
          }
        }
      }
      
      const existingVote = await strapi.db.query('api::vote.vote').findOne({
        where: {
          comment: id,
          user: userId
        }
      });
      
      if (existingVote) {
        if (existingVote.type === 'upvote') {
          await strapi.entityService.delete('api::vote.vote', existingVote.id);
        } else {
          await strapi.entityService.update('api::vote.vote', existingVote.id, {
            data: { type: 'upvote' }
          });
        }
      } else {
        await strapi.entityService.create('api::vote.vote', {
          data: {
            type: 'upvote',
            user: userId,
            comment: id
          }
        });
      }
      
      const allVotes = await strapi.db.query('api::vote.vote').findMany({
        where: { comment: id }
      });
      
      const upvotes = allVotes.filter(vote => vote.type === 'upvote').length;
      const downvotes = allVotes.filter(vote => vote.type === 'downvote').length;
      
      const updatedComment = await strapi.entityService.update('api::comment.comment', id, {
        data: {
          upvotes,
          downvotes,
          total_votes: upvotes - downvotes
        }
      });
      
      const milestones = [100, 500, 1000, 5000, 10000];
      if (comment.author) {
        const authorId = typeof comment.author === 'object' ? comment.author.id : comment.author;
        
        if (milestones.includes(upvotes)) {
          await strapi.notification.createNotification(
            'like_milestone',
            authorId,
            'comment',
            id,
            {
              contentType: 'comment',
              milestone: upvotes
            }
          );
        }
      }
      
      return updatedComment;
    } catch (error) {
      console.error('Error in comment upvote:', error);
      return ctx.badRequest(`An error occurred: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
  
  async downvote(ctx) {
    try {
      const { id } = ctx.params;
      const userId = ctx.state.user?.id;
      
      if (!userId) {
        return ctx.unauthorized("Vous devez être connecté pour voter");
      }
      
      const comment = await strapi.entityService.findOne(
        'api::comment.comment',
        id,
        { 
          populate: {
            post: {
              populate: {
                subrhetic: {
                  populate: ['banned_users']
                }
              }
            }
          }
        }
      );
      
      if (!comment) {
        return ctx.notFound("Commentaire introuvable");
      }
      
      if (comment.post && typeof comment.post === 'object') {
        const post = comment.post;
        
        if (post.subrhetic && typeof post.subrhetic === 'object') {
          const subrhetic = post.subrhetic;
          
          if (subrhetic.banned_users && Array.isArray(subrhetic.banned_users)) {
            const isBanned = subrhetic.banned_users.some(
              (banned: any) => {
                const bannedId = typeof banned === 'object' ? banned.id : banned;
                return bannedId === userId;
              }
            );
            
            if (isBanned) {
              return ctx.forbidden("Vous êtes banni de ce subrhetic et ne pouvez pas voter");
            }
          }
        }
      }
      
      const existingVote = await strapi.db.query('api::vote.vote').findOne({
        where: {
          comment: id,
          user: userId
        }
      });
      
      if (existingVote) {
        if (existingVote.type === 'downvote') {
          await strapi.entityService.delete('api::vote.vote', existingVote.id);
        } else {
          await strapi.entityService.update('api::vote.vote', existingVote.id, {
            data: { type: 'downvote' }
          });
        }
      } else {
        await strapi.entityService.create('api::vote.vote', {
          data: {
            type: 'downvote',
            user: userId,
            comment: id
          }
        });
      }
      
      const allVotes = await strapi.db.query('api::vote.vote').findMany({
        where: { comment: id }
      });
      
      const upvotes = allVotes.filter(vote => vote.type === 'upvote').length;
      const downvotes = allVotes.filter(vote => vote.type === 'downvote').length;
      
      const updatedComment = await strapi.entityService.update('api::comment.comment', id, {
        data: {
          upvotes,
          downvotes,
          total_votes: upvotes - downvotes
        }
      });
      
      return updatedComment;
    } catch (error) {
      console.error('Error in comment downvote:', error);
      return ctx.badRequest(`An error occurred: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
}));