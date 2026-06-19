import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "icon"
  | "link"
  | "inline-link"
  | "surface-primary";

export type ButtonSize =
  | "sm"
  | "md"
  | "lg"
  | "icon"
  | "filter"
  | "compact"
  | "surface";

const liquidGlassCore =
  "border border-white/[0.12] backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.14),0_10px_28px_-8px_rgba(0,0,0,0.4),0_0_20px_rgba(157,78,221,0.08)]";

const liquidGlassHoverCta =
  "hover:scale-[1.03] hover:border-white/[0.15] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_14px_36px_-8px_rgba(0,0,0,0.48),0_0_28px_rgba(157,78,221,0.14)]";

const liquidGlassHoverSubtle =
  "hover:border-white/[0.15] hover:bg-white/[0.12] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.16),0_12px_32px_-8px_rgba(0,0,0,0.42),0_0_24px_rgba(157,78,221,0.1)]";

export const buttonBaseClass =
  "inline-flex items-center justify-center gap-2 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-purple)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--void)] active:scale-[0.98]";

export const variantStyles: Record<ButtonVariant, string> = {
  primary: `${liquidGlassCore} bg-gradient-to-b from-white/[0.12] via-[rgba(157,78,221,0.16)] to-[rgba(0,180,216,0.1)] text-white ${liquidGlassHoverCta} hover:from-white/[0.16] hover:via-[rgba(157,78,221,0.2)] hover:to-[rgba(0,180,216,0.12)]`,
  secondary: `${liquidGlassCore} bg-white/[0.08] text-white ${liquidGlassHoverCta} ${liquidGlassHoverSubtle}`,
  outline: `${liquidGlassCore} border-white/[0.15] bg-white/[0.05] text-white ${liquidGlassHoverCta} hover:border-[var(--brand-cyan)]/30 hover:bg-white/[0.1]`,
  ghost: `${liquidGlassCore} border-white/[0.08] bg-white/[0.04] text-[var(--muted)] hover:text-white ${liquidGlassHoverSubtle}`,
  icon: `${liquidGlassCore} bg-[var(--void)]/50 text-white hover:border-white/20 hover:bg-white/10`,
  link: `${liquidGlassCore} border-white/[0.1] bg-white/[0.05] text-[var(--brand-cyan)] hover:text-[var(--brand-cyan-soft)] ${liquidGlassHoverSubtle}`,
  "inline-link":
    "rounded-md border border-transparent bg-transparent text-[var(--brand-cyan)] shadow-none backdrop-blur-none hover:border-white/[0.1] hover:bg-white/[0.05] hover:text-[var(--brand-cyan-soft)] hover:backdrop-blur-xl hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_8px_24px_-8px_rgba(0,0,0,0.35)] active:scale-100",
  "surface-primary": `${liquidGlassCore} bg-gradient-to-b from-white/[0.12] via-[rgba(157,78,221,0.16)] to-[rgba(0,180,216,0.1)] text-white`,
};

export const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs tracking-wide uppercase font-semibold",
  md: "px-6 py-3 text-sm font-medium",
  lg: "px-8 py-4 text-sm font-semibold tracking-wide",
  icon: "h-10 w-10 shrink-0 p-0",
  filter: "px-4 py-2 text-sm font-medium",
  compact: "px-4 py-2 text-xs font-semibold",
  surface: "",
};

export function getButtonClassName({
  variant = "primary",
  size = "md",
  className = "",
  rounded = "rounded-full",
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  rounded?: string;
} = {}) {
  const resolvedRounded =
    variant === "inline-link" ? "rounded-md" : rounded;

  return `${buttonBaseClass} ${resolvedRounded} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim();
}

type ButtonProps = {
  children: ReactNode;
  href?: string;
  external?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  "aria-label"?: string;
  "aria-expanded"?: boolean;
  "aria-selected"?: boolean;
  role?: string;
  disabled?: boolean;
};

export function Button({
  children,
  href,
  external = false,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  onClick,
  "aria-label": ariaLabel,
  "aria-expanded": ariaExpanded,
  "aria-selected": ariaSelected,
  role,
  disabled,
}: ButtonProps) {
  const resolvedSize =
    variant === "icon" && size === "md"
      ? "icon"
      : variant === "inline-link" && size === "md"
        ? "surface"
        : size;
  const classes = getButtonClassName({
    variant,
    size: resolvedSize,
    className,
  });

  if (href) {
    if (external || href.startsWith("http")) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ariaLabel}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      aria-selected={ariaSelected}
      role={role}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
