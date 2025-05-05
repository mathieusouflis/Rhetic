import { factories } from '@strapi/strapi';
import { StrapiContext, Subrhetic, User } from '../../../../types/generated/custom';

export default factories.createCoreController('api::subrhetic.subrhetic', ({ strapi }) => ({
  async join(ctx: StrapiContext) {
    try {
      const { id } = ctx.params;
      const userId = ctx.state.user?.id;
      
      if (!userId) {
        return ctx.unauthorized("Vous devez être connecté pour rejoindre un subrhetic");
      }
      
      const subrhetic = await strapi.entityService.findOne<Subrhetic>(
        'api::subrhetic.subrhetic', 
        id, 
        { populate: ['members', 'banned_users'] }
      );
      
      if (!subrhetic) {
        return ctx.notFound("Subrhetic introuvable");
      }
      
      if (subrhetic.banned_users && Array.isArray(subrhetic.banned_users)) {
        const isBanned = subrhetic.banned_users.some((user) => {
          const bannedId = typeof user === 'object' ? user.id : user;
          return bannedId === userId;
        });
        
        if (isBanned) {
          return ctx.forbidden("Vous êtes banni de ce subrhetic");
        }
      }
      
      if (subrhetic.members && Array.isArray(subrhetic.members)) {
        const isMember = subrhetic.members.some((user) => {
          const memberId = typeof user === 'object' ? user.id : user;
          return memberId === userId;
        });
        
        if (isMember) {
          return ctx.badRequest("Vous êtes déjà membre de ce subrhetic");
        }
      }
      
      const updatedSubrhetic = await strapi.entityService.update<Subrhetic>(
        'api::subrhetic.subrhetic', 
        id, 
        {
          data: {
            members: { connect: [userId] }
          },
          populate: ['members']
        }
      );
      
      return this.sanitizeOutput(updatedSubrhetic, ctx);
    } catch (error) {
      console.error('Erreur lors de l\'adhésion au subrhetic:', error);
      return ctx.badRequest(`Une erreur est survenue: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
  
  async leave(ctx: StrapiContext) {
    try {
      const { id } = ctx.params;
      const userId = ctx.state.user?.id;
      
      if (!userId) {
        return ctx.unauthorized("Vous devez être connecté pour quitter un subrhetic");
      }
      
      const subrhetic = await strapi.entityService.findOne<Subrhetic>(
        'api::subrhetic.subrhetic', 
        id, 
        { populate: ['members', 'creator'] }
      );
      
      if (!subrhetic) {
        return ctx.notFound("Subrhetic introuvable");
      }
      
      if (subrhetic.creator) {
        const creatorId = typeof subrhetic.creator === 'object' 
          ? subrhetic.creator.id 
          : subrhetic.creator;
          
        if (creatorId === userId) {
          return ctx.badRequest("Le créateur ne peut pas quitter son subrhetic");
        }
      }
      
      if (subrhetic.members && Array.isArray(subrhetic.members)) {
        const isMember = subrhetic.members.some((user) => {
          const memberId = typeof user === 'object' ? user.id : user;
          return memberId === userId;
        });
        
        if (!isMember) {
          return ctx.badRequest("Vous n'êtes pas membre de ce subrhetic");
        }
      }
      
      const updatedSubrhetic = await strapi.entityService.update<Subrhetic>(
        'api::subrhetic.subrhetic', 
        id, 
        {
          data: {
            members: { disconnect: [userId] }
          },
          populate: ['members']
        }
      );
      
      return this.sanitizeOutput(updatedSubrhetic, ctx);
    } catch (error) {
      console.error('Erreur lors du départ du subrhetic:', error);
      return ctx.badRequest(`Une erreur est survenue: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
  
  async banUser(ctx: StrapiContext) {
    try {
      const { id } = ctx.params;
      const { userId } = ctx.request.body?.data || ctx.request.body || {};
      
      if (!userId) {
        return ctx.badRequest("ID utilisateur requis");
      }
      
      const userIdNumber = parseInt(userId);
      
      if (isNaN(userIdNumber)) {
        return ctx.badRequest("ID utilisateur invalide");
      }
      
      const subrhetic = await strapi.entityService.findOne<Subrhetic>(
        'api::subrhetic.subrhetic', 
        id, 
        { populate: ['banned_users', 'members', 'creator', 'moderators'] }
      );
      
      if (!subrhetic) {
        return ctx.notFound("Subrhetic introuvable");
      }
      
      if (subrhetic.creator) {
        const creatorId = typeof subrhetic.creator === 'object' 
          ? subrhetic.creator.id 
          : subrhetic.creator;
          
        if (creatorId === userIdNumber) {
          return ctx.badRequest("Impossible de bannir le créateur du subrhetic");
        }
      }
      
      // Vérifier si l'utilisateur à bannir est modérateur
      if (subrhetic.moderators && Array.isArray(subrhetic.moderators)) {
        const isModerator = subrhetic.moderators.some((mod) => {
          const modId = typeof mod === 'object' ? mod.id : mod;
          return modId === userIdNumber;
        });
        
        if (isModerator) {
          return ctx.badRequest("Impossible de bannir un modérateur");
        }
      }
      
      // Vérifier si l'utilisateur est déjà banni
      if (subrhetic.banned_users && Array.isArray(subrhetic.banned_users)) {
        const isBanned = subrhetic.banned_users.some((user) => {
          const bannedId = typeof user === 'object' ? user.id : user;
          return bannedId === userIdNumber;
        });
        
        if (isBanned) {
          return ctx.badRequest("Cet utilisateur est déjà banni");
        }
      }
      
      const updatedSubrhetic = await strapi.entityService.update<Subrhetic>(
        'api::subrhetic.subrhetic', 
        id, 
        {
          data: {
            banned_users: { connect: [userIdNumber] },
            members: { disconnect: [userIdNumber] }
          },
          populate: ['banned_users', 'members']
        }
      );
      
      return this.sanitizeOutput(updatedSubrhetic, ctx);
    } catch (error) {
      console.error('Erreur lors du bannissement:', error);
      return ctx.badRequest(`Une erreur est survenue: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
  
  async unbanUser(ctx: StrapiContext) {
    try {
      const { id } = ctx.params;
      const { userId } = ctx.request.body?.data || ctx.request.body || {};
      
      if (!userId) {
        return ctx.badRequest("ID utilisateur requis");
      }
      
      const userIdNumber = parseInt(userId);
      
      if (isNaN(userIdNumber)) {
        return ctx.badRequest("ID utilisateur invalide");
      }
      
      const subrhetic = await strapi.entityService.findOne<Subrhetic>(
        'api::subrhetic.subrhetic', 
        id, 
        { populate: ['banned_users'] }
      );
      
      if (!subrhetic) {
        return ctx.notFound("Subrhetic introuvable");
      }
      
      if (subrhetic.banned_users && Array.isArray(subrhetic.banned_users)) {
        const isBanned = subrhetic.banned_users.some((user) => {
          const bannedId = typeof user === 'object' ? user.id : user;
          return bannedId === userIdNumber;
        });
        
        if (!isBanned) {
          return ctx.badRequest("Cet utilisateur n'est pas banni");
        }
      }
      
      const updatedSubrhetic = await strapi.entityService.update<Subrhetic>(
        'api::subrhetic.subrhetic', 
        id, 
        {
          data: {
            banned_users: { disconnect: [userIdNumber] }
          },
          populate: ['banned_users']
        }
      );
      
      return this.sanitizeOutput(updatedSubrhetic, ctx);
    } catch (error) {
      console.error('Erreur lors du débannissement:', error);
      return ctx.badRequest(`Une erreur est survenue: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}));