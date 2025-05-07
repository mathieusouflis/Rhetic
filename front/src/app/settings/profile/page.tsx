"use client";

import { SettingsButton, SettingsSwitch } from "@/components/ui/SettingsItem";
import { H1 } from "@/components/ui/Typography";
import { useState } from "react";

export default function Page() {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  return (
    <>
      <H1>My Profile</H1>
      <SettingsButton label="Username" value="username" />
      <SettingsButton label="Profile Picture" />
      <SettingsButton label="Bio" />
      <SettingsSwitch
        label="Private"
        checked={isNotificationsEnabled}
        onChange={(checked) => {
          setIsNotificationsEnabled((old) => !old);
        }}
      />
    </>
  );
}
