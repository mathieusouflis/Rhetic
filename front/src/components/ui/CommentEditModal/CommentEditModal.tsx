import React, { useState, useEffect } from "react";
import { MultiStepForm, Step } from "../MultiStepForm/MultiStepForm";
import { TextInput } from "../TextInput";
import { Body } from "../Typography";
import Icon from "../Icons";
import { API_PATHS } from "@/lib/api/config";
import { API_CONFIG } from "@/config";
import { CommentType } from "@/types/post";
import { update } from "@/lib/api/apiClient";
import { Textarea } from "../Textarea";

interface CommentEditModalProps {
  comment: CommentType;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CommentEditModal: React.FC<CommentEditModalProps> = ({
  comment,
  onClose,
  onSuccess,
}) => {
  const [content, setContent] = useState(comment.content || "");
  const [contentError, setContentError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    if (!content.trim()) {
      setContentError("Le contenu est requis");
      return false;
    }
    setContentError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      await update(API_PATHS.COMMENTS, comment.id, {
        content,
      });

      if (onSuccess) {
        onSuccess();
      } else {
        window.location.reload();
      }

      onClose();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du commentaire:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps: Step[] = [
    {
      id: "edit",
      title: "Modifier le commentaire",
      description: "Modifiez le contenu de votre commentaire",
      content: (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="content"
              className="text-[var(--black-200)] text-sm"
            >
              Contenu
            </label>
            <Textarea
              className="w-full min-h-[120px]"
              variant="fill"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (contentError) setContentError("");
              }}
              name="content"
              id="content"
              placeholder="Contenu du commentaire"
              error={contentError}
            />
            {contentError && (
              <Body className="text-[var(--red)]">{contentError}</Body>
            )}
          </div>
        </div>
      ),
      validator: validateForm,
    },
  ];

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
      onClick={onClose}
    >
      <div
        className="bg-[var(--black-700)] p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[20px] font-bold">Modifier le commentaire</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[var(--black-600)]"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

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

export default CommentEditModal;
