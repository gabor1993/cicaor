import type { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Variant = "solid" | "outline" | "light" | "outlineLight";

const variants: Record<Variant, string> = {
  solid: "bg-accent text-on-accent hover:opacity-90",
  outline: "border border-accent text-accent hover:bg-accent hover:text-on-accent",
  light: "bg-sand text-[#24271d] hover:opacity-90",
  outlineLight: "border border-[#f6f3ec] text-[#f6f3ec] hover:bg-[#f6f3ec] hover:text-[#24271d]",
};

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: Variant;
  arrow?: boolean;
};

export function ButtonLink({
  variant = "solid",
  arrow = true,
  className = "",
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
      {arrow && <ArrowRight aria-hidden className="size-4" />}
    </Link>
  );
}
