/**
 * Custom routes for post voting
 */

export default {
    routes: [
      {
        method: 'POST',
        path: '/posts/:id/upvote',
        handler: 'vote.upvote',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'POST',
        path: '/posts/:id/downvote',
        handler: 'vote.downvote',
        config: {
          policies: [],
          middlewares: [],
        },
      },
    ],
  };