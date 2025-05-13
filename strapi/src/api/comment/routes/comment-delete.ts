export default {
  routes: [
    {
      method: 'DELETE',
      path: '/comments/:id',
      handler: 'comment.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};