"use client";

import React, { useState } from "react";
import { MultiStepForm, Step } from "./MultiStepForm/MultiStepForm";
import { useAuth } from "@/providers/AuthProvider";
import { upload } from "@/lib/api/apiClient";
import { API_PATHS } from "@/lib/api/config";
import { AvatarUploader } from "./AvatarUploader";
import { updateWithoutAxios } from "@/lib/api/helpers";
import { useApiError } from "@/hooks/useApiError";
import toast from "react-hot-toast";

interface AvatarChangeModalProps {
  onClose: () => void;
  onSuccess: () => void;
  currentAvatar?: string;
}

export const AvatarChangeModal: React.FC<AvatarChangeModalProps> = ({
  onClose,
  onSuccess,
  currentAvatar = "",
}) => {
  const { user, setUser } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>(
    currentAvatar || ""
  );
  const {
    error,
    setError,
    isLoading: isSubmitting,
    executeApiCall,
  } = useApiError();
  const [isUploading, setIsUploading] = useState(false);

  const validateAvatar = () => {
    if (!selectedFile && !selectedImageUrl) {
      setError("Veuillez sélectionner une image");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateAvatar() || !user?.id) return;

    const toastId = toast.loading("Mise à jour de l'avatar...");

    try {
      await executeApiCall(
        async () => {
          if (selectedFile) {
            setIsUploading(true);
            const uploadedFiles = await upload(selectedFile);
            setIsUploading(false);

            if (!uploadedFiles || uploadedFiles.length === 0) {
              throw new Error("Échec du téléchargement de l'image");
            }

            const avatarId = uploadedFiles[0].id;

            const response = await updateWithoutAxios(
              API_PATHS.USERS,
              user.id.toString(),
              {
                avatar: avatarId,
              }
            );

            if (response) {
              setUser({
                ...user,
                avatar: uploadedFiles[0].url,
              });
              return response;
            } else {
              throw new Error("La mise à jour du profil a échoué");
            }
          }
          return null;
        },
        (response) => {
          if (response) {
            toast.success("Photo de profil mise à jour avec succès", {
              id: toastId,
            });
            onSuccess();
          } else {
            toast.dismiss(toastId);
            toast.error("Aucune modification effectuée");
          }
        },
        "Une erreur est survenue lors de la mise à jour de l'avatar",
        false
      );
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue", { id: toastId });
      console.error("Erreur détaillée:", error.originalError);
    }
  };

  const steps: Step[] = [
    {
      id: "avatar",
      title: "Changer votre photo de profil",
      description: "Téléchargez une nouvelle photo de profil",
      content: (
        <div className="flex flex-col gap-4 w-full">
          <AvatarUploader
            selectedImageUrl={selectedImageUrl}
            onImageSelected={setSelectedImageUrl}
            onFileSelected={setSelectedFile}
            isUploading={isUploading}
            setIsUploading={setIsUploading}
            className="mx-auto"
            size="lg"
            label="Photo de profil"
            immediateUpload={false}
            error={error}
          />
        </div>
      ),
      validator: validateAvatar,
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

export default AvatarChangeModal;
