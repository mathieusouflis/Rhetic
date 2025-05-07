import { forwardRef } from "react";
import classNames from "classnames";

type SwitchVariant = "default" | "danger";

interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "checked"> {
  variant?: SwitchVariant;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

const trackStyles = {
  default: {
    inactive: "bg-[var(--black-600)] border-[var(--black-400)]",
    active:
      "bg-[var(--yellow-bg-transparent-active)] border-[var(--yellow-border-transparent-active)]",
  },
  danger: {
    inactive: "bg-[var(--black-600)] border-[var(--black-400)]",
    active:
      "bg-[var(--red-bg-transparent-active)] border-[var(--red-border-transparent-active)]",
  },
  disabled: {
    inactive: "bg-[var(--black-600)] border-[var(--black-400)]",
    active: "bg-[var(--black-600)] border-[var(--black-400)]",
  },
};

const thumbStyles = {
  default: {
    inactive: "bg-[var(--black-100)]",
    active: "bg-[var(--yellow-border-transparent-active)]",
  },
  danger: {
    inactive: "bg-[var(--red)]",
    active: "bg-[var(--red-border-transparent-active)]",
  },
  disabled: {
    inactive: "bg-[var(--black-400)]",
    active: "bg-[var(--black-400)]",
  },
};

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      className,
      variant = "default",
      checked = false,
      disabled = false,
      onCheckedChange,
      ...props
    },
    ref
  ) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      onCheckedChange?.(event.target.checked);
    };

    return (
      <label
        className={classNames(
          "relative inline-flex items-center",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          className
        )}
      >
        <input
          type="checkbox"
          className="sr-only"
          ref={ref}
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
          {...props}
        />
        <div
          className={classNames(
            "relative rounded-[8px] border p-[5px]",
            "transition-all duration-200 ease-in-out",
            disabled
              ? trackStyles.disabled[checked ? "active" : "inactive"]
              : trackStyles[variant][checked ? "active" : "inactive"],
            "w-[52px] h-[27px]"
          )}
        >
          <div
            className={classNames(
              "relative rounded-[4px]",
              "h-full aspect-square",
              "transition-all duration-200 ease-in-out",
              checked ? "translate-x-[27px]" : "translate-x-0",
              disabled
                ? thumbStyles.disabled[checked ? "active" : "inactive"]
                : thumbStyles[variant][checked ? "active" : "inactive"]
            )}
          />
        </div>
      </label>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
