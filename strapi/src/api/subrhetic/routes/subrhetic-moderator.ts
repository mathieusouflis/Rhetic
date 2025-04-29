/**
 * Custom routes for subrhetic moderator management
 */

export default {
    routes: [
      {
        method: 'POST',
        path: '/subrhetics/:id/moderators',
        handler: 'moderator.addModerator',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'DELETE',
        path: '/subrhetics/:id/moderators',
        handler: 'moderator.removeModerator',
        config: {
          policies: [],
          middlewares: [],
        },
      },
    ],
  };