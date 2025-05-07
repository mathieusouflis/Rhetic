"use client";

import { useNotifications } from "@/hooks/useNotifications";
import { NavButton } from "@/components/ui/NavButton";
import Link from "next/link";

export const NotificationIndicator: React.FC = () => {
  const { unreadCount } = useNotifications();

  return (
    <Link href="/notifications">
      <NavButton
        leftIcon
        leftIconName="bell"
        notification={unreadCount > 0}
        notificationNumber={unreadCount}
      >
        Notifications
      </NavButton>
    </Link>
  );
};