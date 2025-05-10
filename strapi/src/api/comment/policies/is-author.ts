import {
  StrapiContext,
  Comment,
  User,
} from "../../../../types/generated/custom";

interface PolicyContext {
  strapi: any;
  [key: string]: any;
}

export default (
  policyContext: PolicyContext,
  config: any,
  { strapi }: { strapi: any }
) => {
  return async (ctx: StrapiContext, next: () => Promise<any>) => {
    try {
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized(
          "Vous devez être connecté pour effectuer cette action"
        );
      }

      const commentId = ctx.params.id;
      if (!commentId) {
        return ctx.badRequest("ID du commentaire requis");
      }

      const comment = (await strapi.entityService.findOne(
        "api::comment.comment",
        commentId,
        { populate: ["author"] }
      )) as Comment;

      if (!comment) {
        return ctx.notFound("Commentaire introuvable");
      }

      if (!comment.author) {
        return ctx.badRequest("Ce commentaire n'a pas d'auteur spécifié");
      }

      const authorId =
        typeof comment.author === "object" ? comment.author.id : comment.author;

      if (authorId === user.id) {
        return await next();
      }

      return ctx.forbidden("Vous n'êtes pas l'auteur de ce commentaire");
    } catch (error) {
      return ctx.internalServerError(
        `Erreur dans la politique d'auteur: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };
};
