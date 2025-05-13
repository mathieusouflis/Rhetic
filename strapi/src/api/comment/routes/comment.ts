import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::comment.comment', {
  config: {
    find: {
      middlewares: ['api::comment.populate-statistics']
    },
    findOne: {
      middlewares: ['api::comment.populate-statistics']
    }
  }
});