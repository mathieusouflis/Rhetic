"use client";

import React, { useState } from "react";
import { MultiStepForm, Step } from "./MultiStepForm/MultiStepForm";
import { TextInput } from "./TextInput";
import { useAuth } from "@/providers/AuthProvider";
import { API_PATHS } from "@/lib/api/config";
import { updateWithoutAxios } from "@/lib/api/helpers";
import { useApiError } from "@/hooks/useApiError";
import toast from "react-hot-toast";

interface UsernameChangeModalProps {
  onClose: () => void;
  onSuccess: () => void;
  currentUsername: string;
}

export const UsernameChangeModal: React.FC<UsernameChangeModalProps> = ({
  onClose,
  onSuccess,
  currentUsername,
}) => {
  const { user, setUser } = useAuth();
  const [newUsername, setNewUsername] = useState("");
  const {
    error,
    setError,
    isLoading: isSubmitting,
    executeApiCall,
  } = useApiError();

  const validateUsername = () => {
    if (!newUsername) {
      setError("Le nom d'utilisateur est requis");
      return false;
    }

    if (newUsername.length < 3) {
      setError("Le nom d'utilisateur doit contenir au moins 3 caractères");
      return false;
    }

    if (newUsername === currentUsername) {
      setError("Le nouveau nom d'utilisateur doit être différent de l'actuel");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateUsername() || !user?.id) return;

    const toastId = toast.loading("Mise à jour du nom d'utilisateur...");

    try {
      await executeApiCall(
        async () => {
          const response = await updateWithoutAxios(
            API_PATHS.USERS,
            user.id.toString(),
            {
              username: newUsername,
            }
          );

          if (!response) {
            throw new Error("La mise à jour du nom d'utilisateur a échoué");
          }

          return response;
        },
        (response) => {
          setUser({ ...user, username: newUsername });
          toast.success("Nom d'utilisateur mis à jour avec succès", {
            id: toastId,
          });
          onSuccess();
        },
        "Une erreur est survenue lors du changement de nom d'utilisateur",
        false
      );
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue", { id: toastId });
      console.error("Erreur détaillée:", error.originalError);
    }
  };

  const steps: Step[] = [
    {
      id: "username",
      title: "Changer votre nom d'utilisateur",
      description: "Entrez un nouveau nom d'utilisateur",
      content: (
        <div className="flex flex-col gap-4 w-full">
          <TextInput
            label="Nouveau nom d'utilisateur"
            placeholder="Entrez un nouveau nom d'utilisateur"
            value={newUsername}
            onChange={(e) => {
              setNewUsername(e.target.value);
              if (error) setError("");
            }}
            error={error}
            leftIcon
            leftIconName="user"
          />
        </div>
      ),
      validator: validateUsername,
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

export default UsernameChangeModal;
