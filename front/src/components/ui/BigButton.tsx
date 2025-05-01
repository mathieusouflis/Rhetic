import { forwardRef } from "react";
import Icon, { IconName } from "./Icons";
import { Body } from "./Typography";

type ButtonVariant = "black" | "white";

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
  black: "bg-[#232323] border border-[#323232] text-white rounded-[10px]",
  white: "",
};

const sizeStyles: Record<ButtonSize, string> = {
  default: "",
};

const baseStyles =
  "flex flex-row justify-between items-center px-2.5 py-3 gap-2.5";

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
          {leftIcon && <Icon name={leftIconName} size={18} />}
          <Body>{children}</Body>
        </div>
        {rightIcon && <Icon name={rightIconName} size={18} />}
      </button>
    );
  }
);

BigButton.displayName = "BigButton";

export { BigButton };
