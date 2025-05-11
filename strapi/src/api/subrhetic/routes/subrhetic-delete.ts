export default {
  routes: [
    {
      method: 'DELETE',
      path: '/subrhetics/:id',
      handler: 'subrhetic.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
}