import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::subrhetic.subrhetic', ({ strapi }) => ({
  async join(ctx) {
    try {
      const { id } = ctx.params;
      const userId = ctx.state.user?.id;
      
      if (!userId) {
        return ctx.unauthorized("Vous devez être connecté pour rejoindre un subrhetic");
      }
      
      const subrhetic = await strapi.entityService.findOne(
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
      
      const updatedSubrhetic = await strapi.entityService.update(
        'api::subrhetic.subrhetic', 
        id, 
        {
          data: {
            members: { connect: [userId] }
          },
          populate: ['members']
        }
      );
      
      return updatedSubrhetic;
    } catch (error) {
      console.error('Erreur lors de l\'adhésion au subrhetic:', error);
      return ctx.badRequest(`Une erreur est survenue: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
  
  async leave(ctx) {
    try {
      const { id } = ctx.params;
      const userId = ctx.state.user?.id;
      
      if (!userId) {
        return ctx.unauthorized("Vous devez être connecté pour quitter un subrhetic");
      }
      
      const subrhetic = await strapi.entityService.findOne(
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
      
      const updatedSubrhetic = await strapi.entityService.update(
        'api::subrhetic.subrhetic', 
        id, 
        {
          data: {
            members: { disconnect: [userId] }
          },
          populate: ['members']
        }
      );
      
      return updatedSubrhetic;
    } catch (error) {
      console.error('Erreur lors du départ du subrhetic:', error);
      return ctx.badRequest(`Une erreur est survenue: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
  
  async removeMember(ctx) {
    try {
      const user = ctx.state.user;
      
      if (!user) {
        return ctx.unauthorized("Vous devez être connecté pour effectuer cette action");
      }
      
      const { id, userId } = ctx.params;
      
      if (!id) {
        return ctx.badRequest("ID du Subrhetic requis");
      }
      
      const subrhetic = await strapi.entityService.findOne(
        'api::subrhetic.subrhetic', 
        id, 
        { populate: ['moderators', 'creator', 'members'] }
      );
      
      if (!subrhetic) {
        return ctx.notFound("Subrhetic non trouvé");
      }
      
      let isAuthorized = false;
      
      if (subrhetic.creator) {
        const creatorId = typeof subrhetic.creator === 'object' 
          ? subrhetic.creator.id 
          : subrhetic.creator;
        
        if (creatorId === user.id) {
          isAuthorized = true;
        }
      }
      
      if (!isAuthorized && subrhetic.moderators && Array.isArray(subrhetic.moderators)) {
        isAuthorized = subrhetic.moderators.some((moderator) => {
          const moderatorId = typeof moderator === 'object' 
            ? moderator.id 
            : moderator;
          
          return moderatorId === user.id;
        });
      }
      
      if (!isAuthorized) {
        return ctx.forbidden("Vous n'êtes pas modérateur de ce subrhetic");
      }
      
      const userIdNumber = parseInt(userId);
      
      if (isNaN(userIdNumber)) {
        return ctx.badRequest("ID utilisateur invalide");
      }
      
      if (subrhetic.creator) {
        const creatorId = typeof subrhetic.creator === 'object' 
          ? subrhetic.creator.id 
          : subrhetic.creator;
          
        if (creatorId === userIdNumber) {
          return ctx.badRequest("Le créateur ne peut pas être supprimé du subrhetic");
        }
      }
      
      let isMember = false;
      
      if (subrhetic.members && Array.isArray(subrhetic.members)) {
        isMember = subrhetic.members.some((member) => {
          const memberId = typeof member === 'object' ? member.id : member;
          return memberId === userIdNumber;
        });
      }
      
      if (!isMember) {
        return ctx.badRequest("Cet utilisateur n'est pas membre du subrhetic");
      }
      
      let isModerator = false;
      
      if (subrhetic.moderators && Array.isArray(subrhetic.moderators)) {
        isModerator = subrhetic.moderators.some((moderator) => {
          const moderatorId = typeof moderator === 'object' ? moderator.id : moderator;
          return moderatorId === userIdNumber;
        });
      }
      
      let updateData = {};
      
      if (isModerator) {
        updateData = {
          members: { disconnect: [userIdNumber] },
          moderators: { disconnect: [userIdNumber] }
        };
      } else {
        updateData = {
          members: { disconnect: [userIdNumber] }
        };
      }
      
      const updatedSubrhetic = await strapi.entityService.update(
        'api::subrhetic.subrhetic', 
        id, 
        {
          data: updateData,
          populate: ['members', 'moderators']
        }
      );
      
      return updatedSubrhetic;
    } catch (error) {
      console.error('Erreur lors de la suppression du membre:', error);
      return ctx.badRequest(`Une erreur est survenue: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
  
  async banUser(ctx) {
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
      
      const subrhetic = await strapi.entityService.findOne(
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
      
      if (subrhetic.moderators && Array.isArray(subrhetic.moderators)) {
        const isModerator = subrhetic.moderators.some((mod) => {
          const modId = typeof mod === 'object' ? mod.id : mod;
          return modId === userIdNumber;
        });
        
        if (isModerator) {
          return ctx.badRequest("Impossible de bannir un modérateur");
        }
      }
      
      if (subrhetic.banned_users && Array.isArray(subrhetic.banned_users)) {
        const isBanned = subrhetic.banned_users.some((user) => {
          const bannedId = typeof user === 'object' ? user.id : user;
          return bannedId === userIdNumber;
        });
        
        if (isBanned) {
          return ctx.badRequest("Cet utilisateur est déjà banni");
        }
      }
      
      const updatedSubrhetic = await strapi.entityService.update(
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
      
      await strapi.notification.createNotification(
        'community_ban',
        userIdNumber,
        'subrhetic',
        id,
        {
          subrheticId: id,
          reason: ctx.request.body?.data?.reason || "Violation des règles"
        }
      );
      
      return updatedSubrhetic;
    } catch (error) {
      console.error('Erreur lors du bannissement:', error);
      return ctx.badRequest(`Une erreur est survenue: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
  
  async unbanUser(ctx) {
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
      
      const subrhetic = await strapi.entityService.findOne(
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
      
      const updatedSubrhetic = await strapi.entityService.update(
        'api::subrhetic.subrhetic', 
        id, 
        {
          data: {
            banned_users: { disconnect: [userIdNumber] }
          },
          populate: ['banned_users']
        }
      );
      
      return updatedSubrhetic;
    } catch (error) {
      console.error('Erreur lors du débannissement:', error);
      return ctx.badRequest(`Une erreur est survenue: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
  
  async autoJoin(ctx) {
    try {
      const { id } = ctx.params;
      const userId = ctx.state.user?.id;
      
      if (!userId) {
        return ctx.unauthorized("Vous devez être connecté pour rejoindre un subrhetic");
      }
      
      const subrhetic = await strapi.entityService.findOne(
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
      
      const currentMembers = subrhetic.members?.map(member => 
        typeof member === 'object' ? member.id : member
      ) || [];
      
      if (!currentMembers.includes(userId)) {
        currentMembers.push(userId);
      }
      
      const updatedSubrhetic = await strapi.entityService.update(
        'api::subrhetic.subrhetic', 
        id, 
        {
          data: {
            members: currentMembers
          },
          populate: ['members']
        }
      );
      
      try {
        await strapi.entityService.create('api::user-activity-log.user-activity-log', {
          data: {
            users_permissions_user: userId,
            activity_type: 'subrhetic_join',
            item_id: id,
            item_type: 'subrhetic',
            ip_adress: ctx.request.ip,
            user_agent: ctx.request.header['user-agent']
          }
        });
      } catch (error) {
        console.error("Erreur lors de la création du log d'activité:", error);
      }
      
      return updatedSubrhetic;
    } catch (error) {
      console.error('Erreur lors de la rejointe automatique au subrhetic:', error);
      return ctx.badRequest(`Une erreur est survenue: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}));