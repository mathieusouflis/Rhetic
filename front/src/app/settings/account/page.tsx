"use client";

import { SettingsButton, SettingsSwitch } from "@/components/ui/SettingsItem";
import { H1, H2, Body } from "@/components/ui/Typography";
import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import EmailChangeModal from "@/components/ui/EmailChangeModal";
import PasswordChangeModal from "@/components/ui/PasswordChangeModal";
import DeleteAccountModal from "@/components/ui/DeleteAccountModal";
import { formatDate } from "@/lib/utils/date";

export default function Page() {
  const { user } = useAuth();
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleSuccess = (message: string) => {
    setStatusMessage(message);
    setTimeout(() => {
      setStatusMessage("");
    }, 3000);
  };

  const userCreatedAt = user?.createdAt ? formatDate(user.createdAt) : "";

  return (
    <div className="flex flex-col gap-5">
      <H1>Account Settings</H1>

      {statusMessage && (
        <div className="mb-4 p-3 bg-green-900/30 border border-green-800/50 rounded-md">
          <Body className="text-green-400">{statusMessage}</Body>
        </div>
      )}
      <div className="flex flex-col gap-3">
        <H2>Account</H2>
        <SettingsButton
          label="Email Address"
          value={user?.email || ""}
          onClick={() => setIsEmailModalOpen(true)}
        />

        <SettingsButton
          label="Password"
          onClick={() => setIsPasswordModalOpen(true)}
        />

        <SettingsSwitch
          label="2 Factor Authentification"
          checked={isNotificationsEnabled}
          disabled
          onChange={(checked) => {
            setIsNotificationsEnabled((old) => !old);
          }}
        />

        <SettingsButton label="Account Created" value={userCreatedAt} />
      </div>
      <div className="flex flex-col gap-3">
        <H2>Advanced</H2>
        <SettingsButton
          label="Delete Account"
          variant="danger"
          onClick={() => setIsDeleteModalOpen(true)}
        />
      </div>
      {isEmailModalOpen && (
        <EmailChangeModal
          onClose={() => setIsEmailModalOpen(false)}
          onSuccess={() => {
            setIsEmailModalOpen(false);
            handleSuccess("Adresse email mise à jour avec succès");
          }}
          currentEmail={user?.email || ""}
        />
      )}

      {isPasswordModalOpen && (
        <PasswordChangeModal
          onClose={() => setIsPasswordModalOpen(false)}
          onSuccess={() => {
            setIsPasswordModalOpen(false);
            handleSuccess("Mot de passe mis à jour avec succès");
          }}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteAccountModal onClose={() => setIsDeleteModalOpen(false)} />
      )}
    </div>
  );
}
