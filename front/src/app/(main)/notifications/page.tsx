"use client";

import { useState, useEffect, useRef } from "react";
import { Body, Small, H2, BigBody } from "@/components/ui/Typography";
import { Community } from "@/components/ui/Community";
import LittleAction from "@/components/ui/LittleAction";
import { Avatar } from "@/components/ui/Avatar";
import Tag from "@/components/ui/Tag";

type NotificationType =
  | "comment"
  | "like"
  | "new_post"
  | "community_ban"
  | "promoted"
  | "new_message";

interface Notification {
  id: string;
  type: NotificationType;
  tag?: string;
  timestamp: string;
  avatar: string;
  username?: string;
  content?: string;
  subrhetic?: string;
  message?: string;
  reason?: string;
}

const NotificationCard = ({ notification }: { notification: Notification }) => {
  const renderNotificationContent = () => {
    switch (notification.type) {
      case "comment":
        return (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Avatar
                src={notification.avatar}
                alt={notification.username || ""}
                size="sm"
              />
              <div className="flex items-center gap-2">
                <Tag name="dev" />
                <Small className="text-[var(--black-200)]">
                  {notification.timestamp}
                </Small>
              </div>
            </div>
            <div className="flex flex-col gap-1 pl-10">
              <Body>{notification.username}</Body>
              <Small className="text-[var(--black-200)]">
                {notification.content}
              </Small>
              <div className="flex gap-2 mt-1">
                <LittleAction iconName="arrow_big_up" color="blue">
                  Upvote
                </LittleAction>
                <LittleAction iconName="comment">Reply</LittleAction>
              </div>
            </div>
          </div>
        );

      case "like":
        return (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Avatar src={notification.avatar} alt="Site" size="sm" />
              <div className="flex items-center gap-2">
                <Tag name="mod" />
                <Small className="text-[var(--black-200)]">
                  {notification.timestamp}
                </Small>
              </div>
            </div>
            <div className="flex flex-col gap-1 pl-10">
              <Body>{notification.message}</Body>
              <Small className="text-[var(--black-200)]">
                {notification.content}
              </Small>
            </div>
          </div>
        );

      case "new_post":
        return (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Avatar
                src={notification.avatar}
                alt={notification.username || ""}
                size="sm"
              />
              <div className="flex items-center gap-2">
                <Tag name="king" />
                <Small className="text-[var(--black-200)]">
                  {notification.timestamp}
                </Small>
              </div>
            </div>
            <div className="flex flex-col gap-1 pl-10">
              <Body>{notification.username}</Body>
              <BigBody>{notification.content}</BigBody>
              {notification.message && (
                <Small className="text-[var(--black-200)]">
                  {notification.message}
                </Small>
              )}
            </div>
          </div>
        );

      case "community_ban":
        return (
          <div className="flex flex-col gap-2 p-4 bg-[var(--red-bg-transparent)] border border-[var(--red-border-transparent)] rounded-[10px]">
            <div className="flex items-center gap-2">
              <Avatar
                src={notification.avatar}
                alt={notification.subrhetic || ""}
                size="sm"
              />
              <div className="flex items-center gap-2">
                <Tag name="mod" variant="icon" />
                <Small className="text-[var(--black-200)]">
                  {notification.timestamp}
                </Small>
              </div>
            </div>
            <div className="flex flex-col gap-1 pl-10">
              <Body>rh/{notification.subrhetic}</Body>
              <BigBody className="text-[var(--red)]">
                {notification.message}
              </BigBody>
              {notification.reason && (
                <Small className="text-[var(--black-200)]">
                  Reason: {notification.reason}
                </Small>
              )}
            </div>
          </div>
        );

      case "promoted":
        return (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Community
                name={notification.subrhetic || ""}
                iconUrl={notification.avatar}
              />
              <Small className="text-[var(--black-200)]">
                {notification.timestamp}
              </Small>
            </div>
            <div className="flex flex-col gap-1 pl-10">
              <Body>{notification.message}</Body>
            </div>
          </div>
        );

      case "new_message":
        return (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Avatar
                src={notification.avatar}
                alt={notification.username || ""}
                size="sm"
              />
              <div className="flex items-center gap-2">
                <Tag name="dev" />
                <Small className="text-[var(--black-200)]">
                  {notification.timestamp}
                </Small>
              </div>
            </div>
            <div className="flex flex-col gap-1 pl-10">
              <Body>{notification.username}</Body>
              <Small className="text-[var(--black-200)]">
                {notification.message}
              </Small>
              <LittleAction iconName="send" color="blue" className="mt-1">
                Reply
              </LittleAction>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-4 border border-[var(--black-500)] rounded-[10px] bg-[var(--black-700)]">
      {renderNotificationContent()}
    </div>
  );
};

const tabs = ["All", "Comments", "Likes", "Posts", "Messages"];

export default function Page() {
  const [activeTab, setActiveTab] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

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

  const sampleNotifications: Notification[] = [
    {
      id: "1",
      type: "comment",
      timestamp: "2 hours ago",
      avatar: "/avatars/user1.png",
      username: "JohnDoe",
      content: "This is really interesting! I think we should consider...",
    },
    {
      id: "2",
      type: "like",
      timestamp: "3 hours ago",
      avatar: "/avatars/rhetic.png",
      message: "Your post is trending on Rhetic!",
      content: "Understanding TypeScript Generics in 5 minutes",
    },
    {
      id: "3",
      type: "new_post",
      timestamp: "4 hours ago",
      avatar: "/avatars/user2.png",
      username: "TechGuru",
      content: "10 VS Code Extensions Every Developer Should Have",
      message: "Check out my new article about essential VS Code extensions!",
    },
    {
      id: "4",
      type: "community_ban",
      timestamp: "1 day ago",
      avatar: "/avatars/community1.png",
      subrhetic: "javascript",
      message: "You have been temporarily banned from this community",
      reason: "Multiple violations of community guidelines",
    },
    {
      id: "5",
      type: "promoted",
      timestamp: "2 days ago",
      avatar: "/avatars/community2.png",
      subrhetic: "typescript",
      message: "Your favorite TypeScript community is now trending!",
    },
    {
      id: "6",
      type: "new_message",
      timestamp: "3 days ago",
      avatar: "/avatars/user3.png",
      username: "CodeMaster",
      message:
        "Hey! I saw your post about React hooks, would love to discuss more about it!",
    },
  ];

  const filteredNotifications = sampleNotifications.filter((notification) => {
    if (activeTab === 0) return true;
    if (activeTab === 1) return notification.type === "comment";
    if (activeTab === 2) return notification.type === "like";
    if (activeTab === 3) return notification.type === "new_post";
    if (activeTab === 4) return notification.type === "new_message";
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <H2>Notifications</H2>
        <div className="relative flex border-b border-[var(--black-500)]">
          <div className="flex relative">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                ref={(el) => setTabRef(el, index)}
                onClick={() => setActiveTab(index)}
                className={`px-4 py-2 text-[var(--black-200)] relative ${
                  activeTab === index ? "text-[var(--white)]" : ""
                }`}
              >
                <Body>{tab}</Body>
              </button>
            ))}
            <div
              className="absolute bottom-0 h-0.5 bg-[var(--white)] transition-all duration-300 ease-in-out"
              style={{
                left: indicatorStyle.left,
                width: indicatorStyle.width,
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-[21px]">
        {filteredNotifications.map((notification) => (
          <NotificationCard key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  );
}
