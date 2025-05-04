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
    ],
  };