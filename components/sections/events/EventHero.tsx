"use client";

import type { ReactNode } from "react";
import {
  CalendarDays,
  ChevronDown,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

export type EventFilters = {
  query: string;
  date: string;
  category: string;
  location: string;
};

type EventHeroProps = {
  filters: EventFilters;
  categories: string[];
  locations: string[];
  onFilterChange: (key: keyof EventFilters, value: string) => void;
};

export function EventHero({
  filters,
  categories,
  locations,
  onFilterChange,
}: EventHeroProps) {
  return (
    <section className="px-4 pb-9 pt-5 sm:px-6 sm:pb-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-[#172b45] shadow-[0_24px_60px_rgba(31,39,51,0.18)]">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-20 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('/images/hero_event_concert_1791041390305.jpg')",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[linear-gradient(105deg,rgba(20,27,39,0.94)_0%,rgba(20,27,39,0.80)_48%,rgba(20,27,39,0.42)_100%)]"
          />
          <div
            aria-hidden="true"
            className="absolute -right-24 -top-28 -z-10 size-80 rounded-full border border-white/10 sm:size-[28rem]"
          />
          <div
            aria-hidden="true"
            className="absolute -right-12 -top-16 -z-10 size-56 rounded-full border border-brand-gold/20 sm:size-96"
          />

          <div className="px-5 py-8 sm:px-9 sm:py-10 lg:px-12 lg:py-12">
            <div className="max-w-3xl">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm">
                <span className="size-2 rounded-full bg-brand-gold shadow-[0_0_12px_rgba(212,160,60,0.8)]" />
                Addis Ababa · Find your next moment
              </p>
              <h1 className="font-heading text-4xl font-extrabold tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
                Make plans.
                <br />
                <span className="text-[#f0c36d]">Make memories.</span>
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-white/75 sm:text-base sm:leading-7">
                From live music to late nights, discover the experiences bringing
                Addis together.
              </p>
            </div>

            <div className="mt-7 max-w-4xl rounded-2xl border border-white/35 bg-white p-2 shadow-[0_18px_44px_rgba(0,0,0,0.2)] sm:flex sm:items-center">
              <label className="group relative flex min-w-0 flex-1 items-center">
                <span className="sr-only">Search events</span>
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 size-5 text-text-muted transition-colors group-focus-within:text-brand-red"
                />
                <input
                  type="search"
                  value={filters.query}
                  onChange={(event) => onFilterChange("query", event.target.value)}
                  placeholder="Search events, venues, or categories"
                  className="h-12 w-full rounded-xl bg-transparent pl-12 pr-4 text-sm text-charcoal outline-none placeholder:text-text-muted focus-visible:ring-2 focus-visible:ring-brand-gold sm:h-14"
                />
              </label>
              <div className="flex items-center justify-between gap-3 px-3 pb-2 sm:justify-end sm:border-l sm:border-border sm:pb-0 sm:pl-4 sm:pr-2">
                <span className="text-xs font-medium text-text-muted sm:hidden">
                  Updated throughout the day
                </span>
                <span className="hidden text-xs font-medium text-text-muted sm:block">
                  Updated today
                </span>
                <span
                  aria-hidden="true"
                  className="grid size-10 place-items-center rounded-xl bg-brand-red text-white shadow-sm sm:size-11"
                >
                  <Search className="size-4" />
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <span className="mr-1 inline-flex items-center gap-2 text-xs font-semibold text-white/75">
                <SlidersHorizontal aria-hidden="true" className="size-3.5" />
                Quick filters
              </span>
              <FilterSelect
                label="Date"
                icon={<CalendarDays aria-hidden="true" className="size-3.5" />}
                value={filters.date}
                onChange={(value) => onFilterChange("date", value)}
                options={[
                  ["", "Any date"],
                  ["weekend", "This weekend"],
                  ["month", "This month"],
                ]}
              />
              <FilterSelect
                label="Category"
                icon={<SlidersHorizontal aria-hidden="true" className="size-3.5" />}
                value={filters.category}
                onChange={(value) => onFilterChange("category", value)}
                options={[
                  ["", "All categories"],
                  ...categories.map((category) => [category, category]),
                ]}
              />
              <FilterSelect
                label="Location"
                icon={<MapPin aria-hidden="true" className="size-3.5" />}
                value={filters.location}
                onChange={(value) => onFilterChange("location", value)}
                options={[
                  ["", "All locations"],
                  ...locations.map((location) => [location, location]),
                ]}
              />
              {(filters.date || filters.category || filters.location || filters.query) && (
                <button
                  type="button"
                  onClick={() => {
                    onFilterChange("query", "");
                    onFilterChange("date", "");
                    onFilterChange("category", "");
                    onFilterChange("location", "");
                  }}
                  className="inline-flex items-center gap-1.5 px-2 py-2 text-xs font-semibold text-white/80 transition hover:text-white"
                >
                  <X aria-hidden="true" className="size-3.5" />
                  Clear all
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterSelect({
  label,
  icon,
  value,
  onChange,
  options,
}: {
  label: string;
  icon: ReactNode;
  value: string;
  onChange: (value: string) => void;
  options: string[][];
}) {
  return (
    <label className="relative inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 py-2 pl-3.5 pr-9 text-xs font-semibold text-white backdrop-blur-sm transition hover:border-white/45 hover:bg-white/15 focus-within:ring-2 focus-within:ring-brand-gold">
      {icon}
      <span className="sr-only">{label} filter</span>
      <select
        aria-label={`${label} filter`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="max-w-40 cursor-pointer appearance-none bg-transparent text-inherit outline-none"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue} className="bg-white text-charcoal">
            {optionLabel}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3 size-3.5"
      />
    </label>
  );
}

export default EventHero;
