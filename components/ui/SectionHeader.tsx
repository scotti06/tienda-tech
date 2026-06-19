type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  compact?: boolean;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  compact = false,
  className = "",
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";
  const spacingClass = compact ? "mb-8 md:mb-14" : "mb-12 md:mb-20";
  const titleClass = compact
    ? "text-xl font-semibold tracking-[-0.03em] text-white sm:text-2xl md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]"
    : "text-3xl font-semibold tracking-[-0.03em] text-white md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]";

  return (
    <div className={`max-w-2xl ${spacingClass} ${alignClass} ${className}`.trim()}>
      {eyebrow && (
        <p className="mb-2 text-[11px] font-semibold tracking-[0.2em] text-[var(--brand-cyan)] uppercase md:mb-4">
          {eyebrow}
        </p>
      )}
      <h2 className={titleClass}>{title}</h2>
      {description && (
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] md:mt-5 md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
