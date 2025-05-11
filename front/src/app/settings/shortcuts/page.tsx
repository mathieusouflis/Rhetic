"use client";

import { SettingsShortcut } from "@/components/ui/SettingsItem";
import { H1 } from "@/components/ui/Typography";
import { SHORTCUTS_LIST } from "@/config/shortcuts";
import { useState } from "react";

export default function Page() {
  return (
    <>
      <H1>Shortcuts</H1>
      {SHORTCUTS_LIST.map((shortcutItem, index) => {
        return (
          <SettingsShortcut
            key={index}
            label={shortcutItem.name}
            value={shortcutItem.shortcut}
          />
        );
      })}
    </>
  );
}
