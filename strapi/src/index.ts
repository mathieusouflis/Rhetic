export default {
  register(/* { strapi } */) {},

  bootstrap({ strapi }) {
    const notificationController = strapi.controller('api::notification.notification');
    
    strapi.notification = {
      async createNotification(type, userId, referenceType, referenceId, content) {
        return notificationController.createNotification(type, userId, referenceType, referenceId, content);
      }
    };
  },
};