import { forwardRef } from "react";
import Icon, { IconName } from "./Icons";
import { Body } from "./Typography";

type ButtonVariant = "black" | "gray" | "gray2" | "white";

type ButtonStyle = "bold" | "normal";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  styleText?: ButtonStyle;
  isLoading?: boolean;
  leftIcon?: boolean;
  leftIconName?: IconName;
}

const textStyles: Record<ButtonStyle, string> = {
  bold: "font-bold",
  normal: "font-normal",
};

const variantStyles: Record<ButtonVariant, string> = {
  black: "",
  gray: "border-[var(--500)] bg-[var(--black-700)]",
  gray2: "bg-[var(--black-600)]",
  white: "border-[var(--white)] bg-[var(--white)] text-[var(--black-800)]",
};

const baseStyles =
  "flex flex-row items-center justify-center px-4 py-2 gap-2.5 border border-[var(--black-400)] rounded-[10px]";

const ActionButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "black",
      styleText = "normal",
      leftIcon = true,
      leftIconName = "home",
      isLoading = false,
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const buttonClasses = [baseStyles, variantStyles[variant], className].join(
      " "
    );

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={buttonClasses}
        {...props}
      >
        <div className="flex flex-row items-center gap-2.5">
          {leftIcon && <Icon name={leftIconName} size={18} />}
          {children && (
            <Body className={textStyles[styleText]}>{children}</Body>
          )}
        </div>
      </button>
    );
  }
);

ActionButton.displayName = "ActionButton";

export { ActionButton };
