export default {
    routes: [
      {
        method: 'POST',
        path: '/votes',
        handler: 'vote.create',
        config: {
          policies: [],
          middlewares: ['api::vote.vote-total-calculator'],
        },
      },
      {
        method: 'PUT',
        path: '/votes/:id',
        handler: 'vote.update',
        config: {
          policies: [],
          middlewares: ['api::vote.vote-total-calculator'],
        },
      },
      {
        method: 'DELETE',
        path: '/votes/:id',
        handler: 'vote.delete',
        config: {
          policies: [],
          middlewares: ['api::vote.vote-total-calculator'],
        },
      },
    ],
  };