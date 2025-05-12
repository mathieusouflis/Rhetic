import { forwardRef } from "react";
import Icon, { IconName } from "./Icons";
import { Body } from "./Typography";
import classNames from "classnames";

type ButtonVariant = "black" | "white" | "conic";

type ButtonSize = "default";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: boolean;
  leftIconName?: IconName;
  rightIcon?: boolean;
  rightIconName?: IconName;
}

const variantStyles: Record<ButtonVariant, string> = {
  black:
    "bg-[#232323] border border-[var(--black-400)] text-white rounded-[10px] px-2.5 py-3",
  white:
    "bg-[var(--white)] border border-transparent text-black rounded-[10px] px-2.5 py-3",
  conic:
    "border-t border-b border-[var(--black-500)] px-2.5 py-[21px] hover:bg-[var(--black-700)]",
};

const iconStyles: Record<ButtonVariant, string> = {
  black: "var(--white)",
  white: "var(--black-800)",
  conic: "var(--white)",
};

const sizeStyles: Record<ButtonSize, string> = {
  default: "",
};

const baseStyles = "flex flex-row items-center gap-2.5";

const BigButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "black",
      size = "default",
      leftIcon = false,
      leftIconName = "home",
      rightIcon = false,
      rightIconName = "home",
      isLoading = false,
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const buttonClasses = classNames(
      baseStyles,
      {
        "justify-center": !rightIcon,
        "justify-between": rightIcon,
      },
      variantStyles[variant],
      sizeStyles[size],
      className
    );

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
        {rightIcon && (
          <Icon name={rightIconName} color={iconStyles[variant]} size={18} />
        )}
      </button>
    );
  }
);

BigButton.displayName = "BigButton";

export { BigButton };
