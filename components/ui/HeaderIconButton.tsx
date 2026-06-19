import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type HeaderIconButtonBaseProps = {
  "aria-label": string;
  active?: boolean;
  children: ReactNode;
  badge?: ReactNode;
};

type HeaderIconLinkProps = HeaderIconButtonBaseProps & {
  href: string;
  onClick?: never;
};

type HeaderIconActionProps = HeaderIconButtonBaseProps & {
  href?: never;
  onClick: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
};

type HeaderIconButtonProps = HeaderIconLinkProps | HeaderIconActionProps;

const interactionEase = "cubic-bezier(0.22, 1, 0.36, 1)";
const headerIconClassName = "h-[21px] w-[21px] text-white/90";
const headerIconStroke = 1.8;

const sharedClassName =
  "group relative inline-flex h-11 w-11 shrink-0 items-center justify-center text-white/90 transition-transform duration-200 hover:scale-[1.04] active:scale-[1.04]";

function HeaderIconButtonContent({
  active = false,
  children,
  badge,
}: Pick<HeaderIconButtonBaseProps, "active" | "children" | "badge">) {
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[14px] border border-transparent bg-transparent opacity-0 shadow-none backdrop-blur-md transition-all duration-200 group-hover:border-white/[0.1] group-hover:bg-white/[0.05] group-hover:opacity-100 group-hover:shadow-[0_0_18px_rgba(157,78,221,0.08)] group-focus-visible:border-white/[0.1] group-focus-visible:bg-white/[0.05] group-focus-visible:opacity-100 group-focus-visible:shadow-[0_0_18px_rgba(157,78,221,0.08)] group-active:border-white/[0.1] group-active:bg-white/[0.05] group-active:opacity-100 group-active:shadow-[0_0_18px_rgba(157,78,221,0.08)]"
        style={{ transitionTimingFunction: interactionEase }}
      />
      <span
        className={`relative z-10 transition-colors duration-200 group-hover:text-white group-focus-visible:text-white group-active:text-white${
          active ? " text-white" : ""
        }`}
        style={{ transitionTimingFunction: interactionEase }}
      >
        {children}
      </span>
      {badge}
    </>
  );
}

export function HeaderIconButton(props: HeaderIconButtonProps) {
  const { "aria-label": ariaLabel, active = false, children, badge } = props;

  if ("href" in props && props.href) {
    return (
      <Link
        href={props.href}
        aria-label={ariaLabel}
        aria-current={active ? "page" : undefined}
        className={sharedClassName}
        style={{ transitionTimingFunction: interactionEase }}
      >
        <HeaderIconButtonContent active={active} badge={badge}>
          {children}
        </HeaderIconButtonContent>
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={props.onClick}
      className={sharedClassName}
      style={{ transitionTimingFunction: interactionEase }}
    >
      <HeaderIconButtonContent active={active} badge={badge}>
        {children}
      </HeaderIconButtonContent>
    </button>
  );
}

type HeaderIconProps = {
  className?: string;
};

export function HeaderIconCart({
  className = headerIconClassName,
}: HeaderIconProps) {
  return (
    <ShoppingCart
      className={className}
      strokeWidth={headerIconStroke}
      aria-hidden
    />
  );
}

export function HeaderCartBadge({ count = 0 }: { count?: number }) {
  if (count <= 0) return null;

  return (
    <span className="pointer-events-none absolute -top-0.5 -right-0.5 z-20 flex h-3 w-3 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-[#9D4EDD] to-[#7B2CBF] text-[9px] font-semibold leading-none text-white shadow-[0_1px_5px_rgba(157,78,221,0.24)]">
      {count > 9 ? "9+" : count}
    </span>
  );
}
