export default {
  routes: [
    {
      method: 'POST',
      path: '/posts',
      handler: 'post.create',
      config: {
        policies: [],
        middlewares: ['api::post.subrhetic-post-validator'],
      },
    },
    {
      method: 'PUT',
      path: '/posts/:id',
      handler: 'post.update',
      config: {
        policies: ['api::post.is-author'],
        middlewares: [],
      },
    },
  ],
};