"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { DESTINATION_CATEGORIES, DESTINATION_REGIONS, DURATION_FILTERS, PRICE_BUCKETS, SORT_OPTIONS } from "@/lib/constants";

type Filters = { search?: string; category?: string; region?: string; price?: string; duration?: string; sort?: string };

function buildQuery(f: Filters) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(f)) {
    if (value && value !== "all" && value !== "") params.set(key, value);
  }
  const q = params.toString();
  return q ? `?${q}` : "";
}

export function DestinationFilters({ initial }: { initial: Filters }) {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState(initial.search ?? "");
  const [category, setCategory] = useState(initial.category ?? "all");
  const [region, setRegion] = useState(initial.region ?? "all");
  const [price, setPrice] = useState(initial.price ?? "all");
  const [duration, setDuration] = useState(initial.duration ?? "all");
  const [sort, setSort] = useState(initial.sort ?? "popular");
  const [showFilters, setShowFilters] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      router.replace(`${pathname}${buildQuery({ search, category, region, price, duration, sort })}`, { scroll: false });
    }, 350);
    return () => { if (timer.current) clearTimeout(timer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, region, price, duration, sort]);

  const hasActive = search || category !== "all" || region !== "all" || price !== "all" || duration !== "all";

  function clearAll() {
    setSearch(""); setCategory("all"); setRegion("all"); setPrice("all"); setDuration("all"); setSort("popular");
  }

  const chip = "h-11 cursor-pointer rounded-full border border-ink-200/60 bg-white pl-4 pr-8 text-sm font-medium text-ink-700";
  const caret = "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-400";
  const hidden = showFilters ? "block" : "hidden xl:block";

  return (
    <div className="rounded-2xl border border-ink-200/40 bg-white p-4 shadow-card">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search destinations, places…"
            aria-label="Search destinations"
            className="h-11 w-full rounded-full border border-ink-200/60 bg-sand-50 pl-10 pr-4 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ChooseSelect label="Category" value={category} onChange={setCategory} options={[{ value: "all", label: "All categories" }, ...DESTINATION_CATEGORIES.map((c) => ({ value: c, label: c }))]} chip={chip} caret={caret} />
          <ChooseSelect label="Region" value={region} onChange={setRegion} options={[{ value: "all", label: "All regions" }, ...DESTINATION_REGIONS.map((r) => ({ value: r, label: r }))]} chip={chip} caret={caret} className={hidden} />
          <ChooseSelect label="Price" value={price} onChange={setPrice} options={[{ value: "all", label: "Any price" }, ...PRICE_BUCKETS.map((p) => ({ value: p.id, label: p.label }))]} chip={chip} caret={caret} className={hidden} />
          <ChooseSelect label="Duration" value={duration} onChange={setDuration} options={[{ value: "all", label: "Any duration" }, ...DURATION_FILTERS.map((d) => ({ value: d.id, label: d.label }))]} chip={chip} caret={caret} className={hidden} />
          <ChooseSelect label="Sort by" value={sort} onChange={setSort} options={SORT_OPTIONS.map((s) => ({ value: s.id, label: s.label }))} chip={chip} caret={caret} />

          <button
            onClick={() => setShowFilters((v) => !v)}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-ink-200/60 px-4 text-sm font-semibold text-ink-700 transition-colors hover:bg-sand-100 xl:hidden"
            aria-expanded={showFilters}
          >
            <SlidersHorizontal size={15} /> Filters
          </button>

          {hasActive && (
            <button onClick={clearAll} className="inline-flex h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50">
              <X size={15} /> Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ChooseSelect({
  label, value, onChange, options, chip, caret, className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  chip: string;
  caret: string;
  className?: string;
}) {
  return (
    <label className={cn("relative", className)}>
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={chip}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown size={15} className={caret} />
    </label>
  );
}