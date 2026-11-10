import { searchKinds, type SearchKind } from "@/lib/search";

export function LocationSearchForm({ query = "", kind = "all", dark = false }: { query?: string; kind?: SearchKind | "all"; dark?: boolean }) {
  return (
    <form action="/locations/search" method="get" role="search" className="flex flex-col gap-3 sm:flex-row">
      <label className="sr-only" htmlFor="location-q">
        District, mandal, town, village, colony or service
      </label>
      <input
        id="location-q"
        name="q"
        defaultValue={query}
        minLength={2}
        required
        placeholder="District, mandal, town, village, colony or service"
        className={`h-12 flex-1 rounded-full px-5 text-sm text-brand-900 outline-none ring-2 ring-transparent placeholder:text-brand-800/45 focus:ring-cta-500 ${dark ? "bg-white" : "border border-brand-100 bg-brand-50"}`}
      />
      <label className="sr-only" htmlFor="location-kind">
        Search in
      </label>
      <select
        id="location-kind"
        name="kind"
        defaultValue={kind}
        className={`h-12 rounded-full px-4 text-sm text-brand-900 outline-none focus:ring-2 focus:ring-cta-500 ${dark ? "bg-white" : "border border-brand-100 bg-white"}`}
      >
        {searchKinds.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
      <button type="submit" className="h-12 rounded-full bg-cta-500 px-6 text-sm font-semibold text-brand-950 transition hover:bg-cta-600">
        Search
      </button>
    </form>
  );
}
