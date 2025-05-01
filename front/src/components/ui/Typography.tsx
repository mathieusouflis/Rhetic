import React from "react";

const baseStyle = "tracking-tighter";

const typoStyles = {
  display: baseStyle + " text-[36px]",
  h1: baseStyle + " text-[20px]",
  h2: baseStyle + " text-[16px]",
  big_body: baseStyle + " text-[16px]",
  body: baseStyle + " text-[14px]",
  small: baseStyle + " text-[13px]",
  tiny: baseStyle + " text-[11px]",
};
interface BaseTypographyProps {
  children: React.ReactNode;
  className?: string;
}

export const H1: React.FC<BaseTypographyProps> = ({
  children,
  className = "",
}) => <h1 className={`${typoStyles.h1} ${className}`}>{children}</h1>;

export const H2: React.FC<BaseTypographyProps> = ({
  children,
  className = "",
}) => <h2 className={`${typoStyles.h2} ${className}`}>{children}</h2>;

export const BigBody: React.FC<BaseTypographyProps> = ({
  children,
  className = "",
}) => <p className={`${typoStyles.big_body} ${className}`}>{children}</p>;

export const Body: React.FC<BaseTypographyProps> = ({
  children,
  className = "",
}) => <p className={`${typoStyles.body} ${className}`}>{children}</p>;

export const Small: React.FC<BaseTypographyProps> = ({
  children,
  className = "",
}) => <p className={`${typoStyles.small} ${className}`}>{children}</p>;

export const Tiny: React.FC<BaseTypographyProps> = ({
  children,
  className = "",
}) => <p className={`${typoStyles.tiny} ${className}`}>{children}</p>;
