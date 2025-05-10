module.exports = {
  init(config, { strapi }) {
    return async (ctx, next) => {
      await next();
      
      const isAuthRoute = ctx.request.url.includes('/api/auth/local') && ctx.request.method === 'POST';
      const isCallback = ctx.request.url.includes('/api/auth/') && ctx.request.url.includes('/callback');
      
      if ((isAuthRoute || isCallback) && ctx.response.status === 200 && ctx.response.body && ctx.response.body.user) {
        try {
          await strapi.entityService.update('plugin::users-permissions.user', ctx.response.body.user.id, {
            data: {
              last_login_at: new Date()
            }
          });
        } catch (error) {
          strapi.log.error('Failed to update last login timestamp', error);
        }
      }
    };
  }
};