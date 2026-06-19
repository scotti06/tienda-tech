"use client";

import Link from "next/link";
import { useState } from "react";
import { IconChevronRight } from "@/components/ui/Icons";
import type { MenuTreeItem } from "@/lib/hamburgerMenu";

type HamburgerMenuAccordionProps = {
  item: MenuTreeItem;
  pathname: string;
  depth?: number;
};

function getItemClasses(depth: number, active: boolean): string {
  const base =
    depth === 0
      ? "rounded-xl px-4 py-3.5 text-base"
      : depth === 1
        ? "rounded-xl py-3 pl-8 pr-4 text-sm"
        : "rounded-xl py-2.5 pl-12 pr-4 text-sm";

  return `${base} transition-colors ${
    active
      ? "bg-white/10 text-white"
      : "text-zinc-300 hover:bg-white/5 hover:text-white"
  }`;
}

export function HamburgerMenuAccordion({
  item,
  pathname,
  depth = 0,
}: HamburgerMenuAccordionProps) {
  const [open, setOpen] = useState(false);
  const hasChildren = Boolean(item.children?.length);

  if (hasChildren) {
    return (
      <li>
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className={`flex w-full items-center justify-between ${getItemClasses(depth, false)}`}
        >
          <span>{item.label}</span>
          <IconChevronRight
            className={`h-4 w-4 shrink-0 text-[var(--muted)] transition-transform duration-300 ${
              open ? "rotate-90" : ""
            }`}
          />
        </button>
        {open && (
          <ul className="flex flex-col gap-1 animate-fade-in">
            {item.children!.map((child) => (
              <HamburgerMenuAccordion
                key={child.id}
                item={child}
                pathname={pathname}
                depth={depth + 1}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }

  if (!item.href) return null;

  const active = pathname === item.href;

  return (
    <li>
      <Link href={item.href} className={`block ${getItemClasses(depth, active)}`}>
        {item.label}
      </Link>
    </li>
  );
}
