module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/user-follow/follow',
      handler: 'user-follow.follow',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/user-follow/unfollow',
      handler: 'user-follow.unfollow',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};