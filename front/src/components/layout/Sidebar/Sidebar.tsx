"use client";

import React from "react";
import { SidebarNav } from "./SidebarNav";
import type { SidebarItems } from "./types";
import { BigButton } from "@/components/ui/BigButton";
import { Modal } from "@/components/ui/Modal";
import PostWriter from "@/components/ui/PostWriter";

interface SidebarProps {
  items: SidebarItems;
  className?: string;
}

export function Sidebar({ items, className = "" }: SidebarProps) {
  return (
    <aside
      className={`w-64 h-screen flex flex-col gap-6 py-4 sticky top-0 border-r border-[var(--black-500)] ${className}`}
    >
      <div className="flex flex-col gap-6 px-4">
        <SidebarNav items={items} />
        <Modal>
          <Modal.Trigger asChild>
            <BigButton variant="white">
              <strong>Post</strong>
            </BigButton>
          </Modal.Trigger>
          <Modal.Content className="w-3xl">
            <PostWriter className="w-3xl" />
          </Modal.Content>
        </Modal>
      </div>
    </aside>
  );
}
