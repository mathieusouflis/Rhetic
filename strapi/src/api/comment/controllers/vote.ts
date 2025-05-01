/**
 * Comment vote controller 
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::comment.comment', ({ strapi }) => ({
  async upvote(ctx) {
    try {
      const { id } = ctx.params;
      
      // @ts-ignore 
      const comment = await strapi.entityService.findOne('api::comment.comment', id, {
        populate: '*',
      });
      
      if (!comment) {
        return ctx.notFound('Comment not found');
      }
      
      console.log('Comment structure:', JSON.stringify(comment, null, 2));
      
      const commentAny = comment as any;
      
      let authorField = 'author';
      if (commentAny.Author !== undefined) {
        authorField = 'Author';
      }
      
      let upvoteFieldValue = 0;
      let upvoteFieldName = '';
      
      if (typeof commentAny.upvotes === 'number') {
        upvoteFieldName = 'upvotes';
        upvoteFieldValue = commentAny.upvotes;
      } else if (typeof commentAny.upVote === 'number') {
        upvoteFieldName = 'upVote';
        upvoteFieldValue = commentAny.upVote;
      } else if (typeof commentAny.Upvotes === 'number') {
        upvoteFieldName = 'Upvotes';
        upvoteFieldValue = commentAny.Upvotes;
      } else if (typeof commentAny.UpVote === 'number') {
        upvoteFieldName = 'UpVote';
        upvoteFieldValue = commentAny.UpVote;
      } else {
        upvoteFieldName = 'upvotes';
        console.warn(`No upvote field found in comment, defaulting to '${upvoteFieldName}'`);
      }
      
      const updateData = {};
      // @ts-ignore 
      updateData[upvoteFieldName] = upvoteFieldValue + 1;
      
      // @ts-ignore 
      const updatedComment = await strapi.entityService.update('api::comment.comment', id, {
        data: updateData,
      });
      
      return this.sanitizeOutput(updatedComment, ctx);
    } catch (error) {
      console.error('Error in comment upvote:', error);
      return ctx.badRequest(`An error occurred: ${error.message}`);
    }
  },
  
  async downvote(ctx) {
    try {
      const { id } = ctx.params;
      
      // @ts-ignore 
      const comment = await strapi.entityService.findOne('api::comment.comment', id, {
        populate: '*',
      });
      
      if (!comment) {
        return ctx.notFound('Comment not found');
      }
      
      console.log('Comment structure:', JSON.stringify(comment, null, 2));
      
      const commentAny = comment as any;
      
      let authorField = 'author';
      if (commentAny.Author !== undefined) {
        authorField = 'Author';
      }
      
      let downvoteFieldValue = 0;
      let downvoteFieldName = '';
      
      if (typeof commentAny.downvotes === 'number') {
        downvoteFieldName = 'downvotes';
        downvoteFieldValue = commentAny.downvotes;
      } else if (typeof commentAny.downVote === 'number') {
        downvoteFieldName = 'downVote';
        downvoteFieldValue = commentAny.downVote;
      } else if (typeof commentAny.Downvotes === 'number') {
        downvoteFieldName = 'Downvotes';
        downvoteFieldValue = commentAny.Downvotes;
      } else if (typeof commentAny.DownVote === 'number') {
        downvoteFieldName = 'DownVote';
        downvoteFieldValue = commentAny.DownVote;
      } else {
        downvoteFieldName = 'downvotes';
        console.warn(`No downvote field found in comment, defaulting to '${downvoteFieldName}'`);
      }
      
      const updateData = {};
      // @ts-ignore 
      updateData[downvoteFieldName] = downvoteFieldValue + 1;
      
      // @ts-ignore 
      const updatedComment = await strapi.entityService.update('api::comment.comment', id, {
        data: updateData,
      });
      
      return this.sanitizeOutput(updatedComment, ctx);
    } catch (error) {
      console.error('Error in comment downvote:', error);
      return ctx.badRequest(`An error occurred: ${error.message}`);
    }
  },
}));