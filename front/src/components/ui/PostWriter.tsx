import React, { FormEvent, useState, useRef, useEffect } from "react";
import classNames from "classnames";

import { API_PATHS } from "@/lib/api/config";
import { create, upload, fetchMany } from "@/lib/api/apiClient";
import { useAuth } from "@/providers/AuthProvider";

import { ActionButton } from "./ActionButton";
import { Avatar } from "./Avatar";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from "./Dropdown";
import Icon from "./Icons";
import { SearchBar } from "./Searchbar";
import { TextInput } from "./TextInput";
import { Body } from "./Typography";

interface Media {
  type: "image" | "video";
  url: string;
  file: File;
}

interface Subrhetic {
  id: number;
  name: string;
  documentId: string;
}

interface PostWriterProps {
  type?: "post" | "comment";

  parent_type?: "post" | "comment";

  parent_id?: string;

  onSubmit?: (content: string, media: Media[]) => void;

  isTitleRequired?: boolean;

  isSubrheticRequired?: boolean;

  initialSubrhetic?: Subrhetic | null;

  className?: string;
}

const PostWriter: React.FC<
  PostWriterProps & Omit<React.HTMLAttributes<HTMLFormElement>, "onSubmit">
> = ({
  type = "post",
  parent_type,
  parent_id,
  onSubmit,
  isTitleRequired = true,
  isSubrheticRequired = true,
  initialSubrhetic = null,
  className = "",
  ...props
}) => {
  console.log("PostWriter props:", {
    type,
    isTitleRequired,
    isSubrheticRequired,
  });
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [media, setMedia] = useState<Media[]>([]);
  const [selectedSubrhetic, setSelectedSubrhetic] = useState<Subrhetic | null>(
    initialSubrhetic
  );
  const [subrhetics, setSubrhetics] = useState<Subrhetic[]>([]);
  const [isSubrheticsDropdownOpen, setIsSubrheticsDropdownOpen] =
    useState(false);
  const [isLoadingSubrhetics, setIsLoadingSubrhetics] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [titleError, setTitleError] = useState<string>("");
  const [subrheticError, setSubrheticError] = useState<string>("");
  const [contentError, setContentError] = useState<string>("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (type === "post" && user?.id) {
      fetchJoinedSubrhetics();
    }
  }, [type, user?.id]);

  const fetchJoinedSubrhetics = async () => {
    setIsLoadingSubrhetics(true);
    try {
      const response = await fetchMany<Subrhetic>(API_PATHS.SUBRHETIC, {
        filters: {
          members: {
            id: {
              $eq: user?.id,
            },
          },
        },
        fields: ["id", "name", "documentId"],
      });

      if (response?.data) {
        setSubrhetics(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch joined subrhetics:", error);
    } finally {
      setIsLoadingSubrhetics(false);
    }
  };

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

    setTitleError("");
    setSubrheticError("");
    setContentError("");

    let hasError = false;

    if (type === "post") {
      if (isTitleRequired && !title.trim()) {
        setTitleError("Please enter a title for your post");
        hasError = true;
      } else {
        setTitleError("");
      }

      if (isSubrheticRequired && !selectedSubrhetic) {
        setSubrheticError("Please select a community to post in");
        hasError = true;
      } else {
        setSubrheticError("");
      }
    }

    if (!content.trim() && media.length === 0) {
      setContentError("Please enter some content or add media");
      hasError = true;
    } else {
      setContentError("");
    }

    if (hasError) return;

    try {
      setIsSubmitting(true);

      let mediaIds: string[] = [];
      if (media.length > 0) {
        const uploadedFiles = await upload(media.map((m) => m.file));
        mediaIds = uploadedFiles.map((file: any) => file.id);
      }

      const postData = {
        content,

        ...(type === "post" && title.trim() && { title }),

        ...(mediaIds.length > 0 && type === "post" && { Media: mediaIds }),

        author: user?.id,

        ...(parent_type === "post" && { post: parent_id }),
        ...(parent_type === "comment" && { parent: parent_id }),

        ...(type === "post" &&
          selectedSubrhetic && { subrhetic: selectedSubrhetic.id }),
      };

      console.log("Submitting post data:", {
        postData,
        isTitleRequired,
        isSubrheticRequired,
      });

      await create(
        type === "post" ? API_PATHS.POSTS : API_PATHS.COMMENTS,
        postData
      );

      onSubmit?.(content, media);
      setContent("");
      setTitle("");
      setMedia([]);
    } catch (error) {
      console.error(`Failed to create ${type}:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSubrhetics = searchTerm.trim()
    ? subrhetics.filter((subrhetic) =>
        subrhetic.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : subrhetics;

  const isPostDisabled =
    isSubmitting ||
    (type === "post" && isTitleRequired && !title.trim()) ||
    (type === "post" && isSubrheticRequired && !selectedSubrhetic) ||
    (!content.trim() && media.length === 0);

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
        {type === "post" && isTitleRequired && (
          <>
            <TextInput
              className="w-full"
              variant="black"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError("");
              }}
              name="title"
              id="title"
              placeholder={
                isTitleRequired ? "Post title" : "Post title (optional)"
              }
              disabled={isSubmitting}
              error={titleError}
            />
          </>
        )}

        <TextInput
          className="w-full h-full"
          variant="black"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (contentError) setContentError("");
          }}
          name="content"
          id="content"
          placeholder={
            type === "post"
              ? "Write your post content here..."
              : "Write your comment..."
          }
          disabled={isSubmitting}
          error={contentError}
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
              {media.length > 0 && (
                <small className="text-xs text-[var(--black-300)]">
                  {media.length}/4 files
                </small>
              )}
              <Icon name="table" size={17} color="var(--yellow)" />
              <div className="h-auto w-px bg-[var(--black-100)]" />
              <Icon name="bold" size={17} color="var(--yellow)" />
              <Icon name="italic" size={17} color="var(--yellow)" />
              <Icon name="strikethrough" size={17} color="var(--yellow)" />
              <Icon name="code" size={17} color="var(--yellow)" />
              <Icon name="eye_off" size={17} color="var(--yellow)" />
            </div>
          )}
          <div className="flex flex-row gap-2.5">
            {type === "post" && isSubrheticRequired && (
              <div className="relative w-fit">
                <Dropdown
                  isOpen={isSubrheticsDropdownOpen}
                  setIsOpen={setIsSubrheticsDropdownOpen}
                >
                  <DropdownTrigger
                    onClick={() => {
                      setIsSubrheticsDropdownOpen(!isSubrheticsDropdownOpen);
                      if (subrheticError) setSubrheticError("");
                    }}
                    isOpen={isSubrheticsDropdownOpen}
                    className={classNames({
                      "border-[var(--red-border-transparent-active)]":
                        subrheticError,
                      "hover:border-[var(--black-400)]": !subrheticError,
                    })}
                  >
                    <Body className="text-[var(--white)]">
                      {selectedSubrhetic
                        ? selectedSubrhetic.name
                        : isSubrheticRequired
                        ? "Select a community"
                        : "Select a community (optional)"}
                    </Body>
                    <div className="flex items-center gap-1">
                      {selectedSubrhetic && !isSubrheticRequired && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSubrhetic(null);
                          }}
                          className="p-1 hover:bg-[var(--black-600)] rounded-full"
                        >
                          <Icon name="x" size={14} color="var(--black-200)" />
                        </button>
                      )}
                      <Icon
                        name="chevron_down"
                        size={18}
                        color={
                          subrheticError ? "var(--red)" : "var(--black-200)"
                        }
                        className={classNames({
                          "transform rotate-180 transition-transform":
                            isSubrheticsDropdownOpen,
                        })}
                      />
                    </div>
                  </DropdownTrigger>

                  {isSubrheticsDropdownOpen && (
                    <DropdownContent className="max-h-80 overflow-y-auto z-50">
                      <div className="p-2 border-b border-[var(--black-500)] sticky top-0 bg-[var(--black-700)] z-10">
                        <SearchBar
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search communities..."
                          className="w-full"
                          searchSize="tiny"
                        />
                      </div>

                      {isLoadingSubrhetics ? (
                        <div className="px-2.5 py-2 text-[var(--black-200)]">
                          Loading communities...
                        </div>
                      ) : filteredSubrhetics.length > 0 ? (
                        filteredSubrhetics.map((subrhetic) => (
                          <DropdownItem
                            key={subrhetic.id}
                            onClick={() => {
                              setSelectedSubrhetic(subrhetic);
                              setIsSubrheticsDropdownOpen(false);
                              setSearchTerm("");
                            }}
                            isSelected={selectedSubrhetic?.id === subrhetic.id}
                          >
                            <Body>{subrhetic.name}</Body>
                          </DropdownItem>
                        ))
                      ) : (
                        <div className="px-2.5 py-2 text-[var(--black-200)]">
                          {searchTerm.trim()
                            ? "No matching communities found."
                            : "No communities found. Join some communities first."}
                        </div>
                      )}
                    </DropdownContent>
                  )}
                </Dropdown>
                {subrheticError && (
                  <Body className="text-[var(--red-border-transparent-active)] text-xs mt-1 absolute whitespace-nowrap">
                    {subrheticError}
                  </Body>
                )}
              </div>
            )}
            <ActionButton
              type="submit"
              leftIcon={false}
              variant="white"
              className="self-end"
              disabled={isPostDisabled}
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
      </div>
    </form>
  );
};

export default PostWriter;
