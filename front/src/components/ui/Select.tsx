import React, { useState, useRef, useEffect } from "react";
import Icon from "./Icons";
import { Body } from "./Typography";
import classNames from "classnames";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  className?: string;
}

export function Select({
  options,
  value,
  onChange,
  multiple = false,
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const values = Array.isArray(value) ? value : [];
      const newValue = values.includes(optionValue)
        ? values.filter((v) => v !== optionValue)
        : [...values, optionValue];
      onChange(newValue);
    } else {
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  const getDisplayValue = () => {
    if (multiple && Array.isArray(value)) {
      if (value.length === 0) return "Select options...";
      if (value.length === 1) {
        return options.find((opt) => opt.value === value[0])?.label;
      }
      return `${value.length} selected`;
    }
    return (
      options.find((opt) => opt.value === value)?.label || "Select option..."
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={classNames(
          "flex items-center justify-between gap-2",
          "min-w-[160px] px-3 py-2 rounded-md",
          "bg-[var(--black-800)] border border-[var(--black-600)]",
          "hover:border-[var(--black-500)] transition-colors",
          className
        )}
      >
        <Body className="text-[var(--black-100)]">{getDisplayValue()}</Body>
        <Icon name={isOpen ? "chevron_right" : "chevron_down"} size={18} />
      </button>

      {isOpen && (
        <div
          className={classNames(
            "absolute z-50 mt-1 w-full",
            "bg-[var(--black-800)] border border-[var(--black-600)]",
            "rounded-md shadow-lg overflow-hidden",
            "animate-in fade-in-0 zoom-in-95"
          )}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={classNames(
                "w-full px-3 py-2 text-left",
                "hover:bg-[var(--black-700)] transition-colors",
                "flex items-center justify-between gap-2",
                {
                  "bg-[var(--black-700)]": multiple
                    ? Array.isArray(value) && value.includes(option.value)
                    : value === option.value,
                }
              )}
            >
              <Body>{option.label}</Body>
              {multiple &&
                Array.isArray(value) &&
                value.includes(option.value) && (
                  <Icon name="apple" size={18} color="var(--yellow)" />
                )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
