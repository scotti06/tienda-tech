import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/data";
import { IconArrowRight } from "@/components/ui/Icons";

type CategoryCardProps = {
  category: Category;
};

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={category.href}
      className={`group card-hover relative flex min-h-[200px] flex-col justify-between overflow-hidden rounded-2xl glass-card p-6 ${category.accent}`}
    >
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[var(--brand-purple)]/5 blur-2xl transition-all duration-350 ease-out [@media(hover:hover)_and_(pointer:fine)]:group-hover:bg-[var(--brand-cyan)]/10" />

      <div className="relative h-12 w-12 shrink-0" aria-hidden />

      <Image
        src={category.image}
        alt=""
        width={384}
        height={384}
        className="card-hover-image pointer-events-none absolute right-5 top-6 z-[1] h-24 w-24 object-contain object-center drop-shadow-[0_12px_20px_rgba(0,0,0,0.2)]"
        sizes="96px"
      />

      <div className="relative mt-auto">
        <h3 className="text-lg font-semibold tracking-tight text-white">
          {category.name}
        </h3>
        <p className="mt-1 text-sm text-[var(--muted)] transition-colors duration-350 ease-out [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-zinc-300">
          {category.description}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--brand-cyan)] opacity-0 transition-all duration-350 ease-out [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100">
          Ver productos
          <IconArrowRight className="transition-transform duration-350 ease-out [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
