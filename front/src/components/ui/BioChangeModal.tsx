"use client";

import React, { useState } from "react";
import { MultiStepForm, Step } from "./MultiStepForm/MultiStepForm";
import { useAuth } from "@/providers/AuthProvider";
import { API_PATHS } from "@/lib/api/config";
import { Textarea } from "./Textarea";
import { updateWithoutAxios } from "@/lib/api/helpers";
import { useApiError } from "@/hooks/useApiError";
import toast from "react-hot-toast";

interface BioChangeModalProps {
  onClose: () => void;
  onSuccess: () => void;
  currentBio?: string;
}

export const BioChangeModal: React.FC<BioChangeModalProps> = ({
  onClose,
  onSuccess,
  currentBio = "",
}) => {
  const { user, setUser } = useAuth();
  const [newBio, setNewBio] = useState(currentBio);
  const {
    error,
    setError,
    isLoading: isSubmitting,
    executeApiCall,
  } = useApiError();

  const validateBio = () => {
    if (newBio && newBio.length > 500) {
      setError("La bio ne doit pas dépasser 500 caractères");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateBio() || !user?.id) return;

    const toastId = toast.loading("Mise à jour de la bio...");

    try {
      await executeApiCall(
        async () => {
          const response = await updateWithoutAxios(
            API_PATHS.USERS,
            user.id.toString(),
            {
              bio: newBio,
            }
          );

          if (!response) {
            throw new Error("La mise à jour de la bio a échoué");
          }

          return response;
        },
        (response) => {
          setUser({ ...user, bio: newBio });
          toast.success("Bio mise à jour avec succès", { id: toastId });
          onSuccess();
        },
        "Une erreur est survenue lors de la mise à jour de la bio",
        false
      );
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue", { id: toastId });
      console.error("Erreur détaillée:", error.originalError);
    }
  };

  const steps: Step[] = [
    {
      id: "bio",
      title: "Modifier votre bio",
      description: "Parlez un peu de vous",
      content: (
        <div className="flex flex-col gap-4 w-full">
          <Textarea
            label="Bio"
            placeholder="Parlez un peu de vous..."
            value={newBio}
            onChange={(e) => {
              setNewBio(e.target.value);
              if (error) setError("");
            }}
            error={error}
            rows={5}
            counter
            maxLength={500}
            hint="Maximum 500 caractères"
          />
        </div>
      ),
      validator: validateBio,
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

export default BioChangeModal;
