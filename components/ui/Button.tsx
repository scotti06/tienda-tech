import Link from "next/link";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-brand text-white hover:brightness-110 shadow-lg shadow-[var(--glow-purple)]",
  secondary:
    "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-[var(--brand-purple)]/30",
  outline:
    "bg-transparent text-white border border-white/20 hover:border-[var(--brand-cyan)]/40 hover:bg-white/5",
  ghost: "text-[var(--muted)] hover:text-white hover:bg-white/5",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs tracking-wide uppercase font-semibold",
  md: "px-6 py-3 text-sm font-medium",
  lg: "px-8 py-4 text-sm font-semibold tracking-wide",
};

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  type?: "button" | "submit";
};

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-purple)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--void)] active:scale-[0.98]";

  const classes = `${base} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes}>
      {children}
    </button>
  );
}
