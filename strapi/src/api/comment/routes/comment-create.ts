export default {
  routes: [
    {
      method: 'POST',
      path: '/comments',
      handler: 'comment.create',
      config: {
        policies: [],
        middlewares: ['api::comment.validate-comment-creation'],
      },
    },
  ],
};