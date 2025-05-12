export default {
  routes: [
    {
      method: 'POST',
      path: '/subrhetics/:id/auto-join',
      handler: 'membership.autoJoin',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};