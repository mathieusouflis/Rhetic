import { create, remove } from "../apiClient";

export interface SavedItem {
  id: string;
  item_type: "post" | "comment";
  category?: string;
  notes?: string;
  post?: string;
  comment?: string;
}

export const bookmarkService = {
  createBookmark: async (data: Omit<SavedItem, "id">) => {
    return create<SavedItem>("saved-items", data);
  },

  removeBookmark: async (id: string) => {
    return remove("saved-items", id);
  },
};
