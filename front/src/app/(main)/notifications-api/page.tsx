"use client";

import { useState, useEffect, useRef } from "react";
import { H1, H2, Body } from "@/components/ui/Typography";
import { TinyButton } from "@/components/ui/TinyButton";
import { ActionButton } from "@/components/ui/ActionButton";
import { NotificationItem } from "@/components/ui/NotificationItem";
import { useNotifications } from "@/hooks/useNotifications";
import { Separator } from "@/components/ui/Separator";

export default function Page() {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    error, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();
  
  const [activeTab, setActiveTab] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  
  const tabs = ["Toutes", "Commentaires", "Mentions", "Système"];
  
  const setTabRef = (el: HTMLButtonElement | null, index: number) => {
    tabRefs.current[index] = el;
  };
  
  useEffect(() => {
    const activeTabElement = tabRefs.current[activeTab];
    if (activeTabElement) {
      setIndicatorStyle({
        left: activeTabElement.offsetLeft,
        width: activeTabElement.offsetWidth,
      });
    }
  }, [activeTab]);
  
  const getFilteredNotifications = () => {
    if (activeTab === 0) return notifications;
    if (activeTab === 1) return notifications.filter(n => 
      n.type === 'comment_reply' || n.type === 'post_reply'
    );
    if (activeTab === 2) return notifications.filter(n => 
      n.type === 'mention'
    );
    if (activeTab === 3) return notifications.filter(n => 
      n.type === 'system' || n.type === 'mod_action'
    );
    return notifications;
  };
  
  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <H2>Notifications</H2>
        <div className="flex flex-col gap-2.5 w-full">
          <div className="flex flex-row gap-2 overflow-x-scroll">
            {tabs.map((tab, index) => (
              <TinyButton
                key={tab}
                isActive={activeTab === index}
                onClick={() => setActiveTab(index)}
              >
                {tab}
              </TinyButton>
            ))}
          </div>
          <Separator direction="width" />
        </div>
      </div>

      {unreadCount > 0 && (
        <div className="flex justify-end">
          <ActionButton 
            onClick={markAllAsRead} 
            leftIcon={false} 
            variant="gray"
            className="mb-4"
          >
            Tout marquer comme lu
          </ActionButton>
        </div>
      )}

      {loading ? (
        <div className="text-center p-4">
          <Body className="text-[var(--black-100)]">Chargement des notifications...</Body>
        </div>
      ) : error ? (
        <div className="text-center p-4">
          <Body className="text-[var(--red)]">Une erreur s'est produite lors du chargement des notifications</Body>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="text-center p-4">
          <Body className="text-[var(--black-100)]">Aucune notification pour le moment</Body>
        </div>
      ) : (
        <div className="flex flex-col gap-[21px]">
          {filteredNotifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={markAsRead}
            />
          ))}
        </div>
      )}
    </div>
  );
}