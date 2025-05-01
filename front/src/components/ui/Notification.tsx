import React from "react";
import { Body } from "./Typography";

type NotificationVariant = "white" | "red";
type NotificationStatus = "default" | "active";

interface NotificationProps {
  color?: NotificationVariant;
  status?: NotificationStatus;
  children: React.ReactNode;
}

const variantStyles: Record<
  NotificationVariant,
  Record<NotificationStatus, string>
> = {
  white: {
    default:
      "bg-[var(--white-bg-transparent-active)] border border-[var(--white-border-transparent-active)] text-[var(--white)] rounded-[10px]",
    active:
      "bg-[var(--white-bg-transparent)] border border-[var(--white-border-transparent)] text-[var(--white-border-transparent)] rounded-[10px]",
  },
  red: {
    default:
      "bg-[var(--red-bg-transparent-active)] border border-[var(--red-border-transparent-active)] text-[var(--red-border-transparent-active)] rounded-[10px]",
    active:
      "bg-[var(--red-bg-transparent)] border border-[var(--red-border-transparent)] text-[var(--red-border-transparent-alt-plus)] rounded-[10px]",
  },
};

const Notification: React.FC<NotificationProps> = ({
  color = "red",
  status = "default",
  children,
}) => {
  return (
    <div
      className={`min-w-[31px] min-h-[31px] w-fit p-1 flex justify-center items-center ${variantStyles[color][status]}`}
    >
      <Body>{children}</Body>
    </div>
  );
};

Notification.displayName = "Notification";

export default Notification;
