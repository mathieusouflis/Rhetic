module.exports = [
    {
      method: 'GET',
      path: '/session',
      handler: 'liveblocks.getSession',
      config: {
        policies: [],
        auth: true
      }
    },
    {
      method: 'POST',
      path: '/test-notification',
      handler: 'liveblocks.testNotification',
      config: {
        policies: [],
        auth: true
      }
    }
  ];