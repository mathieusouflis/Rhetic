import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

export const liveblocksClient = createClient({
  publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY || "",
});

export const {
  RoomProvider,
  useRoom,
  useStorage,
  useMutation,
  useBroadcastEvent,
  useEvent,
} = createRoomContext(liveblocksClient);