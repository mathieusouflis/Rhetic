import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::subrhetic.subrhetic', ({ strapi, nexus }) => ({
  async deletePost(ctx) {
    try {
      const { id, postId } = ctx.params;
      
      const post = await strapi.entityService.findOne('api::post.post', postId, {
        populate: ['subrhetic'],
      });
      
      if (!post) {
        return ctx.notFound('Post not found');
      }
      
      const postAny = post as any;
      const subrhetic = postAny.subrhetic;
      
      if (!subrhetic || subrhetic.id != id) {
        return ctx.badRequest('Post does not belong to this subrhetic');
      }
      
      const deletedPost = await strapi.entityService.delete('api::post.post', postId);
      
      return nexus.sanitizeOutput(deletedPost, ctx);
    } catch (error) {
      console.error('Error in deletePost:', error);
      return ctx.badRequest(`An error occurred: ${error.message}`);
    }
  },
}));