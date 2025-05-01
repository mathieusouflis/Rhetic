import { forwardRef, useState } from "react";
import Icon, { IconName } from "./Icons";
import { Link } from "./Link";

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
        <div className="flex flex-row items-center border-[var(--black-500)] focus:border-[var(--yellow-border-transparent-active)] focus:bg-[var(--yellow-bg-transparent-active)] bg-[var(--black-700)] gap-2.5 w-full border rounded-[10px] px-2.5 py-2">
          {leftIcon && (
            <Icon name={leftIconName} color="var(--yellow)" size={18} />
          )}
          <input
            ref={ref}
            className="w-full outline-none bg-transparent placeholder:text-[var(--black-100)]"
            disabled={disabled}
            placeholder={placeholder ? placeholder : "Enter text..."}
            {...props}
          />
        </div>
        {linkText && <Link href={"#"}>{linkText}</Link>}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";

export { TextInput };
