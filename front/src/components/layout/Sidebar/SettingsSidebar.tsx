"use client";

import React from "react";
import { SidebarNav } from "./SidebarNav";
import type { SidebarItems } from "./types";
import Icon from "@/components/ui/Icons";
import { BigButton } from "@/components/ui/BigButton";
import Link from "next/link";

interface SidebarProps {
  items: SidebarItems;
  className?: string;
}

export function SettingsSidebar({ items, className = "" }: SidebarProps) {
  return (
    <aside
      className={`w-64 h-screen flex flex-col justify-between gap-6 py-4 sticky top-0 border-r border-[var(--black-500)] ${className}`}
    >
      <div className="flex flex-col gap-4">
        <Icon
          name="logo_text"
          color="var(--white)"
          className="px-2.5"
          size={38}
        />
        <div className="flex flex-col gap-3">
          <Link href="/" className="w-full">
            <BigButton
              variant="conic"
              className="justify-start w-full"
              leftIcon
              leftIconName="arrow_left"
            >
              Back
            </BigButton>
          </Link>
          <div className="px-4 py-2.5">
            <SidebarNav items={items} />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <Link
          target="_blanc"
          href="https://rhetic.canny.io/feature-requests"
          className="w-full"
        >
          <BigButton
            className="w-full"
            variant="conic"
            rightIcon
            rightIconName="arrow_up_right"
          >
            Suggest
          </BigButton>
        </Link>
        <Link
          target="_blanc"
          href="https://rhetic.canny.io/bug"
          className="w-full"
        >
          <BigButton
            className="w-full"
            variant="conic"
            rightIcon
            rightIconName="arrow_up_right"
          >
            Report a bug
          </BigButton>
        </Link>
      </div>
    </aside>
  );
}
