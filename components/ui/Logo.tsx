import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  className?: string;
  href?: string;
  size?: "nav" | "footer";
};

const sizeConfig = {
  nav: {
    className:
      "h-14 w-auto max-w-[140px] sm:h-16 sm:max-w-[168px] md:h-[4.5rem] md:max-w-[200px]",
    width: 200,
    height: 200,
  },
  footer: {
    className: "h-24 w-auto max-w-[220px] sm:h-28 sm:max-w-[260px]",
    width: 260,
    height: 260,
  },
};

export function Logo({ className = "", href = "/", size = "nav" }: LogoProps) {
  const config = sizeConfig[size];

  return (
    <Link
      href={href}
      className={`relative inline-flex shrink-0 items-center transition-opacity hover:opacity-90 ${className}`}
      aria-label="Techstylebv — accesorios para celulares"
    >
      <Image
        src="/brand/logo.png"
        alt="Techstylebv — accesorios para celulares"
        width={config.width}
        height={config.height}
        className={`object-contain object-center ${config.className}`}
        priority={size === "nav"}
        sizes={size === "nav" ? "(max-width: 640px) 140px, (max-width: 768px) 168px, 200px" : "260px"}
      />
    </Link>
  );
}
