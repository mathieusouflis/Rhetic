export default {
  routes: [
    {
      method: 'POST',
      path: '/comments/:id/upvote',
      handler: 'vote.upvote',
      config: {
        policies: [],
        middlewares: ['api::comment.vote-validator'],
      },
    },
    {
      method: 'POST',
      path: '/comments/:id/downvote',
      handler: 'vote.downvote',
      config: {
        policies: [],
        middlewares: ['api::comment.vote-validator'],
      },
    },
  ],
};