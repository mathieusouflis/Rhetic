"use client";

import { usePathname } from "next/navigation";
import React, { ReactNode, useEffect } from "react";
import { LiveblocksProvider, RoomProvider } from "@liveblocks/react/suspense";
import { useMyPresence, useOthers } from "@liveblocks/react";

type CursorProps = {
  color: string;
  x: number;
  y: number;
};

function Cursor({ color, x, y }: CursorProps) {
  return (
    <svg
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: `translateX(${x}px) translateY(${y}px)`,
      }}
      width="24"
      height="36"
      viewBox="0 0 24 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
        fill={color}
      />
    </svg>
  );
}

function CursorsContent() {
  const [{ cursor }, updateMyPresence] = useMyPresence();
  const others = useOthers();

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      updateMyPresence({
        cursor: {
          x: Math.round(event.clientX),
          y: Math.round(event.clientY),
        },
      });
    };

    const handlePointerLeave = () => {
      updateMyPresence({
        cursor: null,
      });
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [updateMyPresence]);

  return (
    <div
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 999 }}
    >
      {others.map(({ connectionId, presence }) => {
        if (presence.cursor === null) {
          return null;
        }

        return (
          <Cursor
            key={`cursor-${connectionId}`}
            color={"white"}
            x={presence.cursor.x}
            y={presence.cursor.y}
          />
        );
      })}
    </div>
  );
}

export function CursorsLayer({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  let roomId = "site-main-page";

  if (pathname === "/room") {
    roomId = "site-room-page";
  } else if (pathname.startsWith("/")) {
    const pathSegments = pathname.split("/").filter(Boolean);
    if (pathSegments.length === 1) {
      roomId = `site-communities-${pathSegments[0]}-page`;
    }
  }

  return (
    <LiveblocksProvider
      publicApiKey="pk_dev_K7IdCg8mxDXEi7hpyiXlYzeILGmf9PpR5NsoKPCdFaYdivOMtOLc6ItjS3mMuqM0"
      throttle={16}
    >
      <RoomProvider id={roomId} initialPresence={{ cursor: null }}>
        <CursorsContent />
        {children}
      </RoomProvider>
    </LiveblocksProvider>
  );
}
