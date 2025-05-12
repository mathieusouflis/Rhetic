module.exports = {
  routes: [
    {
      method: "POST",
      path: "/user-follows/:id/follow",
      handler: "user-follow.follow",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/user-follows/:id/unfollow",
      handler: "user-follow.unfollow",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
