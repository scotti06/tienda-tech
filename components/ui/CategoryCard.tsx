import Link from "next/link";
import type { Category } from "@/lib/data";

type CategoryCardProps = {
  category: Category;
};

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={category.href}
      className="group relative flex min-h-[180px] flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 p-6 transition-all duration-500 hover:border-white/25 hover:shadow-xl hover:shadow-violet-500/5 hover:-translate-y-1"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-60 transition-opacity duration-500 group-hover:opacity-100`}
      />
      <div className="absolute -top-4 -right-4 text-6xl opacity-20 transition-transform duration-500 group-hover:scale-110 group-hover:opacity-30">
        {category.icon}
      </div>
      <div className="relative z-10">
        <span className="text-3xl" role="img" aria-hidden>
          {category.icon}
        </span>
        <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">
          {category.name}
        </h3>
        <p className="mt-1 text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
          {category.description}
        </p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-white opacity-0 transition-all duration-300 group-hover:opacity-100">
          Explorar
          <svg
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}
