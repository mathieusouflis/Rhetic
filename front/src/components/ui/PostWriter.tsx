import React, { FormEvent, useState, useRef } from "react";
import { Avatar } from "./Avatar";
import { TextInput } from "./TextInput";
import Icon from "./Icons";
import { ActionButton } from "./ActionButton";
import { create, upload } from "@/lib/api/apiClient";
import { API_PATHS } from "@/lib/api/config";
import { useAuth } from "@/providers/AuthProvider";
import classNames from "classnames";

interface Media {
  type: "image" | "video";
  url: string;
  file: File;
}

interface PostWriterProps {
  type?: "post" | "comment";
  parent_type?: "post" | "comment";
  parent_id?: string;
  onSubmit?: (content: string, media: Media[]) => void;
  className?: string;
}

const PostWriter: React.FC<
  PostWriterProps & Omit<React.HTMLAttributes<HTMLFormElement>, "onSubmit">
> = ({
  type = "post",
  parent_type,
  parent_id,
  onSubmit,
  className = "",
  ...props
}) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [media, setMedia] = useState<Media[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

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
      prev[index]?.url && URL.revokeObjectURL(prev[index].url);
      return filtered;
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim() && media.length === 0) return;

    try {
      setIsSubmitting(true);

      let mediaIds: string[] = [];
      if (media.length > 0) {
        const uploadedFiles = await upload(media.map((m) => m.file));
        mediaIds = uploadedFiles.map((file: any) => file.id);
      }

      await create(type === "post" ? API_PATHS.POSTS : API_PATHS.COMMENTS, {
        content,
        ...(mediaIds.length > 0 && type === "post" && { Media: mediaIds }),
        author: user?.id,
        ...(parent_type === "post" && { post: parent_id }),
        ...(parent_type === "comment" && { parent: parent_id }),
      });

      onSubmit?.(content, media);
      setContent("");
      setMedia([]);
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-row gap-2.5 pb-4 w-full ${className}`}
      {...props}
    >
      <Avatar
        src="https://images.unsplash.com/photo-1726066012604-a309bd0575df?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="User Avatar"
        size="md"
      />
      <div className="flex flex-col gap-4 w-full">
        <TextInput
          className="w-full h-full"
          variant="black"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          name="content"
          id="content"
          disabled={isSubmitting}
        />

        {media.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {media.map((item, index) => (
              <div key={index} className="relative group aspect-square">
                {item.type === "image" ? (
                  <img
                    src={item.url}
                    alt={`Upload ${index + 1}`}
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

        <div
          className={classNames("flex flex-row gap-2.5 w-full items-center", {
            "justify-end": type === "comment",
            "justify-between": type === "post",
          })}
        >
          {type === "post" && (
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
                className="disabled:opacity-50"
              >
                <Icon name="image_plus" size={17} color="var(--yellow)" />
              </button>
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                disabled={media.length >= 4}
                className="disabled:opacity-50"
              >
                <Icon name="video" size={17} color="var(--yellow)" />
              </button>
              <Icon name="table" size={17} color="var(--yellow)" />
              <div className="h-auto w-px bg-[var(--black-100)]" />
              <Icon name="bold" size={17} color="var(--yellow)" />
              <Icon name="italic" size={17} color="var(--yellow)" />
              <Icon name="strikethrough" size={17} color="var(--yellow)" />
              <Icon name="code" size={17} color="var(--yellow)" />
              <Icon name="eye_off" size={17} color="var(--yellow)" />
            </div>
          )}
          <ActionButton
            type="submit"
            leftIcon={false}
            variant="white"
            className="self-end"
            disabled={isSubmitting || (!content.trim() && media.length === 0)}
          >
            <strong>
              {isSubmitting
                ? "Posting..."
                : type === "post"
                ? "Post"
                : "Comment"}
            </strong>
          </ActionButton>
        </div>
      </div>
    </form>
  );
};

export default PostWriter;
