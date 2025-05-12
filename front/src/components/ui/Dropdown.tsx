import {
  forwardRef,
  useState,
  useRef,
  useEffect,
  ReactNode,
  ChangeEvent,
} from "react";
import classNames from "classnames";
import Icon from "./Icons";
import { Body } from "./Typography";

type DropdownOption = {
  label: string;
  value: string;
};

type DropdownProps = {
  children: ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  className?: string;
  disabled?: boolean;
};

type DropdownTriggerProps = {
  children: ReactNode;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  isOpen?: boolean;
};

type DropdownContentProps = {
  children: ReactNode;
  className?: string;
};

type DropdownItemProps = {
  children: ReactNode;
  onClick: () => void;
  className?: string;
  isSelected?: boolean;
};

type DropdownSelectProps = {
  options: DropdownOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  searchable?: boolean;
  name?: string;
  required?: boolean;
  id?: string;
};

const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  (
    { children, isOpen, setIsOpen, className = "", disabled = false, ...props },
    ref
  ) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [setIsOpen]);

    return (
      <div
        ref={mergeRefs(ref, dropdownRef)}
        className={classNames("relative w-full", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const DropdownTrigger = forwardRef<HTMLDivElement, DropdownTriggerProps>(
  (
    {
      children,
      onClick,
      className = "",
      disabled = false,
      isOpen = false,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        onClick={disabled ? undefined : onClick}
        className={classNames(
          "flex flex-row justify-between items-center px-2.5 py-2 gap-2.5 w-full",
          "bg-[var(--black-700)] border border-[var(--black-500)] rounded-[10px] cursor-pointer",
          {
            "opacity-60 cursor-not-allowed": disabled,
            "border-[var(--white-border-transparent-active)]":
              isOpen && !disabled,
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const DropdownContent = forwardRef<HTMLDivElement, DropdownContentProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={classNames(
          "absolute z-10 w-full mt-1 bg-[var(--black-700)] border border-[var(--black-500)] rounded-[10px] overflow-hidden shadow-lg",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const DropdownItem = forwardRef<HTMLDivElement, DropdownItemProps>(
  (
    { children, onClick, className = "", isSelected = false, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={classNames(
          "px-2.5 py-2 cursor-pointer hover:bg-[var(--black-600)]",
          { "bg-[var(--black-600)]": isSelected },
          className
        )}
        onClick={onClick}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const DropdownSelect = forwardRef<HTMLDivElement, DropdownSelectProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = "Select an option",
      className = "",
      disabled = false,
      searchable = false,
      name,
      required,
      id,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const selectedOption = options.find((option) => option.value === value);
    const inputRef = useRef<HTMLInputElement>(null);
    const selectRef = useRef<HTMLSelectElement>(null);

    const toggleDropdown = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
        if (!isOpen && searchable) {
          setTimeout(() => {
            inputRef.current?.focus();
          }, 0);
        }
      }
    };

    const handleSelect = (option: DropdownOption) => {
      onChange(option.value);
      setIsOpen(false);
      setSearchTerm("");

      if (selectRef.current) {
        selectRef.current.value = option.value;
        const event = new Event("change", { bubbles: true });
        selectRef.current.dispatchEvent(event);
      }
    };

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    };

    const filteredOptions =
      searchable && searchTerm
        ? options.filter((option) =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : options;

    return (
      <div className="relative">
        <select
          ref={selectRef}
          name={name}
          value={value}
          required={required}
          id={id}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <Dropdown
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          className={className}
          disabled={disabled}
          ref={ref}
          {...props}
        >
          <DropdownTrigger
            onClick={toggleDropdown}
            disabled={disabled}
            isOpen={isOpen}
          >
            <Body className="text-[var(--white)]">
              {selectedOption ? selectedOption.label : placeholder}
            </Body>
            <Icon
              name="chevron_down"
              size={18}
              color="var(--black-200)"
              className={classNames({
                "transform rotate-180 transition-transform": isOpen,
              })}
            />
          </DropdownTrigger>

          {isOpen && (
            <DropdownContent>
              {searchable && (
                <div className="p-2 border-b border-[var(--black-500)]">
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search..."
                    className="w-full px-2 py-1 bg-[var(--black-600)] border border-[var(--black-500)] rounded-md text-[var(--white)] outline-none"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <DropdownItem
                    key={option.value}
                    onClick={() => handleSelect(option)}
                    isSelected={option.value === value}
                  >
                    <Body>{option.label}</Body>
                  </DropdownItem>
                ))
              ) : (
                <div className="px-2.5 py-2 text-[var(--black-200)]">
                  No results found
                </div>
              )}
            </DropdownContent>
          )}
        </Dropdown>
      </div>
    );
  }
);

const mergeRefs = <T extends any>(
  ...refs: Array<React.RefObject<T> | React.ForwardedRef<T> | null | undefined>
) => {
  return (element: T): void => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === "function") {
        ref(element);
      } else {
        (ref as React.MutableRefObject<T>).current = element;
      }
    });
  };
};

Dropdown.displayName = "Dropdown";
DropdownTrigger.displayName = "DropdownTrigger";
DropdownContent.displayName = "DropdownContent";
DropdownItem.displayName = "DropdownItem";
DropdownSelect.displayName = "DropdownSelect";

export {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSelect,
};
