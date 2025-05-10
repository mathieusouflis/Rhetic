export default () => {
  return async (ctx, next) => {
    try {
      const { data } = ctx.request.body;
      
      if (!data) {
        return ctx.badRequest("Données manquantes");
      }
      
      const { content, post, parent, author } = data;
      const user = ctx.state.user;
      
      if (!user) {
        return ctx.unauthorized("Vous devez être connecté pour commenter");
      }
      
      if (author && author !== user.id) {
        return ctx.forbidden("Vous ne pouvez pas créer un commentaire au nom d'un autre utilisateur");
      }
      
      ctx.request.body.data.author = user.id;
      
      if (!content || content.trim() === '') {
        return ctx.badRequest("Le contenu du commentaire est obligatoire");
      }
      
      ctx.request.body.data.publishedDate = new Date();
      
      return await next();
    } catch (error) {
      return ctx.internalServerError(`Erreur lors de la validation du commentaire: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
};