import { PostType as BasePostType } from "./post";

// Type pour les attributs d'un post dans Strapi
export interface StrapiPostAttributes {
  title: string;
  content: string;
  slug: string;
  upvotes: number;
  downvotes: number;
  publishedDate: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  author?: {
    data: {
      id: string;
      attributes: {
        username: string;
        email: string;
        avatarUrl?: string;
      };
    };
  };
  subrhetic?: {
    data: {
      id: string;
      attributes: {
        name: string;
        slug: string;
      };
    };
  };
}

// Re-export du type PostType pour être utilisé dans l'application
export type { BasePostType as PostType };
