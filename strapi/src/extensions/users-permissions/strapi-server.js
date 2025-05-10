module.exports = (plugin) => {
  plugin.services.jwt = require('./services/jwt')({ strapi });
  
  const extendedController = plugin.controllers.auth;
  
  plugin.controllers.auth = {
    ...extendedController,
    
    async callback(ctx) {
      const response = await extendedController.callback(ctx);
      
      if (ctx.status === 200 && ctx.response.body && ctx.response.body.user) {
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
      
      return response;
    },
    
    async register(ctx) {
      const response = await extendedController.register(ctx);
      
      if (ctx.status === 200 && ctx.response.body && ctx.response.body.user) {
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
      
      return response;
    }
  };

  return plugin;
};