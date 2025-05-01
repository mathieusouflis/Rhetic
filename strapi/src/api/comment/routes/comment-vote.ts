/**
 * Custom routes for comment voting
 */

export default {
    routes: [
      {
        method: 'POST',
        path: '/comments/:id/upvote',
        handler: 'vote.upvote',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'POST',
        path: '/comments/:id/downvote',
        handler: 'vote.downvote',
        config: {
          policies: [],
          middlewares: [],
        },
      },
    ],
  };