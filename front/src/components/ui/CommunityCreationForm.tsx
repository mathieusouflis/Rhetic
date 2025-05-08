"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { API_PATHS } from "@/lib/api/config";
import { fetchMany, create, upload } from "@/lib/api/apiClient";
import { MultiStepForm, Step } from "./MultiStepForm/MultiStepForm";
import { TextInput } from "./TextInput";
import { Textarea } from "./Textarea";
import { TagSelector, Tag, Category, TagCategory } from "./TagSelector";
import { H2 } from "./Typography";
import { z } from "zod";
import { AvatarUploader } from "./AvatarUploader";

const communityNameSchema = z
  .string()
  .min(3, "Community name must be at least 3 characters")
  .max(30, "Community name must be less than 30 characters")
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    "Community name can only contain letters, numbers, - and _"
  );

interface CommunityCreationFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const CommunityCreationForm: React.FC<CommunityCreationFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { user } = useAuth();

  const [communityName, setCommunityName] = useState("");
  const [communityDescription, setCommunityDescription] = useState("");
  const [selectedIconUrl, setSelectedIconUrl] = useState("");
  const [selectedIconFile, setSelectedIconFile] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [tagCategories, setTagCategories] = useState<TagCategory[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTags, setIsLoadingTags] = useState(false);

  const [nameError, setNameError] = useState("");
  const [tagError, setTagError] = useState("");
  const [iconError, setIconError] = useState("");

  useEffect(() => {
    const fetchCategoriesWithTopics = async () => {
      setIsLoadingTags(true);

      try {
        const response = await fetchMany<any>("/topic-categories", {
          populate: ["topics"],
          pagination: { pageSize: 60 },
        });

        if (response.data) {
          const allTags: Tag[] = [];
          const tagCats: TagCategory[] = [];

          response.data.forEach((category: any) => {
            const categoryName = category.Name || "";

            const categoryTopics = category.topics || [];

            const tags: Tag[] = categoryTopics.map((topic: any) => {
              const tag: Tag = {
                id: topic.id,
                name: topic.name,
                categories: [
                  {
                    id: category.id,
                    name: categoryName,
                  },
                ],
              };

              allTags.push(tag);

              return tag;
            });

            if (tags.length > 0) {
              tagCats.push({
                category: {
                  id: category.id,
                  name: categoryName,
                },
                tags,
              });
            }
          });

          tagCats.sort((a, b) =>
            a.category.name.localeCompare(b.category.name)
          );

          setAvailableTags(allTags);
          setTagCategories(tagCats);

          console.log(
            `Loaded ${allTags.length} topics in ${tagCats.length} categories`
          );
        }
      } catch (error) {
        console.error("Error fetching categories and topics:", error);
        setTagError("Failed to load topics. Please try again later.");
      } finally {
        setIsLoadingTags(false);
      }
    };

    fetchCategoriesWithTopics();
  }, []);

  const validateName = (): boolean => {
    try {
      communityNameSchema.parse(communityName);
      setNameError("");
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setNameError(error.errors[0]?.message || "Invalid community name");
      }
      return false;
    }
  };

  const handleCreateCommunity = async () => {
    if (!user?.id) return false;

    setIsLoading(true);

    try {

      const communityData: Record<string, any> = {
        creator: user.id,
        name: communityName,
      };

      if (communityDescription) {
        communityData.description = communityDescription;
      }
      if (selectedIconFile) {
        setIsUploading(true);
        try {
          const uploadedFiles = await upload([selectedIconFile]);

          if (uploadedFiles && uploadedFiles[0]?.id) {
            communityData.icon = uploadedFiles[0].id;
          }
        } catch (error) {
          console.error("Error uploading icon:", error);
          setIconError("Failed to upload icon. Please try again.");
          setIsLoading(false);
          setIsUploading(false);
          return false;
        } finally {
          setIsUploading(false);
        }
      }

      if (selectedTags.length > 0) {
        communityData.topics = selectedTags.map((tag) => tag.id);
      }

      await create(API_PATHS.SUBRHETIC, communityData);

      onSuccess();
      return true;
    } catch (error) {
      console.error("Error creating community:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const steps: Step[] = [
    {
      id: "basics",
      title: "Basic Information",
      description: "Let's start with the essentials",
      content: (
        <div className="flex flex-col gap-4">
          <TextInput
            label="Community Name*"
            placeholder="Enter a name for your community"
            value={communityName}
            onChange={(e) => {
              setCommunityName(e.target.value);
              if (nameError) validateName();
            }}
            error={nameError}
            hint="This will also be used for your community's URL"
          />

          <Textarea
            label="Description"
            placeholder="What's your community about? (optional)"
            value={communityDescription}
            onChange={(e) => setCommunityDescription(e.target.value)}
            rows={4}
            counter
            maxLength={300}
            hint="A brief description helps people understand what your community is about"
          />
        </div>
      ),
      validator: validateName,
    },
    {
      id: "icon",
      title: "Choose an Icon",
      description: "Upload an icon for your community",
      content: (
        <AvatarUploader
          selectedImageUrl={selectedIconUrl}
          onImageSelected={setSelectedIconUrl}
          onFileSelected={setSelectedIconFile}
          isUploading={isUploading}
          setIsUploading={setIsUploading}
          className="mx-auto"
          size="lg"
          label="Community icon (optional)"
          immediateUpload={false}
          error={iconError}
        />
      ),
    },
    {
      id: "tags",
      title: "Add Topics",
      description: "Choose topics that describe your community",
      content: (
        <TagSelector
          availableTags={availableTags}
          tagCategories={tagCategories}
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          maxTags={5}
          isLoading={isLoadingTags}
          error={tagError}
          groupByCategory={true}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <H2>Create a Community</H2>

      <MultiStepForm
        steps={steps}
        onComplete={handleCreateCommunity}
        onCancel={onCancel}
        completeButtonText="Create Community"
        cancelButtonText="Cancel"
        isSubmitting={isLoading || isUploading}
      />
    </div>
  );
};
