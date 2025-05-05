import { Schema, Attribute } from '@strapi/strapi';

declare module '@strapi/strapi' {
  export interface Core {
    Strapi: {
      entityService: {
        findOne: <T>(uid: string, id: string | number, params?: any) => Promise<T>;
        find: <T>(uid: string, params?: any) => Promise<T[]>;
        create: <T>(uid: string, params: { data: any }) => Promise<T>;
        update: <T>(uid: string, id: string | number, params: { data: any }) => Promise<T>;
        delete: <T>(uid: string, id: string | number) => Promise<T>;
      };
    };
  }
}

export interface StrapiContext {
  params: {
    id?: string;
    [key: string]: any;
  };
  request: {
    body: any;
    url: string;
    query: any;
  };
  state: {
    user?: any;
    vote?: any;
    [key: string]: any;
  };
  unauthorized: (message: string) => any;
  badRequest: (message: string) => any;
  notFound: (message: string) => any;
  forbidden: (message: string) => any;
  internalServerError: (message: string) => any;
}

export interface User {
  id: number;
  username: string;
  email: string;
  [key: string]: any;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  slug: string;
  upvotes: number;
  downvotes: number;
  author?: User;
  subrhetic?: Subrhetic;
  comments?: Comment[];
  votes?: Vote[];
  [key: string]: any;
}

export interface Comment {
  id: number;
  content: string;
  upvotes: number;
  downvotes: number;
  author?: User;
  post?: Post;
  parent?: Comment;
  children?: Comment[];
  votes?: Vote[];
  [key: string]: any;
}

export interface Subrhetic {
  id: number;
  name: string;
  slug: string;
  description?: string;
  creator?: User;
  moderators?: User[];
  members?: User[];
  banned_users?: User[];
  posts?: Post[];
  [key: string]: any;
}

export interface Vote {
  id: number;
  type: 'upvote' | 'downvote';
  user: number | User;
  post?: number | Post;
  comment?: number | Comment;
  [key: string]: any;
}