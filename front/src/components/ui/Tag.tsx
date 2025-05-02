import React from "react";
import Icon, { IconName } from "./Icons";
import { Tiny } from "./Typography";

type TagName = "king" | "dev" | "mod";
type TagVariant = "default" | "icon";

interface TagProps {
  name: TagName;
  variant?: TagVariant;
}

const iconsNames: Record<TagName, IconName> = {
  king: "crown",
  dev: "code",
  mod: "shield",
};

const Tag: React.FC<TagProps> = ({ name, variant = "default", ...props }) => {
  return (
    <div className="flex flex-row gap-1 items-center w-fit justify-center uppercase text-[var(--white)] bg-[var(--yellow-bg-transparent)] border border-[var(--yellow-border-transparent)] rounded-[4px] px-1.5 py-1">
      <Icon name={iconsNames[name]} size={12} color="var(--white)" />
      {variant === "default" && <Tiny className="font-bold">{name}</Tiny>}
    </div>
  );
};

export default Tag;
