import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { ReactNode, cloneElement, ReactElement } from "react";

interface ActiveLinkProps extends LinkProps {
  children: ReactElement;
  href: string;
  activeClassName?: string;
}

export function ActiveLink({
  children,
  href,
  activeClassName,
  ...props
}: ActiveLinkProps) {
  const { asPath } = useRouter();

  const className = asPath === href ? activeClassName : "";

  return (
    <Link href={href} {...props}>
      {cloneElement(children, {
        className,
      })}
    </Link>
  );
}
