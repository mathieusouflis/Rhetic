import { Schema, Attribute } from '@strapi/strapi';

declare module '@strapi/strapi' {
  export namespace Core {
    interface Strapi {
      entityService: EntityService;
    }
    
    interface EntityService {
      findOne: <T>(uid: string, id: string | number, params?: any) => Promise<T>;
      find: <T>(uid: string, params?: any) => Promise<T[]>;
      create: <T>(uid: string, params: { data: any, populate?: any }) => Promise<T>;
      update: <T>(uid: string, id: string | number, params: { data: any, populate?: any }) => Promise<T>;
      delete: <T>(uid: string, id: string | number, params?: any) => Promise<T>;
    }
  }

  export namespace factories {
    interface StrapiController {
      sanitizeOutput: (data: any, ctx: any) => any;
      sanitizeQuery: (ctx: any) => any;
    }

    function createCoreController(uid: string, config?: any): StrapiController;
    function createCoreRouter(uid: string, config?: any): any;
    function createCoreService(uid: string, config?: any): any;
  }
}

export interface StrapiContext {
  params: {
    id?: string;
    [key: string]: any;
  };
  request: {
    body: {
      data?: any;
      [key: string]: any;
    };
    url: string;
    query: any;
    [key: string]: any;
  };
  state: {
    user?: User;
    vote?: VoteInfo;
    [key: string]: any;
  };
  unauthorized: (message: string) => any;
  badRequest: (message: string) => any;
  notFound: (message: string) => any;
  forbidden: (message: string) => any;
  internalServerError: (message: string) => any;
  [key: string]: any;
}

export interface User {
  id: number;
  username: string;
  email: string;
  provider?: string;
  confirmed?: boolean;
  blocked?: boolean;
  role?: any;
  [key: string]: any;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  slug: string;
  upvotes: number;
  downvotes: number;
  publishedDate?: Date;
  author?: User | number;
  subrhetic?: Subrhetic | number;
  comments?: Comment[];
  votes?: Vote[];
  [key: string]: any;
}

export interface Comment {
  id: number;
  content: string;
  upvotes: number;
  downvotes: number;
  publishedDate?: Date;
  author?: User | number;
  post?: Post | number;
  parent?: Comment | number;
  children?: Comment[];
  votes?: Vote[];
  [key: string]: any;
}

export interface Subrhetic {
  id: number;
  name: string;
  slug: string;
  description?: string;
  creator?: User | number;
  moderators?: User[] | number[];
  members?: User[] | number[];
  banned_users?: User[] | number[];
  posts?: Post[] | number[];
  is_private?: boolean;
  [key: string]: any;
}

export interface Vote {
  id: number;
  type: 'upvote' | 'downvote';
  user: User | number;
  post?: Post | number;
  comment?: Comment | number;
  [key: string]: any;
}

export interface VoteInfo {
  postId?: string | number;
  commentId?: string | number;
  userId: number;
  type: 'upvote' | 'downvote';
}