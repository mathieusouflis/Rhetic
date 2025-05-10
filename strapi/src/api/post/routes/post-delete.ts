export default {
  routes: [
    {
      method: 'DELETE',
      path: '/posts/:id',
      handler: 'post.delete',
      config: {
        policies: ['api::post.delete-permission'],
        middlewares: [],
      },
    },
  ],
};