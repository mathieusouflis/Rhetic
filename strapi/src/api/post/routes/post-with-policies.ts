export default {
    routes: [
      {
        method: 'PUT',
        path: '/posts/:id',
        handler: 'post.update',
        config: {
          policies: ['api::post.is-author'],
          middlewares: [],
        },
      },
      {
        method: 'DELETE',
        path: '/posts/:id',
        handler: 'post.delete',
        config: {
          policies: ['api::post.is-author', 'api::post.is-sub-moderator'],
          middlewares: [],
        },
      },
    ],
  };