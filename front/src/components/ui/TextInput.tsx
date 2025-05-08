import { forwardRef, useState } from "react";
import Icon, { IconName } from "./Icons";
import { Link } from "./Link";
import classNames from "classnames";
import { Body } from "./Typography";

type TextInputVariants = "black" | "fill";
export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: boolean;
  variant?: TextInputVariants;
  leftIconName?: IconName;
  linkText?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  label?: string;
}

const variantStyles: Record<TextInputVariants, string> = {
  black: "",
  fill: "border-[var(--black-500)] bg-[var(--black-700)] border rounded-[10px]",
};

const baseStyles =
  "flex flex-row items-center gap-2.5 w-full px-2.5 py-2 h-[42px]";

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      className = "",
      leftIcon = false,
      variant = "fill",
      leftIconName = "home",
      disabled = false,
      placeholder,
      linkText,
      error,
      hint,
      label,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const inputClasses = classNames(
      baseStyles,
      variantStyles[variant],
      className,
      {
        "border-[var(--yellow-border-transparent-active)] hover:border-[var(--yellow-border-transparent-active)]":
          isFocused && variant === "fill" && !disabled && !error,
        "hover:border-[var(--yellow-border-transparent-active)]":
          isHovered && variant === "fill" && !isFocused && !disabled && !error,
        "opacity-70 cursor-not-allowed": disabled,
        "border-[var(--red-border-transparent-active)]": error,
        "focus:border-[var(--red-border-transparent-active)]":
          error && isFocused,
      }
    );

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-sm mb-1 font-medium text-[var(--black-100)]">
            {label}
          </label>
        )}

        <div
          className={inputClasses}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {leftIcon && (
            <Icon
              name={leftIconName}
              color={disabled ? "var(--black-300)" : "var(--yellow)"}
              size={18}
            />
          )}
          <input
            ref={ref}
            className={classNames(
              "w-full outline-none bg-transparent placeholder:text-[var(--black-300)]",
              {
                "text-[14px]": variant === "fill",
                "text-[16px]": variant === "black",
                "cursor-not-allowed": disabled,
                "text-[var(--black-400)]": disabled,
                "text-[var(--black-100)]": !disabled,
              }
            )}
            disabled={disabled}
            placeholder={placeholder ? placeholder : "Enter text..."}
            {...props}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>

        {(error || hint || linkText) && (
          <div className="mt-1 flex items-center justify-between">
            {error ? (
              <Body className="text-[var(--red-border-transparent-active)]">
                {error}
              </Body>
            ) : hint ? (
              <Body className="text-[var(--black-300)]">{hint}</Body>
            ) : null}

            {linkText && (
              <Link href={"#"} className="text-[var(--black-100)] text-sm">
                {linkText}
              </Link>
            )}
          </div>
        )}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";

export { TextInput };
