import { getPhotos, getPhotoCategories } from "@/actions/gallery.actions";
import GalleryContainer from "./GalleryContainer";
import GalleryFilter from "./GalleryFilter";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photo Gallery & Landscape Photography | Kishtwar Tourism",
  description:
    "Immerse yourself in beautiful landscape photography, snowfalls, local festivals, and village life of Kishtwar captured by local photographers.",
  openGraph: {
    title: "Photo Gallery & Landscape Photography | Kishtwar Tourism",
    description:
      "Immerse yourself in beautiful landscape photography, snowfalls, local festivals, and village life of Kishtwar captured by local photographers.",
    type: "website",
  },
};

interface PageProps {
  searchParams: Promise<{
    category?: string;
    page?: string;
  }>;
}

export default async function GalleryListingPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const categorySlug = resolvedParams.category || "";
  const page = parseInt(resolvedParams.page || "1", 10);
  const limit = 16;

  // Fetch photos & categories
  const [categories, photosResponse] = await Promise.all([
    getPhotoCategories(),
    getPhotos({
      categorySlug,
      page,
      limit,
    }),
  ]);

  const { data: photos, pagination } = photosResponse;

  return (
    <main className="min-h-screen bg-kishtwar-cream/30 pb-16">
      {/* Banner / Header */}
      <section className="relative bg-kishtwar-green-900 text-white overflow-hidden py-16 sm:py-24">
        {/* Background Image / Overlay */}
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-15"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-kishtwar-green-950/50 via-kishtwar-green-900/90 to-kishtwar-green-900"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-kishtwar-gold/20 text-kishtwar-gold text-xs font-bold tracking-widest uppercase border border-kishtwar-gold/30">
            Visual Heritage
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight">
            Kishtwar <span className="text-gradient-gold">in Frames</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-300 leading-relaxed font-light font-sans">
            Explore breathtaking alpine lakes, saffron fields, ancient temples, and towering snow-capped peaks through the lens of local contributors.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Breadcrumbs */}
        <Breadcrumbs className="text-kishtwar-green-600 mb-6" />

        {/* Filter Section */}
        <div className="bg-white rounded-3xl border border-kishtwar-cream-200 p-6 shadow-sm mb-10">
          <GalleryFilter
            categories={categories}
            activeCategorySlug={categorySlug}
          />
        </div>

        {/* Gallery Container Grid */}
        {photos.length > 0 ? (
          <>
            <GalleryContainer photos={photos} />

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center space-x-2">
                {/* Prev Button */}
                {page > 1 ? (
                  <Link
                    href={`/gallery?${new URLSearchParams({
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
                        href={`/gallery?${new URLSearchParams({
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
                    href={`/gallery?${new URLSearchParams({
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
              <ImageIcon className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold font-serif text-kishtwar-green-950">
              No Photos Found
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed font-light">
              We couldn&apos;t find any photos matching your selected filters. Try clearing your category selection to see all photography uploads.
            </p>
            <Link
              href="/gallery"
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
