export default {
  routes: [
    {
      method: 'POST',
      path: '/posts/:id/upvote',
      handler: 'vote.upvote',
      config: {
        policies: [],
        middlewares: ['api::post.vote-validator'],
      },
    },
    {
      method: 'POST',
      path: '/posts/:id/downvote',
      handler: 'vote.downvote',
      config: {
        policies: [],
        middlewares: ['api::post.vote-validator'],
      },
    },
  ],
};