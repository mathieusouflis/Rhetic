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
      await client.broadcastEvent(`user-${userId}`, {
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
      return client.getAuthorization({
        userId: userId.toString(),
        groupIds: [`user-${userId}`],
        userInfo: { id: userId }
      });
    } catch (error) {
      strapi.log.error('Error creating Liveblocks session:', error);
      throw error;
    }
  }
});