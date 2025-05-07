'use strict';

const { Liveblocks } = require('@liveblocks/node');

module.exports = ({ strapi }) => ({
  getLiveblocksClient() {
    const secret = process.env.LIVEBLOCKS_SECRET_KEY;
    if (!secret) {
      throw new Error('LIVEBLOCKS_SECRET_KEY is not defined');
    }
    return new Liveblocks({ secret });
  },

  async broadcastNotification(userId, notification) {
    const client = this.getLiveblocksClient();
    
    try {
      const userIdString = String(userId);
      
      await client.broadcastEvent(`user-${userIdString}`, {
        type: 'NOTIFICATION',
        data: notification
      });
      
      return true;
    } catch (error) {
      strapi.log.error('Error broadcasting notification:', error);
      return false;
    }
  },
  
  async createLiveblocksSession(userId) {
    const client = this.getLiveblocksClient();
    
    try {
      const userIdString = String(userId);
      
      return client.getAuthorization({
        userId: userIdString,
        groupIds: [`user-${userIdString}`],
        userInfo: { id: userIdString }
      });
    } catch (error) {
      strapi.log.error('Error creating Liveblocks session:', error);
      throw error;
    }
  }
});