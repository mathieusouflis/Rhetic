import { forwardRef } from "react";
import NextLink from "next/link";

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

const baseStyles = "inline-flex items-center gap-2 text-[14px] hover:underline";

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className = "", href, children, ...props }, ref) => {
    return (
      <NextLink
        href={href}
        ref={ref}
        className={`${baseStyles} ${className}`}
        {...props}
      >
        {children}
      </NextLink>
    );
  }
);

Link.displayName = "Link";

export { Link };
