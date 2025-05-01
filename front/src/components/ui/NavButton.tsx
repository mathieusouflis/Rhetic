import { forwardRef } from "react";
import Icon, { IconName } from "./Icons";
import { Body } from "./Typography";
import Shortcut from "./Shortcut";
import Notification from "./Notification";

type ButtonVariant = "black" | "hover" | "selected";

type ButtonSize = "default";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: boolean;
  leftIconName?: IconName;
  command?: boolean;
  commandName?: string;
  notification?: boolean;
  notificationNumber?: number;
}

const variantStyles: Record<ButtonVariant, string> = {
  black: "text-[var(--black-200)]",
  hover:
    "bg-[var(--black-700)] border border-[var(--black-500)] text-[var(--black-200)] ",
  selected:
    "bg-[var(--black-600)] border border-[var(--black-400)] text-[var(--white)]",
};

const iconStyles: Record<ButtonVariant, string> = {
  black: "var(--black-200)",
  hover: "var(--black-200)",
  selected: "var(--white)",
};

const sizeStyles: Record<ButtonSize, string> = {
  default: "",
};

const baseStyles =
  "flex flex-row justify-between items-center px-2.5 py-2 gap-2.5 rounded-[10px]";

const NavButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "black",
      size = "default",
      leftIcon = true,
      leftIconName = "home",
      command = false,
      commandName = "k",
      notification = false,
      notificationNumber = 0,
      isLoading = false,
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const buttonClasses = [
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      className,
    ].join(" ");

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={buttonClasses}
        {...props}
      >
        <div className="flex flex-row gap-2.5">
          {leftIcon && (
            <Icon name={leftIconName} color={iconStyles[variant]} size={18} />
          )}
          <Body>{children}</Body>
        </div>
        <div>
          {command && <Shortcut>{commandName}</Shortcut>}
          {notification && <Notification>{notificationNumber}</Notification>}
        </div>
      </button>
    );
  }
);

NavButton.displayName = "NavButton";

export { NavButton };
