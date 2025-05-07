import React from 'react';
import { formatRelativeTime } from "@/lib/utils/date";
import { Avatar } from "./Avatar";
import { Body, Small } from "./Typography";
import Icon, { IconName } from "./Icons";
import { NotificationType } from '@/types/notification';
import classNames from 'classnames';

interface NotificationItemProps {
  notification: NotificationType;
  onMarkAsRead: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onMarkAsRead 
}) => {
  const parseContent = () => {
    try {
      if (typeof notification.content === 'string') {
        return JSON.parse(notification.content);
      }
      return notification.content;
    } catch (e) {
      console.error("Erreur lors du parsing du contenu de la notification:", e);
      return { message: "Notification", description: "" };
    }
  };

  const content = parseContent();

  const getIconForType = (): IconName => {
    switch(notification.type) {
      case 'comment_reply': return 'comment';
      case 'post_reply': return 'comment';
      case 'mention': return 'at_sign';
      case 'mod_action': return 'shield';
      case 'system': default: return 'bell';
    }
  };

  const handleClick = () => {
    if (!notification.is_read) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div 
      className={classNames(
        "p-4 border rounded-[10px] cursor-pointer transition-colors",
        notification.is_read 
          ? "border-[var(--black-500)] bg-[var(--black-700)]" 
          : "border-[var(--yellow-border-transparent)] bg-[var(--black-600)]"
      )}
      onClick={handleClick}
    >
      <div className="flex items-center gap-2 mb-2">
        <Avatar
          src="https://images.unsplash.com/photo-1726066012604-a309bd0575df?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Notification"
          size="sm"
        />
        <Icon name={getIconForType()} size={18} color="var(--yellow)" />
        <Small className="text-[var(--black-200)]">
          {formatRelativeTime(new Date(notification.createdAt))}
        </Small>
        {!notification.is_read && (
          <div className="ml-auto w-2 h-2 rounded-full bg-[var(--yellow)]"></div>
        )}
      </div>
      
      <Body className="mb-1">{content?.message || content?.title || "Notification"}</Body>
      
      {content?.description && (
        <Small className="text-[var(--black-200)]">{content.description}</Small>
      )}
    </div>
  );
};