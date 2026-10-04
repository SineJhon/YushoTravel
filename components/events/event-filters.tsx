"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { EVENT_CATEGORIES } from "@/lib/constants";

export function EventFilters({
  scope,
  category: initialCategory,
  search: initialSearch,
}: {
  scope: string;
  category: string;
  search: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const params = new URLSearchParams();
      params.set("scope", scope);
      if (category && category !== "all") params.set("category", category);
      if (search.trim()) params.set("search", search.trim());
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, 350);
    return () => { if (timer.current) clearTimeout(timer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, search, scope]);

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        {["all", ...EVENT_CATEGORIES.map((c) => c.value)].map((value) => {
          const label = value === "all" ? "All categories" : EVENT_CATEGORIES.find((c) => c.value === value)?.label ?? value;
          return (
            <button
              key={value}
              onClick={() => setCategory(value)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                category === value
                  ? "bg-forest-900 text-white"
                  : "bg-white text-ink-700 ring-1 ring-ink-200/60 hover:bg-sand-100",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="relative">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search events…"
          aria-label="Search events"
          className="h-11 w-full rounded-full border border-ink-200/60 bg-white pl-10 pr-4 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600 lg:w-64"
        />
      </div>
    </div>
  );
}