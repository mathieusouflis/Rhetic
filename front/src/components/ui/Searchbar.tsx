import { forwardRef, useState } from "react";
import classNames from "classnames";
import Icon from "./Icons";
import Shortcut from "./Shortcut";

type SearchBarSize = "tiny" | "big";

export interface SearchBarProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  searchSize?: SearchBarSize;
  placeholder?: string;
}

const sizeStyles: Record<SearchBarSize, string> = {
  big: "py-1.5 min-h-[38px]",
  tiny: "py-2",
};

const baseStyles =
  "flex flex-row justify-between pl-2.5 pr-1.5 gap-2.5 items-center w-full bg-[var(--black-700)] border border-[var(--black-500)] rounded-[10px]";

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      className = "",
      searchSize = "big",
      placeholder = "Search on Rhetic",
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const inputClasses = classNames(
      baseStyles,
      sizeStyles[searchSize],
      className,
      {
        "border-[var(--white-border-transparent-active)]": isFocused,
      }
    );

    return (
      <div className={inputClasses}>
        <div className="flex felx-row gap-2.5 w-full items-center">
          <Icon
            name="search"
            color={isFocused ? "var(--white)" : "var(--black-100)"}
            size={18}
          />
          <input
            ref={ref}
            type="text"
            className="w-full text-[14px] text-[var(--white)] outline-none bg-transparent placeholder:text-[var(--black-100)]"
            placeholder={placeholder}
            {...props}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
        {searchSize === "big" && <Shortcut status="background">K</Shortcut>}
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";

export { SearchBar };
