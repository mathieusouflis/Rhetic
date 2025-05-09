import { StrapiContext, Subrhetic, User } from '../../../../types/generated/custom';

export default () => {
  return async (ctx: StrapiContext, next: () => Promise<any>) => {
    try {
      const { data } = ctx.request.body;
      
      if (!data) {
        return ctx.badRequest("Données manquantes");
      }
      
      const { subrhetic, title, content, author } = data;
      const user = ctx.state.user;
      
      if (!user) {
        return ctx.unauthorized("Vous devez être connecté pour publier");
      }
      
      if (author && author !== user.id) {
        return ctx.forbidden("Vous ne pouvez pas créer un post au nom d'un autre utilisateur");
      }
      
      ctx.request.body.data.author = user.id;
      
      if (!content || content.trim() === '') {
        return ctx.badRequest("Le contenu est obligatoire");
      }
      
      if (subrhetic && (!title || title.trim() === '')) {
        return ctx.badRequest("Le titre est obligatoire pour les posts dans un subrhetic");
      }
      
      if (subrhetic) {
        const subData = await strapi.entityService.findOne(
          'api::subrhetic.subrhetic',
          subrhetic,
          {
            populate: ['banned_users', 'members']
          }
        ) as Subrhetic;
        
        if (!subData) {
          return ctx.notFound("Subrhetic introuvable");
        }
        
        const isBanned = subData.banned_users?.some((bannedUser) => {
          const bannedId = typeof bannedUser === 'object' ? bannedUser.id : bannedUser;
          return bannedId === user.id;
        });
        
        if (isBanned) {
          return ctx.forbidden("Vous êtes banni de ce subrhetic");
        }
        
        if (subData.is_private && subData.members) {
          const isMember = subData.members.some((member) => {
            const memberId = typeof member === 'object' ? member.id : member;
            return memberId === user.id;
          });
          
          if (!isMember) {
            return ctx.forbidden("Vous devez être membre de ce subrhetic privé pour publier");
          }
        }
      }
      
      ctx.request.body.data.publishedDate = new Date();
      
      try {
      } catch (error) {
        console.error("Erreur lors de la modération du contenu par IA:", error);
      }
      
      return await next();
    } catch (error) {
      return ctx.internalServerError(`Erreur lors de la validation du post: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
};