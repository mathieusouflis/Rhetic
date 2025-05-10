const _ = require('lodash');
const jwt = require('jsonwebtoken');
const utils = require('@strapi/utils');

module.exports = ({ strapi }) => {
  const { issueJWT, verifyJWT } = utils.jwt;
  
  const original = strapi.plugins['users-permissions'].services.jwt;

  return {
    ...original,
    
    issue(payload, options = {}) {
      return issueJWT(payload, options);
    },
    
    verify(token) {
      return verifyJWT(token);
    },
    
    async getToken(ctx) {
      const originalToken = await original.getToken(ctx);
      return originalToken;
    },
    
    async onSuccessfulLogin(user) {
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
      return true;
    }
  };
};