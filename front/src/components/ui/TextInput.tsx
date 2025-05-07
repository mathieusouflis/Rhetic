import { forwardRef, useState } from "react";
import Icon, { IconName } from "./Icons";
import { Link } from "./Link";
import classNames from "classnames";

type TextInputVariants = "black" | "fill";
export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: boolean;
  variant?: TextInputVariants;
  leftIconName?: IconName;
  linkText?: string;
  placeholder?: string;
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
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const inputClasses = classNames(
      baseStyles,
      variantStyles[variant],
      className,
      {
        "border-[var(--yellow-border-transparent-active)]":
          isFocused && variant === "fill",
      }
    );

    return (
      <div className="flex flex-col gap-1">
        <div className={inputClasses}>
          {leftIcon && (
            <Icon name={leftIconName} color="var(--yellow)" size={18} />
          )}
          <input
            ref={ref}
            className={classNames(
              "w-full outline-none bg-transparent placeholder:text-[var(--black-100)]",
              {
                "text-[14px]": variant === "fill",
                "text-[16px]": variant === "black",
              }
            )}
            disabled={disabled}
            placeholder={placeholder ? placeholder : "Enter text..."}
            {...props}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
        {linkText && (
          <Link href={"#"} className="text-[var(--black-100)]">
            {linkText}
          </Link>
        )}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";

export { TextInput };
