import { NavItem, SidebarSection } from "@/components/layout/Sidebar/types";
import { ROUTES } from "./constants";

export const MAIN_NAV_ITEMS: NavItem[] = [
  { label: "Home", path: ROUTES.HOME.path, icon: "home" },
  { label: "Popular", path: ROUTES.POPULAR.path, icon: "flame" },
  { label: "Explore", path: ROUTES.EXPLORE.path, icon: "search" },
  {
    label: "Notifications",
    path: ROUTES.USER.NOTIFICATIONS.path,
    icon: "bell",
  },
  { label: "Messages", path: ROUTES.USER.MESSAGES.path, icon: "mail" },
  { label: "Saved", path: ROUTES.USER.SAVED.path, icon: "bookmark" },
  { label: "Profile", path: ROUTES.USER.PROFILE.path, icon: "user" },
  { label: "Settings", path: ROUTES.SETTINGS.ACCOUNT.path, icon: "settings" },
];

export const SETTINGS_NAV_ITEMS: SidebarSection[] = [
  {
    title: "Account",
    items: [
      {
        label: "Account Settings",
        path: ROUTES.SETTINGS.ACCOUNT.path,
        icon: "user",
      },
      {
        label: "My Profile",
        path: ROUTES.SETTINGS.PROFILE.path,
        icon: "user_edit",
      },
      {
        label: "Notifications",
        path: ROUTES.SETTINGS.NOTIFICATIONS.path,
        icon: "bell",
      },
      {
        label: "Keyboard Shortcuts",
        path: ROUTES.SETTINGS.SHORTCUTS.path,
        icon: "command",
      },
    ],
  },
  {
    title: "General",
    items: [
      {
        label: "General",
        path: ROUTES.SETTINGS.GENERAL.path,
        icon: "asterisk",
      },
      {
        label: "Language",
        path: ROUTES.SETTINGS.LANGUAGE.path,
        icon: "languages",
      },
    ],
  },
];
