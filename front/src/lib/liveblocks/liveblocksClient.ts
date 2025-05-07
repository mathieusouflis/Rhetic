import { createClient } from '@liveblocks/client';

const LIVEBLOCKS_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'}/liveblocks/session`;

export const liveblocksClient = createClient({
  authEndpoint: async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(LIVEBLOCKS_ENDPOINT, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to authenticate with Liveblocks');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Liveblocks authentication error:', error);
      throw error;
    }
  },
});

export function getRoomId(type: string, id: string): string {
  return `${type}-${id}`;
}

export function getUserRoomId(userId: string | number): string {
  return `user-${userId}`;
}