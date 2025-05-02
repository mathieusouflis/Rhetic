import { useState } from "react";
import Icon, { IconName } from "./Icons";
import { Body } from "./Typography";
import classNames from "classnames";

interface LittleActionProps {
  onClick: () => void;
  children?: React.ReactNode;
  className?: string;
  iconName?: IconName;
}

const LittleAction: React.FC<LittleActionProps> = ({
  onClick,
  children,
  className = "",
  iconName = "comment",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      className={classNames(
        "flex flex-row gap-1 px-2 py-2 rounded-[6px] justify-center items-center border border-transparent hover:bg-[var(--blue-bg-transparent)] hover:border hover:border-[var(--blue-border-transparent)]",
        className,
        {
          "text-[var(--white)]": !isHovered,
          "text-[var(--blue)]": isHovered,
        }
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon
        name={iconName}
        size={18}
        color={isHovered ? "var(--blue)" : "var(--white)"}
      />
      {children && <Body>{children}</Body>}
    </button>
  );
};

export default LittleAction;
