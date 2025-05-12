import React from "react";
import classNames from "classnames";

interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

export function Radio({ checked, disabled, className, onChange }: RadioProps) {
  const handleClick = (event: React.MouseEvent) => {
    if (disabled) return;
    event.preventDefault();
    onChange?.(!checked);
  };

  return (
    <div
      role="radio"
      aria-checked={checked}
      aria-disabled={disabled}
      onClick={handleClick}
      className={classNames(
        "w-4 h-4 rounded-full border-2",
        "flex items-center justify-center transition-colors",
        {
          "cursor-pointer": !disabled,
          "cursor-not-allowed border-[var(--black-400)]": disabled,
          "border-[var(--yellow)] bg-[var(--yellow)]": checked,
          "border-[var(--black-300)]": !checked && !disabled,
          "border-[var(--black-300)] group-hover:border-[var(--yellow)]":
            !checked && !disabled,
        },
        className
      )}
    >
      {checked && <div className="w-2 h-2 rounded-full bg-black" />}
    </div>
  );
}
