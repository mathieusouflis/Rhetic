import { ApiConfig } from "@/types/api";
import { ENV } from "@/config/constants";

export const API_CONFIG: ApiConfig = {
  baseURL: ENV.API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

export const DEFAULT_PAGINATION = {
  page: 1,
  pageSize: 25,
} as const;

export const API_VERSIONS = {
  V1: "v1",
} as const;

export const API_PATHS = {
  AUTH: "/auth",
  CUSTOM_AUTH: "/connect",
  VOTES: "/votes",
  USERS: "/users",
  ANONYMOUS_POST_AUTHOR: "/anonymous_post_authors",
  COMMENTS: "/comments",
  NOTIFICATION: "/notifications",
  POSTS: "/posts",
  POST_FLAIR: "/post-flairs",
  POST_FLAIR_ASSIGNMENT: "/post-flair-assignments",
  PRIVATE_MESSAGE: "/private-messages",
  REPORT: "/reports",
  SAVED_ITEM: "/saved-items",
  SAVED: "/saved",
  SUBRHETIC: "/subrhetics",
  SUBRHETIC_EMOJI: "/subrhetic-emojis",
  SUBRHETIC_EMOJI_REACTION: "/subrhetic-emoji-reactions",
  SUBRHETIC_RULE: "/subrhetic-rules",
  SUBRHETIC_TOPIC: "/subrhetic-topics",
  TOPIC: "/topics",
  USER_ACTIVITY_LOG: "/user-activity-logs",
  USER_BLOCK: "/user-blocks",
  USER_FLAIR: "/user-flairs",
  USER_FLAIR_ASSIGNMENT: "/user-flair-assignments",
  USER_PREFERENCE: "/user-preferences",
  UPLOAD_FILE: "/upload-file",
} as const;
