"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { BigBody, Tiny } from "@/components/ui/Typography";
import type { NavItem, SidebarItems } from "./types";
import { NavButton } from "@/components/ui/NavButton";
import { useAuth } from "@/providers/AuthProvider";

interface SidebarNavProps {
  title?: string;
  items: SidebarItems;
}

export function SidebarNav({ title, items }: SidebarNavProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const isSidebarItem = (items: SidebarItems): items is NavItem[] => {
    if (!items.length) return false;
    return !("items" in items[0]);
  };

  const isSectionItem = (
    item: any
  ): item is { title: string; items: NavItem[] } => {
    return "title" in item && "items" in item;
  };

  const isActiveRoute = (path: string) => {
    return pathname === path;
  };

  const hasProfileLink = items.some((item) => {
    if ("path" in item && item.path === "/profile") {
      return true;
    }

    if ("items" in item) {
      return item.items.some((subItem) => subItem.path === "/profile");
    }
    return false;
  });

  if (hasProfileLink && !user) {
    return (
      <div className="flex flex-col gap-2.5 animate-pulse">
        <div className="h-8 bg-[var(--black-600)] rounded w-full"></div>
        <div className="h-8 bg-[var(--black-600)] rounded w-full"></div>
        <div className="h-8 bg-[var(--black-600)] rounded w-full"></div>
      </div>
    );
  }

  const renderNavItem = (item: NavItem) => {
    let path = item.path;
    if (path === "/profile" && user) {
      path = `/users/${user.id}`;
    }
    return (
      <Link key={path} href={path}>
        <NavButton
          leftIcon
          leftIconName={item.icon}
          disabled={item.isDisabled}
          className="w-full"
          variant={isActiveRoute(path) ? "selected" : "black"}
        >
          {item.label}
        </NavButton>
      </Link>
    );
  };

  return (
    <div className="flex flex-col gap-2.5">
      {title && (
        <Tiny className="px-4 text-[var(--black-300)] uppercase">{title}</Tiny>
      )}
      {isSidebarItem(items)
        ? items.map(renderNavItem)
        : items.map((section) =>
            isSectionItem(section) ? (
              <div key={section.title} className="flex flex-col gap-2">
                <BigBody className="text-[var(--black-300)] font-medium">
                  {section.title}
                </BigBody>
                {section.items.map(renderNavItem)}
              </div>
            ) : null
          )}
    </div>
  );
}
