import { prisma } from "@/lib/prisma";
import { ContentStatus } from "@prisma/client";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import PlaceCard from "@/components/cards/PlaceCard";
import BlogCard from "@/components/cards/BlogCard";
import EventCard from "@/components/cards/EventCard";
import type { PlaceWithCategory, BlogWithAuthor, EventWithCategory } from "@/types";
import { Search, MapPin, BookOpen, Calendar } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Results | Kishtwar Tourism",
};

interface PageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function SearchResultsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";
  const searchQuery = query.trim();

  let places: PlaceWithCategory[] = [];
  let blogs: BlogWithAuthor[] = [];
  let events: EventWithCategory[] = [];

  if (searchQuery.length >= 2) {
    const [dbPlaces, dbBlogs, dbEvents] = await Promise.all([
      // Places search
      prisma.touristPlace.findMany({
        where: {
          status: ContentStatus.PUBLISHED,
          OR: [
            { name: { contains: searchQuery } },
            { description: { contains: searchQuery } },
            { shortDescription: { contains: searchQuery } },
          ],
        },
        include: {
          category: { select: { id: true, name: true, slug: true } },
        },
        take: 6,
      }),
      // Blogs search
      prisma.blog.findMany({
        where: {
          status: ContentStatus.PUBLISHED,
          OR: [
            { title: { contains: searchQuery } },
            { content: { contains: searchQuery } },
            { excerpt: { contains: searchQuery } },
          ],
        },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          author: { select: { id: true, name: true, username: true, avatar: true } },
        },
        take: 6,
      }),
      // Events search
      prisma.event.findMany({
        where: {
          status: ContentStatus.PUBLISHED,
          OR: [
            { name: { contains: searchQuery } },
            { description: { contains: searchQuery } },
            { shortDescription: { contains: searchQuery } },
          ],
        },
        include: {
          category: { select: { id: true, name: true, slug: true } },
        },
        take: 6,
      }),
    ]);

    // Form mappings
    places = dbPlaces.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      shortDescription: p.shortDescription,
      featuredImage: p.featuredImage,
      category: p.category,
      averageRating: Number(p.averageRating),
      reviewCount: p.reviewCount,
      viewCount: p.viewCount,
      gpsLat: p.gpsLat ? Number(p.gpsLat) : null,
      gpsLng: p.gpsLng ? Number(p.gpsLng) : null,
      featured: p.featured,
      status: p.status,
    }));

    blogs = dbBlogs.map((b) => ({
      id: b.id,
      title: b.title,
      slug: b.slug,
      excerpt: b.excerpt,
      featuredImage: b.featuredImage,
      readingTime: b.readingTime,
      category: b.category,
      author: b.author,
      viewCount: b.viewCount,
      likeCount: b.likeCount,
      commentCount: b.commentCount,
      featured: b.featured,
      status: b.status,
      publishedAt: b.publishedAt,
      createdAt: b.createdAt,
    }));

    events = dbEvents.map((e) => ({
      id: e.id,
      name: e.name,
      slug: e.slug,
      banner: e.banner,
      shortDescription: e.shortDescription,
      startDate: e.startDate,
      endDate: e.endDate,
      location: e.location,
      category: e.category,
      featured: e.featured,
      status: e.status,
    }));
  }

  const totalResults = places.length + blogs.length + events.length;

  return (
    <main className="min-h-screen bg-kishtwar-cream/30 pb-16">
      {/* Search Header Banner */}
      <section className="bg-kishtwar-green-900 text-white py-12 sm:py-16 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight">
            Search Portal Results
          </h1>
          <form action="/search" method="GET" className="max-w-xl mx-auto relative pt-2">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search attractions, blogs, events..."
              className="w-full pl-12 pr-20 py-3 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-kishtwar-gold text-sm placeholder:text-gray-300"
            />
            <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
            <button
              type="submit"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl bg-kishtwar-gold hover:bg-kishtwar-gold-light text-kishtwar-green-950 font-serif font-bold text-xs transition-colors cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Results List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-8">
        {/* Breadcrumbs */}
        <Breadcrumbs className="text-kishtwar-green-600" />

        {/* Results summary info */}
        {searchQuery.length >= 2 && (
          <div className="text-sm text-gray-500 font-medium pb-2 border-b border-kishtwar-cream-200">
            Found {totalResults} {totalResults === 1 ? "result" : "results"} for &ldquo;
            <span className="text-kishtwar-green-950 font-bold">{query}</span>&rdquo;
          </div>
        )}

        {totalResults > 0 ? (
          <div className="space-y-10">
            {/* Places Results */}
            {places.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-serif font-bold text-kishtwar-green-950 flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-kishtwar-emerald" />
                  <span>Attractions ({places.length})</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {places.map((place) => (
                    <PlaceCard key={place.id} place={place} />
                  ))}
                </div>
              </div>
            )}

            {/* Blogs Results */}
            {blogs.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-serif font-bold text-kishtwar-green-950 flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-kishtwar-gold" />
                  <span>Travel Stories ({blogs.length})</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                  ))}
                </div>
              </div>
            )}

            {/* Events Results */}
            {events.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-serif font-bold text-kishtwar-green-950 flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-kishtwar-saffron" />
                  <span>Events & Festivals ({events.length})</span>
                </h3>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Empty / Initial State */
          <div className="bg-white rounded-3xl border border-kishtwar-cream-200 p-12 text-center max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 bg-kishtwar-green-50 text-kishtwar-green-600 rounded-2xl flex items-center justify-center mx-auto border border-kishtwar-green-100">
              <Search className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold font-serif text-kishtwar-green-950">
              {searchQuery.length < 2 ? "Start Searching" : "No Results Found"}
            </h3>
            <p className="text-sm text-gray-655 leading-relaxed font-light">
              {searchQuery.length < 2
                ? "Enter at least 2 characters in the input field above to query tourist places, heritage stories, and cultural events."
                : "We couldn't find any results matching your search terms. Try using different keywords or checking your spelling."}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
