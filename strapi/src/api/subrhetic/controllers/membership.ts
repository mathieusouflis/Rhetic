import { factories } from '@strapi/strapi';
import { StrapiContext, Subrhetic, User } from '../../../types/generated/custom';

interface MembershipControllerContext extends StrapiContext {
  params: {
    id: string;
    [key: string]: any;
  };
  request: {
    body: {
      userId?: string;
      [key: string]: any;
    };
    [key: string]: any;
  };
}

export default factories.createCoreController('api::subrhetic.subrhetic', ({ strapi }) => ({
  async join(ctx: MembershipControllerContext) {
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
      
      const isBanned = subrhetic.banned_users?.some((user: User) => user.id === userId);
      
      if (isBanned) {
        return ctx.forbidden("Vous êtes banni de ce subrhetic");
      }
      
      const isMember = subrhetic.members?.some((user: User) => user.id === userId);
      
      if (isMember) {
        return ctx.badRequest("Vous êtes déjà membre de ce subrhetic");
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
    } catch (error: any) {
      console.error('Erreur lors de l\'adhésion au subrhetic:', error);
      return ctx.badRequest(`Une erreur est survenue: ${error.message}`);
    }
  },
  
  async leave(ctx: MembershipControllerContext) {
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
      
      if (subrhetic.creator && subrhetic.creator.id === userId) {
        return ctx.badRequest("Le créateur ne peut pas quitter son subrhetic");
      }
      
      const isMember = subrhetic.members?.some((user: User) => user.id === userId);
      
      if (!isMember) {
        return ctx.badRequest("Vous n'êtes pas membre de ce subrhetic");
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
    } catch (error: any) {
      console.error('Erreur lors du départ du subrhetic:', error);
      return ctx.badRequest(`Une erreur est survenue: ${error.message}`);
    }
  },
  
  async banUser(ctx: MembershipControllerContext) {
    try {
      const { id } = ctx.params;
      const { userId } = ctx.request.body;
      
      if (!userId) {
        return ctx.badRequest("ID utilisateur requis");
      }
      
      const subrhetic = await strapi.entityService.findOne<Subrhetic>(
        'api::subrhetic.subrhetic', 
        id, 
        { populate: ['banned_users', 'members', 'creator', 'moderators'] }
      );
      
      if (!subrhetic) {
        return ctx.notFound("Subrhetic introuvable");
      }
      
      if (subrhetic.creator && subrhetic.creator.id === parseInt(userId)) {
        return ctx.badRequest("Impossible de bannir le créateur du subrhetic");
      }
      
      const isModerator = subrhetic.moderators?.some(
        (mod: User) => mod.id === parseInt(userId)
      );
      
      if (isModerator) {
        return ctx.badRequest("Impossible de bannir un modérateur");
      }
      
      const isBanned = subrhetic.banned_users?.some(
        (user: User) => user.id === parseInt(userId)
      );
      
      if (isBanned) {
        return ctx.badRequest("Cet utilisateur est déjà banni");
      }
      
      const updatedSubrhetic = await strapi.entityService.update<Subrhetic>(
        'api::subrhetic.subrhetic', 
        id, 
        {
          data: {
            banned_users: { connect: [userId] },
            members: { disconnect: [userId] }
          },
          populate: ['banned_users', 'members']
        }
      );
      
      return this.sanitizeOutput(updatedSubrhetic, ctx);
    } catch (error: any) {
      console.error('Erreur lors du bannissement:', error);
      return ctx.badRequest(`Une erreur est survenue: ${error.message}`);
    }
  },
  
  async unbanUser(ctx: MembershipControllerContext) {
    try {
      const { id } = ctx.params;
      const { userId } = ctx.request.body;
      
      if (!userId) {
        return ctx.badRequest("ID utilisateur requis");
      }
      
      const subrhetic = await strapi.entityService.findOne<Subrhetic>(
        'api::subrhetic.subrhetic', 
        id, 
        { populate: ['banned_users'] }
      );
      
      if (!subrhetic) {
        return ctx.notFound("Subrhetic introuvable");
      }
      
      const isBanned = subrhetic.banned_users?.some(
        (user: User) => user.id === parseInt(userId)
      );
      
      if (!isBanned) {
        return ctx.badRequest("Cet utilisateur n'est pas banni");
      }
      
      const updatedSubrhetic = await strapi.entityService.update<Subrhetic>(
        'api::subrhetic.subrhetic', 
        id, 
        {
          data: {
            banned_users: { disconnect: [userId] }
          },
          populate: ['banned_users']
        }
      );
      
      return this.sanitizeOutput(updatedSubrhetic, ctx);
    } catch (error: any) {
      console.error('Erreur lors du débannissement:', error);
      return ctx.badRequest(`Une erreur est survenue: ${error.message}`);
    }
  }
}));