export default {
  routes: [
    {
      method: 'PUT',
      path: '/comments/:id',
      handler: 'comment.update',
      config: {
        policies: ['api::comment.is-author'],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/comments/:id',
      handler: 'comment.delete',
      config: {
        policies: ['api::comment.is-author', 'api::comment.is-post-moderator'],
        middlewares: [],
      },
    },
  ],
};