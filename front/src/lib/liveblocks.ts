import { createClient } from '@liveblocks/client';
import { useState, useEffect } from 'react';

export const liveblocksClient = createClient({
  authEndpoint: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'}/liveblocks/session`,
});

export function useUserChannel(userId: string | null | undefined) {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = liveblocksClient.subscribe({
      id: `user-${userId}`,
      onEvent: (event) => {
        if (event.type === 'NOTIFICATION') {
          setEvents(prev => [event.data, ...prev]);
        }
      },
    });

    return () => {
      unsubscribe();
    };
  }, [userId]);

  return events;
}