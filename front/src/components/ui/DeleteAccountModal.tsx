"use client";

import React, { useState } from "react";
import { Body, H1 } from "./Typography";
import { ActionButton } from "./ActionButton";
import { useAuth } from "@/providers/AuthProvider";
import { remove } from "@/lib/api/apiClient";
import { API_PATHS } from "@/lib/api/config";
import { useRouter } from "next/navigation";

interface DeleteAccountModalProps {
  onClose: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  onClose,
}) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleDeleteAccount = async () => {
    if (!user?.id) return;

    try {
      setIsSubmitting(true);
      await remove(API_PATHS.USERS, user.id.toString());
      logout();
      router.push("/login");
    } catch (error: any) {
      console.error("Error deleting account:", error);
      setError(
        error.message ||
          "Une erreur est survenue lors de la suppression du compte"
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div
        className="bg-[var(--black-800)] p-6 rounded-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <H1>Supprimer le compte</H1>
        </div>

        <div className="flex flex-col gap-6">
          <Body className="text-[var(--red)]">
            Attention : Cette action est irréversible. Toutes vos données seront
            définitivement supprimées.
          </Body>

          {error && <Body className="text-[var(--red)]">{error}</Body>}

          <div className="flex justify-between">
            <ActionButton
              variant="gray"
              leftIcon={false}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </ActionButton>

            <ActionButton
              variant="gray"
              leftIcon={false}
              className="!bg-red-900/30 !text-red-500 border-red-800/50"
              onClick={handleDeleteAccount}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Suppression..." : "Supprimer définitivement"}
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
