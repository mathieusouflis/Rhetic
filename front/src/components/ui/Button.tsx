import classNames from "classnames";
import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "text";
  size?: "xs" | "sm" | "md" | "lg";
  leftIcon?: string;
  rightIcon?: string;
  iconClassName?: string;
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  iconClassName = "",
  fullWidth = false,
  isLoading = false,
  disabled,
  ...props
}) => {
  const variantClasses = {
    primary:
      "bg-[var(--blue-500)] hover:bg-[var(--blue-400)] text-white active:bg-[var(--blue-600)]",
    secondary:
      "bg-[var(--black-600)] hover:bg-[var(--black-500)] text-white active:bg-[var(--black-700)]",
    danger:
      "bg-[var(--red-500)] hover:bg-[var(--red-400)] text-white active:bg-[var(--red-600)]",
    ghost:
      "bg-transparent hover:bg-[var(--black-700)] text-[var(--black-200)] active:bg-[var(--black-600)]",
    text: "bg-transparent hover:bg-transparent text-[var(--blue-400)] hover:text-[var(--blue-300)] active:text-[var(--blue-500)]",
  };

  const sizeClasses = {
    xs: "text-xs py-1 px-2 rounded",
    sm: "text-sm py-1.5 px-3 rounded-md",
    md: "text-base py-2 px-4 rounded-md",
    lg: "text-lg py-2.5 px-5 rounded-md",
  };

  const disabledClasses = "opacity-50 cursor-not-allowed pointer-events-none";

  const renderIcon = (icon: string) => {
    switch (icon) {
      case "spinner":
        return (
          <svg
            className={classNames("w-4 h-4", iconClassName)}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        );
      case "refresh":
        return (
          <svg
            className={classNames("w-4 h-4", iconClassName)}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <button
      className={classNames(
        "flex items-center justify-center gap-2 font-medium transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? "w-full" : "",
        (disabled || isLoading) && disabledClasses,
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <span className="animate-spin mr-2">◌</span>}
      {leftIcon && !isLoading && renderIcon(leftIcon)}
      {children}
      {rightIcon && !isLoading && renderIcon(rightIcon)}
    </button>
  );
};
