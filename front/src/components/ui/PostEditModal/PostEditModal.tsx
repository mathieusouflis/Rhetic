import React, { useState, useEffect } from "react";
import { MultiStepForm, Step } from "../MultiStepForm/MultiStepForm";
import { TextInput } from "../TextInput";
import { Body } from "../Typography";
import Icon from "../Icons";
import { API_PATHS } from "@/lib/api/config";
import { API_CONFIG } from "@/config";
import { PostType } from "@/types/post";
import { update, upload } from "@/lib/api/apiClient";
import { useRouter } from "next/navigation";
import { Textarea } from "../Textarea";

interface PostEditModalProps {
  post: PostType;
  onClose: () => void;
  onSuccess?: () => void;
}

interface Media {
  type: "image" | "video";
  url: string;
  file?: File;
  id?: string;
}

export const PostEditModal: React.FC<PostEditModalProps> = ({
  post,
  onClose,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState(post.title || "");
  const [content, setContent] = useState(post.content || "");
  const [media, setMedia] = useState<Media[]>([]);
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");

  const router = useRouter();
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const videoInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (post.Media && Array.isArray(post.Media)) {
      try {
        const existingMedia = post.Media.map((item) => ({
          type: item.mime?.startsWith("image")
            ? ("image" as const)
            : ("video" as const),
          url: API_CONFIG.baseURL.split("/api")[0] + item.url,
          id: item.id,
        }));
        setMedia(existingMedia);
      } catch (error) {
        console.error("Erreur lors du traitement des médias:", error);
      }
    }
  }, [post]);

  const handleMediaUpload = (
    files: FileList | null,
    type: "image" | "video"
  ) => {
    if (!files) return;

    const remainingSlots = 4 - media.length;
    if (remainingSlots <= 0) return;

    const newMedia = Array.from(files)
      .slice(0, remainingSlots)
      .map((file) => ({
        type,
        url: URL.createObjectURL(file),
        file,
      }));

    setMedia((prev) => [...prev, ...newMedia]);
  };

  const removeMedia = (index: number) => {
    setMedia((prev) => {
      const filtered = prev.filter((_, i) => i !== index);

      if (prev[index]?.file) {
        URL.revokeObjectURL(prev[index].url);
      }
      return filtered;
    });
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const mediaToUpload = media.filter((m) => m.file);
      let newMediaIds: string[] = [];

      if (mediaToUpload.length > 0) {
        const uploadedFiles = await upload(mediaToUpload.map((m) => m.file!));
        newMediaIds = uploadedFiles.map((file: any) => file.id);
      }

      const existingMediaIds = media
        .filter((m) => m.id)
        .map((m) => m.id as string);

      const mediaIds = [...existingMediaIds, ...newMediaIds];

      await update(API_PATHS.POSTS, post.id, {
        title,
        content,
        ...(mediaIds.length > 0 && { Media: mediaIds }),
      });

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(`/posts/${post?.documentId}`);
      }

      onClose();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const validateForm = () => {
    let isValid = true;

    if (!title.trim()) {
      setTitleError("Le titre est requis");
      isValid = false;
    } else {
      setTitleError("");
    }

    if (!content.trim()) {
      setContentError("Le contenu est requis");
      isValid = false;
    } else {
      setContentError("");
    }

    return isValid;
  };

  const steps: Step[] = [
    {
      id: "edit",
      title: "Modifier le post",
      description: "Modifiez le titre, le contenu et les médias de votre post",
      content: (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-[var(--black-200)] text-sm">
              Titre
            </label>
            <TextInput
              className="w-full"
              variant="fill"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError("");
              }}
              name="title"
              id="title"
              placeholder="Titre du post"
              error={titleError}
            />
            {titleError && (
              <Body className="text-[var(--red)]">{titleError}</Body>
            )}
          </div>

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
              placeholder="Contenu du post"
              error={contentError}
            />
            {contentError && (
              <Body className="text-[var(--red)]">{contentError}</Body>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[var(--black-200)] text-sm">
              Médias ({media.length}/4)
            </label>
            <div className="flex flex-row gap-2.5">
              <input
                type="file"
                ref={imageInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={(e) => handleMediaUpload(e.target.files, "image")}
                disabled={media.length >= 4}
              />
              <input
                type="file"
                ref={videoInputRef}
                className="hidden"
                accept="video/*"
                multiple
                onChange={(e) => handleMediaUpload(e.target.files, "video")}
                disabled={media.length >= 4}
              />

              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                disabled={media.length >= 4}
                className="disabled:opacity-50 flex items-center gap-2 px-3 py-2 bg-[var(--black-600)] rounded-md hover:bg-[var(--black-500)]"
              >
                <Icon name="image_plus" size={17} color="var(--yellow)" />
                <Body>Images</Body>
              </button>
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                disabled={media.length >= 4}
                className="disabled:opacity-50 flex items-center gap-2 px-3 py-2 bg-[var(--black-600)] rounded-md hover:bg-[var(--black-500)]"
              >
                <Icon name="video" size={17} color="var(--yellow)" />
                <Body>Vidéos</Body>
              </button>
            </div>

            {media.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                {media.map((item, index) => (
                  <div key={index} className="relative group aspect-square">
                    {item.type === "image" ? (
                      <img
                        src={item.url}
                        alt={`Media ${index + 1}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <video
                        src={item.url}
                        className="w-full h-full object-cover rounded-md"
                        controls
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="absolute -top-2 -right-2 bg-[var(--black-800)] rounded-full p-1 
                               opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Icon name="x" size={14} color="var(--red)" />
                    </button>
                  </div>
                ))}
              </div>
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
          <h2 className="text-[20px] font-bold">Modifier le post</h2>
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

export default PostEditModal;
