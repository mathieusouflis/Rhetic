import React from "react";
import Icon from "./Icons";
import { Body, Small } from "./Typography";
import classNames from "classnames";
import { Select } from "./Select";
import { Radio } from "./Radio";
import { Switch } from "./Switch";
import Shortcut from "./Shortcut";

interface BaseSettingsItemProps {
  label: string;
  description?: string;
  className?: string;
}

interface SettingsButtonProps extends BaseSettingsItemProps {
  onClick?: () => void;
  value?: string;
  rightIcon?: boolean;
  variant?: "default" | "danger";
}

interface SettingsTextProps extends BaseSettingsItemProps {
  value: string;
}

interface SettingsShortcutProps extends BaseSettingsItemProps {
  label: string;
  description?: string;
  value: string;
}

interface SettingsRadioOption {
  label: string;
  value: string;
}

interface SettingsRadioProps extends BaseSettingsItemProps {
  options: SettingsRadioOption[];
  value: string;
  onChange: (value: string) => void;
}

interface SettingsCheckboxProps extends BaseSettingsItemProps {
  options: SettingsRadioOption[];
  value: string[];
  onChange: (value: string[]) => void;
}

interface SettingsSwitchProps extends BaseSettingsItemProps {
  onChange: (checked: boolean) => void;
  checked?: boolean;
  disabled?: boolean;
  variant?: "default" | "danger";
}

const baseStyles = `
  flex flex-row items-center justify-between
  w-full p-4 rounded-md
  hover:bg-[var(--black-700)]
  border border-transparent
  transition-colors
`;

export function SettingsButton({
  label,
  value,
  onClick = () => {},
  rightIcon = true,
  description,
  className,
  variant = "default",
  ...props
}: SettingsButtonProps) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        baseStyles,
        variant === "danger" && "hover:bg-red-900/20 text-red-500",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-1">
        <Body>{label}</Body>
        {description && (
          <Small
            className={classNames(
              "text-[var(--black-300)]",
              variant === "danger" && "text-red-400"
            )}
          >
            {description}
          </Small>
        )}
      </div>
      <div className="flex items-center gap-2">
        {value && <Body>{value}</Body>}
        {rightIcon && (
          <Icon
            name="chevron_right"
            size={20}
            className={variant === "danger" ? "text-red-500" : ""}
          />
        )}
      </div>
    </button>
  );
}

export function SettingsText({
  label,
  value,
  description,
  className,
}: SettingsTextProps) {
  return (
    <div className={classNames(baseStyles, className)}>
      <div className="flex flex-col gap-1">
        <Body>{label}</Body>
        {description && (
          <Small className="text-[var(--black-300)]">{description}</Small>
        )}
      </div>
      <Body className="text-[var(--black-300)]">{value}</Body>
    </div>
  );
}

export function SettingsShortcut({
  label,
  description,
  value,
  className,
}: SettingsShortcutProps) {
  return (
    <div className={classNames(baseStyles, className)}>
      <div className="flex flex-col gap-1">
        <Body>{label}</Body>
        {description && (
          <Small className="text-[var(--black-300)]">{description}</Small>
        )}
      </div>
      <Shortcut>{value}</Shortcut>
    </div>
  );
}

export function SettingsSwitch({
  label,
  description,
  className,
  onChange,
  checked = false,
  disabled = false,
  variant = "default",
}: SettingsSwitchProps) {
  return (
    <div className={classNames(baseStyles, className)}>
      <div className="flex flex-col gap-1">
        <Body>{label}</Body>
        {description && (
          <Small className="text-[var(--black-300)]">{description}</Small>
        )}
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        variant={variant}
        aria-label={`Toggle ${label}`}
      />
    </div>
  );
}

export const SettingsRadio: React.FC<{
  label: string;
  description?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}> = ({ label, description, checked = false, onChange }) => {
  return (
    <div
      className="p-4 flex justify-between items-center gap-4 bg-[var(--black-700)] border border-[var(--black-500)] rounded-[10px] cursor-pointer"
      onClick={() => onChange?.(!checked)}
    >
      <div className="flex flex-col gap-1">
        <Body>{label}</Body>
        {description && (
          <Small className="text-[var(--black-100)]">{description}</Small>
        )}
      </div>
      <Radio checked={checked} />
    </div>
  );
};
