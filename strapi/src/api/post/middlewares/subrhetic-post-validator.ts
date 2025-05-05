export default () => {
  return async (ctx, next) => {
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
      
      // @ts-ignore 
      const subData = await strapi.entityService.findOne('api::subrhetic.subrhetic', subrhetic, {
        populate: ['banned_users', 'members']
      });
      
      if (!subData) {
        return ctx.notFound("Subrhetic introuvable");
      }
      
      const isBanned = subData.banned_users?.some(
        bannedUser => bannedUser.id === user.id
      );
      
      if (isBanned) {
        return ctx.forbidden("Vous êtes banni de ce subrhetic");
      }
      
      if (subData.is_private && subData.members) {
        const isMember = subData.members.some(
          member => member.id === user.id
        );
        
        if (!isMember) {
          return ctx.forbidden("Vous devez être membre de ce subrhetic privé pour publier");
        }
      }
      
      // Générer un slug à partir du titre si ce n'est pas fourni
      if (!data.slug) {
        ctx.request.body.data.slug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
          
        // Ajouter un timestamp pour éviter les doublons
        ctx.request.body.data.slug += '-' + Date.now().toString(36);
      }
      
      // Définir l'auteur comme l'utilisateur actuel
      ctx.request.body.data.author = user.id;
      
      // Définir la date de publication
      ctx.request.body.data.publishedDate = new Date();
      
      return await next();
    } catch (error) {
      ctx.internalServerError(`Erreur lors de la validation du post: ${error.message}`);
    }
  };
};