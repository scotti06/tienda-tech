"use client";

import Image from "next/image";
import type { ShopGroup } from "@/lib/shop";
import { countProductsByGroup } from "@/lib/shop";

type ShopGroupCardProps = {
  group: ShopGroup;
  isActive: boolean;
  onSelect: () => void;
};

export function ShopGroupCard({ group, isActive, onSelect }: ShopGroupCardProps) {
  const count = countProductsByGroup(group.id);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isActive}
      className={`group card-hover card-tap relative flex min-h-[200px] w-full flex-col justify-between overflow-hidden rounded-2xl glass-card p-6 text-left transition-all duration-300 ${
        group.accent
      } ${isActive ? "border-[var(--brand-purple)]/40 ring-1 ring-[var(--brand-purple)]/30" : ""}`}
    >
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[var(--brand-purple)]/5 blur-2xl transition-all duration-350 ease-out [@media(hover:hover)_and_(pointer:fine)]:group-hover:bg-[var(--brand-cyan)]/10" />

      <Image
        src={group.image}
        alt=""
        width={384}
        height={384}
        className="card-hover-image pointer-events-none absolute right-5 top-6 z-[1] h-24 w-24 object-contain object-center drop-shadow-[0_12px_20px_rgba(0,0,0,0.2)]"
        sizes="96px"
      />

      <div className="relative mt-auto">
        <h3 className="text-lg font-semibold tracking-tight text-white">
          {group.name}
        </h3>
        <p className="mt-1 text-sm text-[var(--muted)] transition-colors duration-350 ease-out [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-zinc-300">
          {group.description}
        </p>
        <p className="mt-3 text-xs font-medium text-[var(--brand-cyan)]">
          {count} {count === 1 ? "producto" : "productos"}
        </p>
      </div>
    </button>
  );
}
