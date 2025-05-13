import React from "react";
import classNames from "classnames";
import { Body } from "./Typography";

interface TinyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function TinyButton({
  isActive = false,
  children,
  className,
  ...props
}: TinyButtonProps) {
  return (
    <button
      className={classNames(
        "px-2 py-1.5 rounded-[6px] border transition-colors h-fit w-max",
        isActive
          ? "bg-[var(--black-600)] border-[var(--black-400)] text-white"
          : "bg-[var(--black-700)] border-[var(--black-500)] text-[var(--black-100)]",
        className
      )}
      {...props}
    >
      <Body className="w-max">{children}</Body>
    </button>
  );
}
