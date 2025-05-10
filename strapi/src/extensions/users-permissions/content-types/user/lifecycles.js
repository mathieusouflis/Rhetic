module.exports = {
  async afterCreate(event) {
    const { result } = event;
    if (result && result.id) {
      await strapi.entityService.update('plugin::users-permissions.user', result.id, {
        data: {
          last_login_at: new Date()
        }
      });
    }
  },
};