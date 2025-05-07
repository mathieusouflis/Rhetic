"use client";

import { SettingsButton, SettingsSwitch } from "@/components/ui/SettingsItem";
import { H1 } from "@/components/ui/Typography";
import { useState } from "react";

export default function Page() {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  return (
    <>
      <H1>Notifications</H1>
      <SettingsSwitch
        label="Communities Posts"
        checked={isNotificationsEnabled}
        onChange={(checked) => {
          setIsNotificationsEnabled((old) => !old);
        }}
      />
      <SettingsSwitch
        label="Users Posts"
        checked={isNotificationsEnabled}
        onChange={(checked) => {
          setIsNotificationsEnabled((old) => !old);
        }}
      />
      <SettingsSwitch
        label="Comments"
        checked={isNotificationsEnabled}
        onChange={(checked) => {
          setIsNotificationsEnabled((old) => !old);
        }}
      />
      <SettingsSwitch
        label="Like Achievements"
        checked={isNotificationsEnabled}
        onChange={(checked) => {
          setIsNotificationsEnabled((old) => !old);
        }}
      />
      <SettingsSwitch
        label="Message"
        checked={isNotificationsEnabled}
        onChange={(checked) => {
          setIsNotificationsEnabled((old) => !old);
        }}
      />
      <SettingsSwitch
        label="Role Promotion"
        checked={isNotificationsEnabled}
        onChange={(checked) => {
          setIsNotificationsEnabled((old) => !old);
        }}
      />
      <SettingsSwitch
        label="Moderation"
        checked={isNotificationsEnabled}
        onChange={(checked) => {
          setIsNotificationsEnabled((old) => !old);
        }}
      />
    </>
  );
}
