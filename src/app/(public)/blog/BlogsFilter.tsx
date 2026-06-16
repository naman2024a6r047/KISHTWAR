"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface BlogsFilterProps {
  categories: Category[];
  activeCategorySlug: string;
  activeSearch: string;
}

export default function BlogsFilter({
  categories,
  activeCategorySlug,
  activeSearch,
}: BlogsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(activeSearch);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery({ search: searchValue, page: "1" });
  };

  const handleCategorySelect = (slug: string) => {
    const nextCategory = activeCategorySlug === slug ? "" : slug;
    updateQuery({ category: nextCategory, page: "1" });
  };

  const updateQuery = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    startTransition(() => {
      router.push(`/blog?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search stories, travel guides, culture blogs..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-12 pr-28 py-3.5 rounded-2xl border border-kishtwar-cream-200 bg-white focus:outline-none focus:ring-2 focus:ring-kishtwar-green-500 shadow-sm transition-all text-kishtwar-green-900 placeholder:text-gray-400"
          />
          <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <button
            type="submit"
            disabled={isPending}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 rounded-xl bg-kishtwar-green-500 hover:bg-kishtwar-green-600 text-white font-medium text-sm transition-all disabled:opacity-50"
          >
            {isPending ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {/* Categories Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 pb-2">
        <button
          onClick={() => handleCategorySelect("")}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
            !activeCategorySlug
              ? "bg-kishtwar-green-500 text-white border-kishtwar-green-500 shadow-md"
              : "bg-white text-kishtwar-green-700 border-kishtwar-cream-200 hover:bg-kishtwar-green-50/50 hover:border-kishtwar-green-200"
          }`}
        >
          All Stories
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategorySelect(category.slug)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
              activeCategorySlug === category.slug
                ? "bg-kishtwar-green-500 text-white border-kishtwar-green-500 shadow-md"
                : "bg-white text-kishtwar-green-700 border-kishtwar-cream-200 hover:bg-kishtwar-green-50/50 hover:border-kishtwar-green-200"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {isPending && (
        <div className="w-full text-center text-xs text-kishtwar-green-600 animate-pulse">
          Filtering blog posts...
        </div>
      )}
    </div>
  );
}
