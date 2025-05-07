import React, { useEffect } from 'react';
import { Body, Small } from './Typography';
import Icon from './Icons';
import classNames from 'classnames';
import { NotificationType } from '@/types/notification';

interface ToastProps {
  notification: NotificationType;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const parseContent = () => {
    try {
      if (typeof notification.content === 'string') {
        return JSON.parse(notification.content);
      }
      return notification.content;
    } catch {
      return { title: "Notification", message: "" };
    }
  };

  const content = parseContent();

  return (
    <div 
      className={classNames(
        "flex flex-col gap-2 p-4 rounded-[10px] border animate-in slide-in-from-right duration-300 w-80",
        "border-[var(--black-400)] bg-[var(--black-700)]"
      )}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Icon name="bell" color="var(--yellow)" size={18} />
          <Body className="font-bold">{content.title || "Notification"}</Body>
        </div>
        <button 
          onClick={onClose}
          className="text-[var(--black-300)] hover:text-[var(--white)] transition-colors"
        >
          <Icon name="x" size={14} />
        </button>
      </div>
      
      {content.message && (
        <Small className="text-[var(--black-100)]">{content.message}</Small>
      )}
    </div>
  );
};