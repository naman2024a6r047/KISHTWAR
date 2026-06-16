"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface VideoFilterProps {
  categories: Category[];
  activeCategorySlug: string;
}

export default function VideoFilter({
  categories,
  activeCategorySlug,
}: VideoFilterProps) {
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
      router.push(`/videos?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="w-full space-y-4">
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
          All Videos
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

      {isPending && (
        <div className="w-full text-center text-xs text-kishtwar-green-600 animate-pulse">
          Filtering videos...
        </div>
      )}
    </div>
  );
}
