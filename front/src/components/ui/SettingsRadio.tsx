import React from "react";
import { Body, Small } from "./Typography";
import classNames from "classnames";
import { Radio } from "./Radio";

interface SettingsRadioProps {
  label: string;
  description?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export const SettingsRadio: React.FC<SettingsRadioProps> = ({
  label,
  description,
  checked = false,
  onChange,
  className = "",
}) => {
  return (
    <button
      className={classNames(
        "flex flex-row justify-between items-center w-full py-2.5 px-2.5",
        className
      )}
      onClick={() => onChange?.(!checked)}
    >
      <div className="flex flex-col gap-0">
        <Body>{label}</Body>
        {description && (
          <Small className="text-[var(--black-200)]">{description}</Small>
        )}
      </div>
      <Radio checked={checked} />
    </button>
  );
};
