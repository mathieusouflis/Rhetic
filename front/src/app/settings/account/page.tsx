"use client";

import {
  SettingsButton,
  SettingsRadio,
  SettingsSwitch,
} from "@/components/ui/SettingsItem";
import { H1, H2 } from "@/components/ui/Typography";
import { useState } from "react";

export default function Page() {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  return (
    <>
      <H1>Account Settings</H1>
      <H2>Account</H2>
      <SettingsButton label="Email Address" value="mathieu@souflis.fr" />
      <SettingsButton label="Password" />
      <SettingsSwitch
        label="2 Factor Authentification"
        checked={isNotificationsEnabled}
        onChange={(checked) => {
          console.log("Ça a changé ! " + checked);

          setIsNotificationsEnabled((old) => !old);
        }}
      />
      <SettingsButton label="Recent Connexion" value="mathieu@souflis.fr" />
      <H2>Advanced</H2>
      <SettingsButton label="Delete Account" variant="danger" />
    </>
  );
}
