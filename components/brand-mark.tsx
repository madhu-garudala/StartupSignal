import { Orbit } from "lucide-react";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5" aria-label="StartupSignal">
      <span className="relative grid size-8 place-items-center border border-[#344047] bg-[#0d1113] text-[var(--cyan)]">
        <Orbit size={17} strokeWidth={1.5} />
        <span className="absolute right-0 top-0 size-1.5 translate-x-1/2 -translate-y-1/2 bg-[var(--amber)] shadow-[0_0_10px_var(--amber)]" />
      </span>
      {!compact && <span className="text-sm font-semibold tracking-normal text-white">StartupSignal</span>}
    </div>
  );
}
