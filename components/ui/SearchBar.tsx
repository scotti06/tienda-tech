import { IconSearch } from "@/components/ui/Icons";

type SearchBarProps = {
  className?: string;
};

export function SearchBar({ className = "" }: SearchBarProps) {
  return (
    <label
      className={`flex h-10 flex-1 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 transition-all duration-300 focus-within:border-[var(--brand-purple)]/40 focus-within:bg-white/[0.06] focus-within:shadow-[0_0_0_3px_var(--glow-purple)] ${className}`}
    >
      <IconSearch className="h-4 w-4 shrink-0 text-[var(--muted)]" />
      <input
        type="search"
        placeholder="¿Qué estás buscando?"
        className="w-full bg-transparent text-sm text-white placeholder:text-[var(--muted)] focus:outline-none"
      />
    </label>
  );
}
