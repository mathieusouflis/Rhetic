import React from "react";
import { Small } from "./Typography";
import Icon from "./Icons";

type ShortcutStatus = "default" | "background";

interface ShortcutProps {
  status?: ShortcutStatus;
  children: React.ReactNode;
}

const variantStyles: Record<ShortcutStatus, string> = {
  default: "",
  background:
    "px-1.5 py-1 bg-[var(--black-700)] border border-[var(--black-500)] rounded-[6px]",
};

const baseStyles =
  "flex flex-row gap-1 items-center w-fit justify-center uppercase";

const Shortcut: React.FC<ShortcutProps> = ({
  status = "default",
  children,
}) => {
  const shortcutClasses = [baseStyles, variantStyles[status]].join(" ");
  return (
    <div className={shortcutClasses}>
      <Icon name="command" size={14} />
      <Small>{children}</Small>
    </div>
  );
};

Shortcut.displayName = "Shortcut";

export default Shortcut;
