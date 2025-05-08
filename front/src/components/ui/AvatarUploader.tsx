"use client";

import React, { useState, useRef } from "react";
import { ActionButton } from "./ActionButton";
import { Body } from "./Typography";
import classNames from "classnames";
import Icon from "./Icons";

interface AvatarUploaderProps {
  selectedImageUrl: string;
  onImageSelected: (url: string) => void;
  onFileSelected?: (file: File | null) => void;
  isUploading?: boolean;
  setIsUploading?: (isUploading: boolean) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  shape?: "circle" | "square";
  uploadEndpoint?: string;
  label?: string;
  error?: string;
  immediateUpload?: boolean;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  selectedImageUrl,
  onImageSelected,
  onFileSelected,
  isUploading = false,
  setIsUploading = () => {},
  className = "",
  size = "md",
  shape = "circle",
  uploadEndpoint = `${process.env.NEXT_PUBLIC_API_URL || ""}/api/upload`,
  label = "Community Icon",
  error,
  immediateUpload = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const handleUpload = async (file: File) => {
    if (!file) return;

    if (immediateUpload) {
      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append("files", file);

        const response = await fetch(uploadEndpoint, {
          method: "POST",
          body: formData,
          headers: {},
        });

        if (!response.ok) {
          throw new Error(`Upload failed with status ${response.status}`);
        }

        const data = await response.json();
        if (data && data[0]?.url) {
          onImageSelected(data[0].url);
        } else {
          throw new Error("Invalid response format from upload endpoint");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsUploading(false);
      }
    } else {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      onImageSelected(objectUrl);

      if (onFileSelected) {
        onFileSelected(file);
      }
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      await handleUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    onImageSelected("");

    if (onFileSelected) {
      onFileSelected(null);
    }
  };

  return (
    <div className={classNames("flex flex-col items-center gap-4", className)}>
      <div
        className={classNames(
          sizeClasses[size],
          "relative overflow-hidden flex items-center justify-center bg-[var(--black-600)] border-2",
          {
            "rounded-full": shape === "circle",
            "rounded-md": shape === "square",
            "border-[var(--blue-500)] border-dashed": dragActive,
            "border-[var(--black-500)] hover:border-[var(--blue-300)]":
              !dragActive && !selectedImageUrl,
            "border-transparent": selectedImageUrl,
            "border-[var(--red-500)]": error,
          }
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {selectedImageUrl ? (
          <>
            <img
              src={selectedImageUrl}
              alt="Selected icon"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
              <Icon name="edit" size={24} className="text-white" />
            </div>
          </>
        ) : isUploading ? (
          <div className="flex flex-col items-center justify-center text-[var(--black-300)]">
            <Icon name="loader" size={24} className="animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-2 cursor-pointer">
            <Icon name="upload" size={20} className="text-[var(--black-300)]" />
            <Body className="text-center text-[var(--black-300)] mt-1">
              {immediateUpload ? "Upload image" : "Select image"}
            </Body>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      {error && <Body className="text-[var(--red-500)]">{error}</Body>}

      {selectedImageUrl && (
        <div className="flex gap-2">
          <ActionButton variant="gray" onClick={handleRemove} leftIcon={false}>
            Remove
          </ActionButton>
        </div>
      )}
      {label && (
        <Body className="font-medium text-[var(--black-200)]">{label}</Body>
      )}
    </div>
  );
};
