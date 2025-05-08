export default {
  routes: [
    {
      method: 'POST',
      path: '/subrhetics',
      handler: 'custom.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};