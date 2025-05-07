import { createClient } from '@liveblocks/client';
import { useState, useEffect } from 'react';

export const liveblocksClient = createClient({
  authEndpoint: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'}/liveblocks/session`,
});

export function useUserChannel(userId: string | null | undefined) {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    if (!userId) return;
    
    let unsubscribe: (() => void) | undefined;
    
    try {
      const client = liveblocksClient as any;
      
      if (typeof client.subscribe === 'function') {
        unsubscribe = client.subscribe({
          id: `user-${userId}`,
          onEvent: (event: any) => {
            if (event && event.type === 'NOTIFICATION') {
              setEvents(prev => [event.data, ...prev]);
            }
          },
        });
      } else {
        console.error('La méthode subscribe n\'est pas disponible sur le client Liveblocks');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion à Liveblocks:', error);
    }
    
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [userId]);

  return events;
}