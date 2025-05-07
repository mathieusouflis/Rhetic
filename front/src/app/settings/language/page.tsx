"use client";

import { SettingsRadio, SettingsShortcut } from "@/components/ui/SettingsItem";
import { H1 } from "@/components/ui/Typography";
import { LANGUAGES_LIST } from "@/config/langues";

export default function Page() {
  return (
    <>
      <H1>Language</H1>
      {LANGUAGES_LIST.map((shortcutItem) => {
        return <SettingsRadio label={shortcutItem.name} />;
      })}
    </>
  );
}
