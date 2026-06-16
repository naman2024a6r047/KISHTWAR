"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface EventsFilterProps {
  categories: Category[];
  activeCategorySlug: string;
  upcomingOnly: boolean;
}

export default function EventsFilter({
  categories,
  activeCategorySlug,
  upcomingOnly,
}: EventsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleCategorySelect = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    params.set("page", "1");

    startTransition(() => {
      router.push(`/events?${params.toString()}`, { scroll: false });
    });
  };

  const handleUpcomingToggle = (checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (checked) {
      params.set("upcoming", "true");
    } else {
      params.delete("upcoming");
    }
    params.set("page", "1");

    startTransition(() => {
      router.push(`/events?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="w-full space-y-6 flex flex-col items-center">
      {/* Category Tabs Container */}
      <div className="flex flex-wrap items-center justify-center gap-2 pb-2">
        <button
          onClick={() => handleCategorySelect("")}
          className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border ${
            !activeCategorySlug
              ? "bg-kishtwar-green-500 text-white border-kishtwar-green-500 shadow-md"
              : "bg-white text-kishtwar-green-700 border-kishtwar-cream-200 hover:bg-kishtwar-green-50/50 hover:border-kishtwar-green-200"
          }`}
        >
          All Events
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategorySelect(category.slug)}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border ${
              activeCategorySlug === category.slug
                ? "bg-kishtwar-green-500 text-white border-kishtwar-green-500 shadow-md"
                : "bg-white text-kishtwar-green-700 border-kishtwar-cream-200 hover:bg-kishtwar-green-50/50 hover:border-kishtwar-green-200"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Upcoming events filter toggle */}
      <div className="flex items-center space-x-3 bg-kishtwar-cream/40 px-4 py-2 rounded-2xl border border-kishtwar-cream-200 shadow-sm">
        <input
          type="checkbox"
          id="upcomingOnly"
          checked={upcomingOnly}
          onChange={(e) => handleUpcomingToggle(e.target.checked)}
          className="h-4.5 w-4.5 rounded border-gray-300 text-kishtwar-green-600 focus:ring-kishtwar-green-500 cursor-pointer accent-kishtwar-green-600"
        />
        <label
          htmlFor="upcomingOnly"
          className="text-xs font-semibold text-kishtwar-green-950 cursor-pointer select-none"
        >
          Show Upcoming Events Only
        </label>
      </div>

      {isPending && (
        <div className="w-full text-center text-xs text-kishtwar-green-600 animate-pulse">
          Filtering events list...
        </div>
      )}
    </div>
  );
}
