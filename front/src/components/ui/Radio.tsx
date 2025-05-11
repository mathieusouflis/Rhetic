import React from "react";
import classNames from "classnames";

interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export function Radio({ checked, className, onChange }: RadioProps) {
  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    onChange?.(!checked);
  };

  return (
    <div
      role="radio"
      aria-checked={checked}
      onClick={handleClick}
      className={classNames(
        "w-4 h-4 rounded-full border-2",
        "flex items-center justify-center transition-colors cursor-pointer",
        checked
          ? "border-[var(--yellow)] bg-[var(--yellow)]"
          : "border-[var(--black-300)] group-hover:border-[var(--yellow)]",
        className
      )}
    >
      {checked && <div className="w-2 h-2 rounded-full bg-black" />}
    </div>
  );
}
