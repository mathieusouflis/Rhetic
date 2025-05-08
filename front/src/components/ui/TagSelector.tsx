"use client";

import React, { useState } from "react";
import { Body } from "./Typography";
import { SearchBar } from "./Searchbar";
import classNames from "classnames";

export interface Tag {
  id: number | string;
  name: string;
  categories?: Category[];
}

export interface Category {
  id: number | string;
  name: string;
}

export interface TagCategory {
  category: Category;
  tags: Tag[];
}

interface TagSelectorProps {
  availableTags: Tag[];
  tagCategories?: TagCategory[];
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  maxTags?: number;
  className?: string;
  isLoading?: boolean;
  searchPlaceholder?: string;
  emptyStateText?: string;
  loadingText?: string;
  error?: string;
  groupByCategory?: boolean;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  availableTags,
  tagCategories = [],
  selectedTags,
  onTagsChange,
  maxTags,
  className = "",
  isLoading = false,
  searchPlaceholder = "Search topics...",
  emptyStateText = "No topics found",
  loadingText = "Loading topics...",
  error,
  groupByCategory = true,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string | number, boolean>
  >({});

  // Toggle category expansion
  const toggleCategory = (categoryId: string | number) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Filter tags based on search term
  const filteredTags = searchTerm
    ? availableTags.filter((tag) =>
        tag.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : availableTags;

  // Filter categories based on search term
  const filteredCategories = searchTerm
    ? tagCategories
        .map((category) => ({
          ...category,
          tags: category.tags.filter((tag) =>
            tag.name.toLowerCase().includes(searchTerm.toLowerCase())
          ),
        }))
        .filter((category) => category.tags.length > 0)
    : tagCategories;

  // Toggle tag selection
  const toggleTag = (tag: Tag) => {
    const isSelected = selectedTags.some((t) => t.id === tag.id);

    if (isSelected) {
      // Remove tag if already selected
      onTagsChange(selectedTags.filter((t) => t.id !== tag.id));
    } else {
      // Check if we've reached max tags limit
      if (maxTags && selectedTags.length >= maxTags) {
        return; // Don't add more tags if we hit the limit
      }
      // Add tag if not selected yet
      onTagsChange([...selectedTags, tag]);
    }
  };

  // Check if a tag is selected
  const isTagSelected = (tag: Tag) => selectedTags.some((t) => t.id === tag.id);

  // Render a tag button
  const renderTagButton = (tag: Tag) => (
    <button
      key={tag.id}
      type="button"
      onClick={() => toggleTag(tag)}
      disabled={
        maxTags ? selectedTags.length >= maxTags && !isTagSelected(tag) : false
      }
      className={classNames(
        "px-3 py-1 rounded-full text-sm transition-colors",
        {
          "bg-[var(--blue-500)] text-white": isTagSelected(tag),
          "bg-[var(--black-600)] text-[var(--black-200)] hover:bg-[var(--black-500)]":
            !isTagSelected(tag) && !(maxTags && selectedTags.length >= maxTags),
          "bg-[var(--black-700)] text-[var(--black-400)] cursor-not-allowed":
            !isTagSelected(tag) && maxTags && selectedTags.length >= maxTags,
        }
      )}
    >
      {tag.name}
    </button>
  );

  return (
    <div className={classNames("flex flex-col gap-3", className)}>
      {/* Search bar for filtering tags */}
      <SearchBar
        placeholder={searchPlaceholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        searchSize="tiny"
        className="w-full"
      />

      {/* Display max tags limit message if applicable */}
      {maxTags && (
        <Body
          className={classNames("text-[var(--black-300)]", {
            "text-[var(--red-500)]": selectedTags.length >= maxTags,
          })}
        >
          You can select up to {maxTags} topics ({selectedTags.length}/{maxTags}
          )
        </Body>
      )}

      {/* Selected tags section */}
      {selectedTags.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <Body className="font-medium">Selected topics:</Body>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <div
                key={`selected-${tag.id}`}
                className="px-3 py-1 rounded-full bg-[var(--blue-500)] text-white text-sm flex items-center gap-1.5 group"
              >
                <span>{tag.name}</span>
                <button
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className="flex items-center justify-center w-4 h-4 rounded-full bg-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.4)] transition-colors"
                >
                  <span className="leading-none">&times;</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available tags section */}
      <div className="flex flex-col gap-1.5">
        <Body className="font-medium">Available topics:</Body>

        {error && <Body className="text-[var(--red-500)]">{error}</Body>}

        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto p-2 border border-[var(--black-500)] rounded-md">
          {isLoading ? (
            <div className="flex items-center justify-center w-full py-4">
              <Body className="text-[var(--black-300)]">{loadingText}</Body>
            </div>
          ) : groupByCategory && filteredCategories.length > 0 ? (
            // Afficher les tags regroupés par catégorie
            filteredCategories.map((category) => (
              <div
                key={category.category.id}
                className="flex flex-col gap-1.5 mb-3"
              >
                <button
                  type="button"
                  onClick={() => toggleCategory(category.category.id)}
                  className="flex items-center justify-between w-full text-left px-2 py-1 rounded bg-[var(--black-700)] hover:bg-[var(--black-600)]"
                >
                  <Body className="font-medium text-[var(--black-200)]">
                    {category.category.name}
                  </Body>
                  <span className="text-[var(--black-200)]">
                    {expandedCategories[category.category.id] ? "−" : "+"}
                  </span>
                </button>

                {expandedCategories[category.category.id] && (
                  <div className="flex flex-wrap gap-2 pl-2 mt-1">
                    {category.tags.map(renderTagButton)}
                  </div>
                )}
              </div>
            ))
          ) : filteredTags.length > 0 ? (
            // Afficher tous les tags sans catégorie
            <div className="flex flex-wrap gap-2">
              {filteredTags.map(renderTagButton)}
            </div>
          ) : (
            <div className="flex items-center justify-center w-full py-4">
              <Body className="text-[var(--black-300)]">{emptyStateText}</Body>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
