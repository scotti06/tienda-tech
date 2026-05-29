type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`max-w-2xl mb-14 md:mb-20 ${alignClass}`}>
      {eyebrow && (
        <p className="mb-4 text-[11px] font-semibold tracking-[0.2em] text-[var(--brand-cyan)] uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-base leading-relaxed text-[var(--muted)] md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
