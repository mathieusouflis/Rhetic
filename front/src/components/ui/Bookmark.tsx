import React, { useState } from "react";
import LittleAction from "./LittleAction";
import { create, remove } from "@/lib/api/apiClient";
import { API_PATHS } from "@/lib/api/config";
import { SavedItemType } from "@/types/post";
import { useAuth } from "@/providers/AuthProvider";

type BookmarkType = "comment" | "post";

export interface BookmarkProps {
  bookmarkType: BookmarkType;
  itemId: string;
  bookmarked: boolean;
  bookmarkId?: string;
}

export const Bookmark: React.FC<BookmarkProps> = ({
  bookmarkType,
  itemId,
  bookmarked,
  bookmarkId,
}) => {
  const [bookmarkStatus, setBookmarkStatus] = useState(bookmarked);
  const [_bookmarkId, setBookmarkId] = useState(bookmarkId);

  const { user } = useAuth();

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (bookmarkStatus && _bookmarkId) {
        await remove(API_PATHS.SAVED_ITEM, _bookmarkId);
      } else {
        const response = (await create<SavedItemType>(API_PATHS.SAVED_ITEM, {
          item_type: bookmarkType === "post" ? "post" : "comment",
          users_permissions_user: user?.id,
          post: bookmarkType === "post" ? itemId : undefined,
          comment: bookmarkType === "comment" ? itemId : undefined,
        })) as SavedItemType;
        
        // Assurez-vous d'utiliser le bon chemin pour l'ID dans le retour de l'API
        setBookmarkId(response.data.id);
      }
      setBookmarkStatus((old) => !old);
    } catch (error) {
      console.error(
        `Failed to ${bookmarkStatus ? "remove" : "create"} bookmark:`,
        error
      );
    }
  };

  return (
    <LittleAction
      full={bookmarkStatus}
      iconName="bookmark"
      color="yellow"
      onClick={handleClick}
    />
  );
};