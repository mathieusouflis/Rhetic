import { StrapiContext, Subrhetic, User } from '../../../../types/generated/custom';

export default () => {
  return async (ctx: StrapiContext, next: () => Promise<any>) => {
    try {
      const { data } = ctx.request.body;
      
      if (!data) {
        return ctx.badRequest("Données manquantes");
      }
      
      const { subrhetic, title, content } = data;
      const user = ctx.state.user;
      
      if (!user) {
        return ctx.unauthorized("Vous devez être connecté pour publier");
      }
      
      if (!subrhetic) {
        return ctx.badRequest("Vous devez sélectionner un subrhetic");
      }
      
      if (!title || title.trim() === '') {
        return ctx.badRequest("Le titre est obligatoire");
      }
      
      if (!content || content.trim() === '') {
        return ctx.badRequest("Le contenu est obligatoire");
      }
      
      const subData = await strapi.entityService.findOne<Subrhetic>(
        'api::subrhetic.subrhetic',
        subrhetic,
        {
          populate: ['banned_users', 'members']
        }
      );
      
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
      
      if (!data.slug) {
        ctx.request.body.data.slug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
          
        ctx.request.body.data.slug += '-' + Date.now().toString(36);
      }
      
      ctx.request.body.data.author = user.id;
      
      ctx.request.body.data.publishedDate = new Date();
      
      return await next();
    } catch (error) {
      return ctx.internalServerError(`Erreur lors de la validation du post: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
};