export default {
  routes: [
    {
      method: 'POST',
      path: '/subrhetics/:id/join',
      handler: 'membership.join',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/subrhetics/:id/leave',
      handler: 'membership.leave',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/subrhetics/:id/members/:userId',
      handler: 'membership.removeMember',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/subrhetics/:id/ban-user',
      handler: 'membership.banUser',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/subrhetics/:id/unban-user',
      handler: 'membership.unbanUser',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};