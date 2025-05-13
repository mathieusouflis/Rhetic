"use client";

import React, { forwardRef, TextareaHTMLAttributes, useState } from "react";
import { Body } from "./Typography";
import classNames from "classnames";
import { Link } from "./Link";

type TextareaVariants = "black" | "fill";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  counter?: boolean;
  variant?: TextareaVariants;
  linkText?: string;
}

const variantStyles: Record<TextareaVariants, string> = {
  black: "",
  fill: "border-[var(--black-500)] bg-[var(--black-700)] border rounded-[10px]",
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hint,
      className = "",
      counter = false,
      maxLength,
      disabled = false,
      variant = "fill",
      linkText,
      ...props
    },
    ref
  ) => {
    const value = (props.value as string) || "";
    const [isFocused, setIsFocused] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const textareaClasses = classNames(
      "w-full px-2.5 py-2 outline-none transition-colors resize-vertical",
      variantStyles[variant],
      {
        "min-h-[42px]": !props.rows,
        "border-[var(--yellow-border-transparent-active)] hover:border-[var(--yellow-border-transparent-active)]":
          isFocused && variant === "fill" && !disabled && !error,
        "hover:border-[var(--yellow-border-transparent-active)]":
          isHovered && variant === "fill" && !isFocused && !disabled && !error,
        "opacity-70 cursor-not-allowed": disabled,
        "border-[var(--red-border-transparent-active)]": error,
        "focus:border-[var(--red-border-transparent-active)]":
          error && isFocused,
      },
      className
    );

    return (
      <div className="flex flex-col w-full gap-1">
        {label && (
          <label className="text-sm mb-1 font-medium text-[var(--black-100)]">
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          className={classNames(textareaClasses, "bg-transparent", {
            "text-[14px]": variant === "fill",
            "text-[16px]": variant === "black",
            "cursor-not-allowed": disabled,
            "text-[var(--black-400)]": disabled,
            "text-[var(--black-100)]": !disabled,
            "placeholder:text-[var(--black-300)]": true,
          })}
          disabled={disabled}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          {...props}
        />

        <div className="flex justify-between mt-1">
          <div className="flex-grow">
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

          {counter && maxLength && (
            <Body
              className={classNames("ml-auto", {
                "text-[var(--red-border-transparent-active)]":
                  value.length > maxLength * 0.9,
                "text-[var(--black-300)]": value.length <= maxLength * 0.9,
                "opacity-70": disabled,
              })}
            >
              {value.length}/{maxLength}
            </Body>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
