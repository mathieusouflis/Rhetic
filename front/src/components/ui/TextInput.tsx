import { forwardRef, useState } from "react";
import Icon, { IconName } from "./Icons";
import { Link } from "./Link";
import classNames from "classnames";

export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: boolean;
  leftIconName?: IconName;
  linkText?: string;
  placeholder?: string;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      className = "",
      leftIcon = false,
      leftIconName = "home",
      disabled = false,
      placeholder,
      linkText,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="flex flex-col gap-1">
        <div
          className={classNames(
            "flex flex-row items-center border-[var(--black-500)] bg-[var(--black-700)] gap-2.5 w-full border rounded-[10px] px-2.5 py-2",
            {
              "border-[var(--yellow-border-transparent-active)]": isFocused,
            }
          )}
        >
          {leftIcon && (
            <Icon name={leftIconName} color="var(--yellow)" size={18} />
          )}
          <input
            ref={ref}
            className="w-full text-[14px] outline-none bg-transparent placeholder:text-[var(--black-100)]"
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
