import { getPlaces, getPlaceCategories } from "@/actions/places.actions";
import PlaceCard from "@/components/cards/PlaceCard";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import PlacesFilter from "./PlacesFilter";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tourist Attractions & Places to Visit | Kishtwar Tourism",
  description:
    "Explore the breathtaking valleys, historical monuments, natural shrines, and adventure spots of Kishtwar – the Land of Sapphire, Saffron, and Shrines.",
  openGraph: {
    title: "Tourist Attractions & Places to Visit | Kishtwar Tourism",
    description:
      "Explore the breathtaking valleys, historical monuments, natural shrines, and adventure spots of Kishtwar – the Land of Sapphire, Saffron, and Shrines.",
    type: "website",
  },
};

interface PageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
  }>;
}

export default async function TouristPlacesPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const search = resolvedParams.search || "";
  const categorySlug = resolvedParams.category || "";
  const page = parseInt(resolvedParams.page || "1", 10);
  const limit = 9;

  // Fetch data in parallel
  const [categories, placesResponse] = await Promise.all([
    getPlaceCategories(),
    getPlaces({
      search,
      categorySlug,
      page,
      limit,
    }),
  ]);

  const { data: places, pagination } = placesResponse;

  return (
    <main className="min-h-screen bg-kishtwar-cream/30 pb-16">
      {/* Banner / Header */}
      <section className="relative bg-kishtwar-green-900 text-white overflow-hidden py-16 sm:py-24">
        {/* Background Image / Overlay */}
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-15"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-kishtwar-green-950/50 via-kishtwar-green-900/90 to-kishtwar-green-900"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-kishtwar-gold/20 text-kishtwar-gold text-xs font-bold tracking-widest uppercase border border-kishtwar-gold/30">
            Explore Kishtwar
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight">
            Land of <span className="text-gradient-gold">Sapphire & Shrines</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-300 leading-relaxed font-light">
            Discover breathtaking valleys, sacred pilgrimage sites, adventure trails, and historical landmarks nestled in the towering Himalayas.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Breadcrumbs */}
        <Breadcrumbs className="text-kishtwar-green-600 mb-6" />

        {/* Filter Section */}
        <div className="bg-white rounded-3xl border border-kishtwar-cream-200 p-6 shadow-sm mb-10">
          <PlacesFilter
            categories={categories}
            activeCategorySlug={categorySlug}
            activeSearch={search}
          />
        </div>

        {/* Places Grid */}
        {places.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {places.map((place) => (
                <div key={place.id} className="h-full">
                  <PlaceCard place={place} />
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center space-x-2">
                {/* Prev Button */}
                {page > 1 ? (
                  <Link
                    href={`/tourist-places?${new URLSearchParams({
                      ...(search && { search }),
                      ...(categorySlug && { category: categorySlug }),
                      page: (page - 1).toString(),
                    }).toString()}`}
                    className="flex items-center space-x-1 px-4 py-2.5 rounded-xl border border-kishtwar-cream-200 bg-white hover:bg-kishtwar-green-50 text-sm font-semibold text-kishtwar-green-700 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </Link>
                ) : (
                  <button
                    disabled
                    className="flex items-center space-x-1 px-4 py-2.5 rounded-xl border border-kishtwar-cream-100 bg-gray-50 text-sm font-semibold text-gray-300 cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </button>
                )}

                {/* Page Indicators */}
                <div className="flex items-center space-x-1 px-2">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => {
                    const isActive = p === page;
                    return (
                      <Link
                        key={p}
                        href={`/tourist-places?${new URLSearchParams({
                          ...(search && { search }),
                          ...(categorySlug && { category: categorySlug }),
                          page: p.toString(),
                        }).toString()}`}
                        className={`w-9.5 h-9.5 flex items-center justify-center rounded-xl text-sm font-semibold transition-all ${
                          isActive
                            ? "bg-kishtwar-green-500 text-white font-bold"
                            : "bg-white text-kishtwar-green-700 border border-kishtwar-cream-200 hover:bg-kishtwar-green-50"
                        }`}
                      >
                        {p}
                      </Link>
                    );
                  })}
                </div>

                {/* Next Button */}
                {page < pagination.totalPages ? (
                  <Link
                    href={`/tourist-places?${new URLSearchParams({
                      ...(search && { search }),
                      ...(categorySlug && { category: categorySlug }),
                      page: (page + 1).toString(),
                    }).toString()}`}
                    className="flex items-center space-x-1 px-4 py-2.5 rounded-xl border border-kishtwar-cream-200 bg-white hover:bg-kishtwar-green-50 text-sm font-semibold text-kishtwar-green-700 transition-colors"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <button
                    disabled
                    className="flex items-center space-x-1 px-4 py-2.5 rounded-xl border border-kishtwar-cream-100 bg-gray-50 text-sm font-semibold text-gray-300 cursor-not-allowed"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-kishtwar-cream-200 p-12 text-center max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 bg-kishtwar-green-50 text-kishtwar-green-600 rounded-2xl flex items-center justify-center mx-auto border border-kishtwar-green-100">
              <MapPin className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold font-serif text-kishtwar-green-950">
              No Places Found
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed font-light">
              We couldn&apos;t find any destinations matching your search or filters. Try checking your spelling or clearing filters to view all attractions.
            </p>
            <Link
              href="/tourist-places"
              className="inline-block px-5 py-2.5 rounded-xl bg-kishtwar-green-500 hover:bg-kishtwar-green-600 text-white font-semibold text-sm transition-all"
            >
              Clear Filters
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
