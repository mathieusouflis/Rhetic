import React from "react";
import { Body, Small } from "./Typography";

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
      "bg-[var(--white-bg-transparent-active)] border border-[var(--white-border-transparent-active)] text-[var(--white)] rounded-[6px]",
    active:
      "bg-[var(--white-bg-transparent)] border border-[var(--white-border-transparent)] text-[var(--white-border-transparent)] rounded-[6px]",
  },
  red: {
    default:
      "bg-[var(--red-bg-transparent-active)] border border-[var(--red-border-transparent-active)] text-[var(--red-border-transparent-active)] rounded-[6px]",
    active:
      "bg-[var(--red-bg-transparent)] border border-[var(--red-border-transparent)] text-[var(--red-border-transparent-alt-plus)] rounded-[6px]",
  },
};

const Notification: React.FC<NotificationProps> = ({
  color = "red",
  status = "default",
  children,
}) => {
  return (
    <div
      className={`min-w-[22px] h-[22px] w-fit p-1 flex justify-center items-center ${variantStyles[color][status]}`}
    >
      <Small className="leading-none">{children}</Small>
    </div>
  );
};

Notification.displayName = "Notification";

export default Notification;
