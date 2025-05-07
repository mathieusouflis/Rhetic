"use client";

import { SettingsButton, SettingsSwitch } from "@/components/ui/SettingsItem";
import { H1, H2 } from "@/components/ui/Typography";
import { useState } from "react";

export default function Page() {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  return (
    <>
      <H1>My Profile</H1>
      <H2>Theme</H2>
      <SettingsSwitch
        label="Dark Theme"
        checked={isNotificationsEnabled}
        onChange={(checked) => {
          setIsNotificationsEnabled((old) => !old);
        }}
      />
      <H2>View</H2>
      <SettingsSwitch
        label="Show votes numbers"
        checked={isNotificationsEnabled}
        onChange={(checked) => {
          setIsNotificationsEnabled((old) => !old);
        }}
      />
      <SettingsSwitch
        label="Show NSFC (Not safe for coders)"
        checked={isNotificationsEnabled}
        onChange={(checked) => {
          setIsNotificationsEnabled((old) => !old);
        }}
      />
    </>
  );
}
