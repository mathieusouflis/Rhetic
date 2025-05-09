const authSubscriber = require('./subscribers/auth');

module.exports = (plugin) => {
  plugin.services['jwt'].onSuccessfulLogin = async (ctx) => {
    if (ctx && ctx.state && ctx.state.user) {
      await authSubscriber.afterLogin({ user: ctx.state.user });
    }
  };

  return plugin;
};