import { IconName } from "@/components/ui/Icons";

export type NavItem = {
  label: string;
  path: string;
  icon: IconName;
  isDisabled?: boolean;
};

export type SidebarSection = {
  title: string;
  items: NavItem[];
};

export type SidebarItems = (NavItem | SidebarSection)[];
