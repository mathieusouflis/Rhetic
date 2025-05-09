module.exports = {
  afterLogin: async ({ user }) => {
    if (user && user.id) {
      try {
        await strapi.entityService.update('plugin::users-permissions.user', user.id, {
          data: {
            last_login_at: new Date()
          }
        });
      } catch (error) {
        strapi.log.error('Failed to update last login timestamp', error);
      }
    }
  },
};