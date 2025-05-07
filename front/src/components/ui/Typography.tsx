import React from "react";

const baseStyle = "";

const typoStyles = {
  display: baseStyle + " text-[36px]",
  h1: baseStyle + " text-[20px] font-bold",
  h2: baseStyle + " text-[16px] font-semibold",
  big_body: baseStyle + " text-[16px]",
  body: baseStyle + " text-[14px]",
  small: baseStyle + " text-[13px]",
  tiny: baseStyle + " text-[11px]",
};

interface BaseTypographyProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
}

export const Display: React.FC<BaseTypographyProps> = ({
  children,
  className = "",
  ...props
}) => (
  <h1 className={`${typoStyles.display} ${className}`} {...props}>
    {children}
  </h1>
);

export const H1: React.FC<BaseTypographyProps> = ({
  children,
  className = "",
  ...props
}) => (
  <h1 className={`${typoStyles.h1} ${className}`} {...props}>
    {children}
  </h1>
);

export const H2: React.FC<BaseTypographyProps> = ({
  children,
  className = "",
  ...props
}) => (
  <h2 className={`${typoStyles.h2} ${className}`} {...props}>
    {children}
  </h2>
);

export const BigBody: React.FC<BaseTypographyProps> = ({
  children,
  className = "",
  ...props
}) => (
  <p className={`${typoStyles.big_body} ${className}`} {...props}>
    {children}
  </p>
);

export const Body: React.FC<BaseTypographyProps> = ({
  children,
  className = "",
  ...props
}) => (
  <p className={`${typoStyles.body} ${className}`} {...props}>
    {children}
  </p>
);

export const Small: React.FC<BaseTypographyProps> = ({
  children,
  className = "",
  ...props
}) => (
  <p className={`${typoStyles.small} ${className}`} {...props}>
    {children}
  </p>
);

export const Tiny: React.FC<BaseTypographyProps> = ({
  children,
  className = "",
  ...props
}) => (
  <p className={`${typoStyles.tiny} ${className}`} {...props}>
    {children}
  </p>
);
