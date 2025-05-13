"use client";

import { SettingsButton, SettingsSwitch } from "@/components/ui/SettingsItem";
import { H1 } from "@/components/ui/Typography";
import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import UsernameChangeModal from "@/components/ui/UsernameChangeModal";
import BioChangeModal from "@/components/ui/BioChangeModal";
import AvatarChangeModal from "@/components/ui/AvatarChangeModal";

export default function Page() {
  const { user } = useAuth();
  const [isPrivate, setIsPrivate] = useState(false);

  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);

  return (
    <>
      <H1>Mon Profil</H1>

      <SettingsButton
        label="Nom d'utilisateur"
        value={user?.username}
        onClick={() => setIsUsernameModalOpen(true)}
      />
      <SettingsButton
        label="Photo de profil"
        onClick={() => setIsAvatarModalOpen(true)}
      />
      <SettingsButton
        label="Bio"
        value={
          user?.bio
            ? `${user.bio.substring(0, 30)}${user.bio.length > 30 ? "..." : ""}`
            : "Ajouter une bio"
        }
        onClick={() => setIsBioModalOpen(true)}
      />
      <SettingsSwitch
        label="Profil privé"
        description="Seuls les utilisateurs que vous approuvez peuvent voir votre profil"
        checked={isPrivate}
        disabled
        onChange={() => {}}
      />

      {isUsernameModalOpen && (
        <UsernameChangeModal
          onClose={() => setIsUsernameModalOpen(false)}
          onSuccess={() => setIsUsernameModalOpen(false)}
          currentUsername={user?.username || ""}
        />
      )}

      {isAvatarModalOpen && (
        <AvatarChangeModal
          onClose={() => setIsAvatarModalOpen(false)}
          onSuccess={() => setIsAvatarModalOpen(false)}
          currentAvatar={user?.avatar || ""}
        />
      )}

      {isBioModalOpen && (
        <BioChangeModal
          onClose={() => setIsBioModalOpen(false)}
          onSuccess={() => setIsBioModalOpen(false)}
          currentBio={user?.bio || ""}
        />
      )}
    </>
  );
}
