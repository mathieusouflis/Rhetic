"use client";

import React, { useState } from "react";
import { MultiStepForm, Step } from "./MultiStepForm/MultiStepForm";
import { TextInput } from "./TextInput";
import { useAuth } from "@/providers/AuthProvider";
import { apiClient } from "@/lib/api/apiClient";

interface PasswordChangeModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    if (!currentPassword) {
      setError("Le mot de passe actuel est requis");
      return false;
    }

    if (!newPassword) {
      setError("Le nouveau mot de passe est requis");
      return false;
    }

    if (newPassword.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return false;
    }

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await apiClient.post("/auth/change-password", {
        currentPassword,
        password: newPassword,
        passwordConfirmation: confirmPassword,
      });

      onSuccess();
    } catch (error: any) {
      console.error("Erreur lors du changement de mot de passe:", error);
      setError(
        error.message ||
          "Une erreur est survenue lors du changement de mot de passe"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps: Step[] = [
    {
      id: "password",
      title: "Changer votre mot de passe",
      description: "Sécurisez votre compte avec un nouveau mot de passe",
      content: (
        <div className="flex flex-col gap-4 w-full">
          <TextInput
            label="Mot de passe actuel"
            type="password"
            placeholder="Entrez votre mot de passe actuel"
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              if (error) setError("");
            }}
            leftIcon={false}
          />

          <TextInput
            label="Nouveau mot de passe"
            type="password"
            placeholder="Entrez votre nouveau mot de passe"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              if (error) setError("");
            }}
            leftIcon={false}
          />

          <TextInput
            label="Confirmer le nouveau mot de passe"
            type="password"
            placeholder="Confirmer votre nouveau mot de passe"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (error) setError("");
            }}
            leftIcon={false}
            error={error}
          />
        </div>
      ),
      validator: validateForm,
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

export default PasswordChangeModal;
