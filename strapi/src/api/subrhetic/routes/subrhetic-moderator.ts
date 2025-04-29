/**
 * Routes for subrhetic administration
 * These routes require moderator permissions
 */

export default {
    routes: [
      {
        method: 'PUT',
        path: '/subrhetics/:id',
        handler: 'subrhetic.update',
        config: {
          policies: ['api::subrhetic.is-moderator'],
          middlewares: [],
        },
      },
      {
        method: 'DELETE',
        path: '/subrhetics/:id',
        handler: 'subrhetic.delete',
        config: {
          policies: ['api::subrhetic.is-moderator'],
          middlewares: [],
        },
      },
      // Gérer les posts du subrhetic (suppression/modération)
      {
        method: 'DELETE',
        path: '/subrhetics/:id/posts/:postId',
        handler: 'subrhetic.deletePost',
        config: {
          policies: ['api::subrhetic.is-moderator'],
          middlewares: [],
        },
      },
    ],
  };