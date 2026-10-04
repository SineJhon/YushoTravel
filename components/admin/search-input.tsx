import { Search } from "lucide-react";

/** Native GET form (no JS) — safe to render from server components. */
export function SearchForm({
  action,
  params = [],
  defaultValue = "",
  placeholder = "Search…",
  name = "search",
  maxWidth = "max-w-sm",
}: {
  action: string;
  params?: [string, string][];
  defaultValue?: string;
  placeholder?: string;
  name?: string;
  maxWidth?: string;
}) {
  return (
    <form action={action} method="GET" className={`relative ${maxWidth}`} role="search">
      {params.map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value} />
      ))}
      <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
      <input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-10 w-full rounded-full border border-ink-200 bg-white pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/40"
      />
    </form>
  );
}