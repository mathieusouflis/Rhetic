"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { BigBody, Tiny } from "@/components/ui/Typography";
import type { NavItem, SidebarItems } from "./types";
import { NavButton } from "@/components/ui/NavButton";

interface SidebarNavProps {
  title?: string;
  items: SidebarItems;
}

export function SidebarNav({ title, items }: SidebarNavProps) {
  const pathname = usePathname();

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

  const renderNavItem = (item: NavItem) => {
    return (
      <Link key={item.path} href={item.path}>
        <NavButton
          leftIcon
          leftIconName={item.icon}
          disabled={item.isDisabled}
          className="w-full"
          variant={isActiveRoute(item.path) ? "selected" : "black"}
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
