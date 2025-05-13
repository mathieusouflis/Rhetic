import { useState } from "react";
import Icon, { IconName } from "./Icons";
import { Body } from "./Typography";
import classNames from "classnames";

interface LittleActionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
  iconName?: IconName;
  full?: boolean;
  color?: ActionColors;
}

type ActionColors = "blue" | "yellow" | "white" | "red";

const ACTION_COLORS_CLASSES: Record<ActionColors, string> = {
  blue: "hover:text-[var(--blue)] hover:bg-[var(--blue-bg-transparent)]",
  yellow: "hover:text-[var(--yellow)] hover:bg-[var(--yellow-bg-transparent)]",
  white: "hover:text-[var(--white)] hover:bg-[var(--white-bg-transparent)]",
  red: "hover:text-[var(--red)] hover:bg-[var(--red-bg-transparent)] ",
};

const ICON_COLORS_CLASSES: Record<ActionColors, string> = {
  blue: "var(--blue)",
  yellow: "var(--yellow)",
  white: "var(--white)",
  red: "var(--red)",
};

const LittleAction: React.FC<LittleActionProps> = ({
  children,
  className = "",
  iconName = "comment",
  full = false,
  color = "blue",
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className={classNames(
        "flex flex-row gap-1 px-2 py-2 rounded-[6px] justify-center items-center",
        ACTION_COLORS_CLASSES[color],
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <Icon
        name={iconName}
        size={18}
        full={full}
        color={isHovered || full ? ICON_COLORS_CLASSES[color] : "var(--white)"}
      />
      {children && <Body>{children}</Body>}
    </button>
  );
};

export default LittleAction;
