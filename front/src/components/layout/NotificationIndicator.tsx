"use client";

import { useNotifications } from "@/hooks/useNotifications";
import Icon from "@/components/ui/Icons";
import { useEffect, useState } from "react";
import Notification from "@/components/ui/Notification";
import { NavButton } from "@/components/ui/NavButton";
import Link from "next/link";

export const NotificationIndicator: React.FC = () => {
  const { unreadCount } = useNotifications();
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    if (Notification && Notification.permission !== "granted") {
      Notification.requestPermission().then(permission => {
        setHasPermission(permission === "granted");
      });
    } else {
      setHasPermission(Notification.permission === "granted");
    }
  }, []);

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