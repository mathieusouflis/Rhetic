export type AuthorType = {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  blocked: boolean;
  confirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
  documentId: string;
  provider: string;
  publishedAt: Date;
  avatar?: {
    url: string;
  };
};

export type CommentsType = {
  count: number;
  comments: CommentType[];
};

export type CommentType = {
  id: string;
  documentId: string;
  content: string;
  upvotes: number;
  downvotes: number;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  votes: VoteType | VoteType[];
  saved_items: SavedItemType | SavedItemType[];
  childrens?: CommentType[];
  parent?: CommentType;
  author?: AuthorType;
};

export type SavedItemType = any;

export type VoteType = any;

export type SubrheticType = {
  id: string;
  name: string;
  documentId: string;
  icon?: string;
};

export type PostType = {
  id: string;
  documentId: string;
  title: string;
  content: string;
  slug: string | null;
  upvotes: number;
  downvotes: number;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  publishedDate: Date | null;
  author?: AuthorType;
  Media?: any[];
  comments?: CommentType[] | CommentsType;
  saved_items?: SavedItemType | SavedItemType[];
  votes?: VoteType | VoteType[];
  user?: { id: number | string; username: string; avatarUrl?: string };
  subrhetic?: SubrheticType;
};
