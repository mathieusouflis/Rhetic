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
      
      try {
      } catch (error) {
        console.error("Erreur lors de la modération IA:", error);
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
        console.error("Erreur lors de la création du log d'activité:", error);
      }
      
      return entity;
    } catch (error) {
      console.error("Erreur lors de la création du post:", error);
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
      console.error("Erreur lors de la mise à jour du post:", error);
      return ctx.badRequest(`Une erreur est survenue: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}));