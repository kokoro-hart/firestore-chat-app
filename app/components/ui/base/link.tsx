import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { ComponentPropsWithoutRef, PropsWithChildren, ReactElement, cloneElement } from "react";
import { tv } from "tailwind-variants";

export type LinkProps = (
  | (PropsWithChildren<NextLinkProps> & { className?: string })
  | (Omit<ComponentPropsWithoutRef<"a">, "href"> & { href: string })
) & {
  hasStyle?: boolean;
  rightIcon?: ReactElement;
};

const styles = tv({
  base: "text-state text-text-bg inline-flex items-center gap-2",
});

export const Link = ({
  href,
  className,
  hasStyle = true,
  rightIcon,
  children,
  ...props
}: LinkProps) => {
  const iconRight = rightIcon && cloneElement(rightIcon, { className: "h-4 w-4" });

  if (typeof href === "string" && "target" in props) {
    return (
      <a href={href} className={hasStyle ? styles({ className }) : className} {...props}>
        {children}
        {iconRight}
      </a>
    );
  }
  return (
    <NextLink href={href} className={hasStyle ? styles({ className }) : className} {...props}>
      {children}
      {iconRight}
    </NextLink>
  );
};
