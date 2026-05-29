import Link from "next/link";
import type { Category } from "@/lib/data";
import { CategoryIcon, IconArrowRight } from "@/components/ui/Icons";

type CategoryCardProps = {
  category: Category;
};

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={category.href}
      className={`group relative flex min-h-[200px] flex-col justify-between overflow-hidden rounded-2xl glass-card p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${category.accent}`}
    >
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[var(--brand-purple)]/5 blur-2xl transition-all duration-500 group-hover:bg-[var(--brand-cyan)]/10" />

      <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[var(--brand-cyan)] transition-colors duration-300 group-hover:border-[var(--brand-purple)]/30 group-hover:bg-[var(--brand-purple)]/10">
        <CategoryIcon id={category.id} />
      </div>

      <div className="relative mt-auto">
        <h3 className="text-lg font-semibold tracking-tight text-white">
          {category.name}
        </h3>
        <p className="mt-1 text-sm text-[var(--muted)] transition-colors group-hover:text-zinc-300">
          {category.description}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--brand-cyan)] opacity-0 transition-all duration-300 group-hover:opacity-100">
          Ver productos
          <IconArrowRight className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
