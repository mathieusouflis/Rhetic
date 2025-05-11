"use client";

import React, { useState } from "react";
import { MultiStepForm, Step } from "./MultiStepForm/MultiStepForm";
import { TextInput } from "./TextInput";
import { useAuth } from "@/providers/AuthProvider";
import { update } from "@/lib/api/apiClient";
import { API_PATHS } from "@/lib/api/config";

interface EmailChangeModalProps {
  onClose: () => void;
  onSuccess: () => void;
  currentEmail: string;
}

export const EmailChangeModal: React.FC<EmailChangeModalProps> = ({
  onClose,
  onSuccess,
  currentEmail,
}) => {
  const { user, setUser } = useAuth();
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = () => {
    if (!newEmail) {
      setError("L'email est requis");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setError("Format d'email invalide");
      return false;
    }

    if (newEmail === currentEmail) {
      setError("Le nouvel email doit être différent de l'email actuel");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateEmail() || !user?.id) return;

    try {
      setIsSubmitting(true);
      const updatedUser = await update(API_PATHS.USERS, user.id.toString(), {
        email: newEmail,
      });

      if (updatedUser) {
        setUser({ ...user, email: newEmail });
        onSuccess();
      }
    } catch (error: any) {
      console.error("Erreur lors du changement d'email:", error);
      setError(
        error.message || "Une erreur est survenue lors du changement d'email"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps: Step[] = [
    {
      id: "email",
      title: "Changer votre adresse email",
      description: "Entrez une nouvelle adresse email",
      content: (
        <div className="flex flex-col gap-4 w-full">
          <TextInput
            label="Nouvelle adresse email"
            placeholder="Entrez une nouvelle adresse email"
            value={newEmail}
            onChange={(e) => {
              setNewEmail(e.target.value);
              if (error) setError("");
            }}
            error={error}
            leftIcon
            leftIconName="mail"
          />
        </div>
      ),
      validator: validateEmail,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div
        className="bg-[var(--black-800)] p-6 rounded-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <MultiStepForm
          steps={steps}
          onComplete={handleSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          nextButtonText="Mettre à jour"
          backButtonText="Annuler"
          completeButtonText="Mettre à jour"
          cancelButtonText="Annuler"
        />
      </div>
    </div>
  );
};

export default EmailChangeModal;
