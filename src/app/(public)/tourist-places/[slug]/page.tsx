import { getPlaceBySlug } from "@/actions/places.actions";
import { getCurrentUser } from "@/lib/auth";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import RichTextRenderer from "@/components/common/RichTextRenderer";
import PlaceGallery from "./PlaceGallery";
import ReviewForm from "./ReviewForm";
import MapEmbed from "@/components/common/MapEmbed";
import StarRating from "@/components/common/StarRating";
import BookmarkButton from "@/components/common/BookmarkButton";
import { notFound } from "next/navigation";
import { Calendar, Clock, DollarSign, Compass, User, Tag, MapPin } from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const place = await getPlaceBySlug(resolvedParams.slug);

  if (!place) {
    return {
      title: "Place Not Found | Kishtwar Tourism",
    };
  }

  return {
    title: `${place.name} - Places to Visit in Kishtwar`,
    description:
      place.metaDescription ||
      place.shortDescription ||
      `Learn about ${place.name}, including its history, visiting times, how to reach, best season, reviews, and interactive maps.`,
    openGraph: {
      title: `${place.name} - Places to Visit in Kishtwar`,
      description:
        place.metaDescription ||
        place.shortDescription ||
        `Learn about ${place.name}, including its history, visiting times, how to reach, best season, reviews, and interactive maps.`,
      images: [place.featuredImage],
      type: "website",
    },
  };
}

export default async function PlaceDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const place = await getPlaceBySlug(resolvedParams.slug);

  if (!place) {
    notFound();
  }

  const currentUser = await getCurrentUser();
  const existingReview = currentUser
    ? place.reviews.find((r) => r.user.id === currentUser.id)
    : null;

  // Set up Map coordinates
  const hasGps = place.gpsLat !== null && place.gpsLng !== null;
  const mapCenter: [number, number] = hasGps ? [place.gpsLat!, place.gpsLng!] : [33.3142, 75.7688];
  const markers = hasGps
    ? [
        {
          id: place.id,
          name: place.name,
          slug: place.slug,
          type: "place" as const,
          lat: place.gpsLat!,
          lng: place.gpsLng!,
          description: place.shortDescription || "",
          image: place.featuredImage,
        },
      ]
    : [];

  return (
    <main className="min-h-screen bg-kishtwar-cream/20 pb-16">
      {/* Hero Section */}
      <section className="relative h-[50vh] sm:h-[65vh] w-full overflow-hidden bg-kishtwar-green-950">
        <img
          src={place.featuredImage}
          alt={place.name}
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-kishtwar-green-950 via-kishtwar-green-950/40 to-black/30"></div>

        {/* Hero Content Container */}
        <div className="absolute bottom-0 inset-x-0 pb-10 pt-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end h-full text-white space-y-4">
            {/* Category + Bookmark */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-kishtwar-gold text-kishtwar-green-950 text-xs font-bold uppercase tracking-wider">
                {place.category.name}
              </span>
              <BookmarkButton
                initialSaved={false}
                itemId={place.id}
                itemType="place"
                size="md"
              />
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight drop-shadow-md">
              {place.name}
            </h1>

            {/* Sub-info */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-200">
              {place.reviewCount > 0 ? (
                <div className="flex items-center space-x-1.5">
                  <StarRating rating={place.averageRating} size="sm" />
                  <span className="font-semibold text-white">
                    {place.averageRating.toFixed(1)}
                  </span>
                  <span>({place.reviewCount} {place.reviewCount === 1 ? 'review' : 'reviews'})</span>
                </div>
              ) : (
                <span>No reviews yet</span>
              )}
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
              <div className="flex items-center space-x-1">
                <User className="h-3.5 w-3.5 text-kishtwar-gold" />
                <span>Contributed by {place.contributor.name}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Breadcrumbs */}
        <Breadcrumbs className="text-kishtwar-green-600 mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Columns (Left - spans 2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview / Key facts summary bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white rounded-2xl border border-kishtwar-cream-200 p-5 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-kishtwar-green-50 text-kishtwar-green-600">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold block">
                    Best Season
                  </span>
                  <span className="text-xs font-bold text-kishtwar-green-900">
                    {place.bestSeason || "All Year"}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-kishtwar-green-50 text-kishtwar-green-600">
                  <Compass className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold block">
                    Altitude
                  </span>
                  <span className="text-xs font-bold text-kishtwar-green-900">
                    {place.altitude || "Varies"}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-kishtwar-green-50 text-kishtwar-green-600">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold block">
                    Visiting Hours
                  </span>
                  <span className="text-xs font-bold text-kishtwar-green-900">
                    {place.visitingTime || "Daylight"}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-kishtwar-green-50 text-kishtwar-green-600">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold block">
                    Entry Fee
                  </span>
                  <span className="text-xs font-bold text-kishtwar-green-900">
                    {place.entryFee || "Free"}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl border border-kishtwar-cream-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="text-2xl font-serif font-bold text-kishtwar-green-950 border-b border-kishtwar-cream-100 pb-2">
                About the Attraction
              </h2>
              <RichTextRenderer content={place.description} />
            </div>

            {/* History */}
            {place.history && (
              <div className="bg-white rounded-3xl border border-kishtwar-cream-200 p-6 sm:p-8 shadow-sm space-y-4">
                <h2 className="text-2xl font-serif font-bold text-kishtwar-green-950 border-b border-kishtwar-cream-100 pb-2">
                  Historical Significance
                </h2>
                <RichTextRenderer content={place.history} />
              </div>
            )}

            {/* Place gallery */}
            {place.images.length > 0 && <PlaceGallery images={place.images} />}

            {/* Practical information: how to reach & travel tips */}
            {(place.howToReach || place.travelTips) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {place.howToReach && (
                  <div className="bg-white rounded-2xl border border-kishtwar-cream-200 p-6 shadow-sm space-y-3">
                    <h4 className="font-serif font-bold text-kishtwar-green-950 border-b border-kishtwar-cream-100 pb-1.5 flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-kishtwar-emerald" />
                      <span>How to Reach</span>
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed font-light whitespace-pre-line">
                      {place.howToReach}
                    </p>
                  </div>
                )}

                {place.travelTips && (
                  <div className="bg-white rounded-2xl border border-kishtwar-cream-200 p-6 shadow-sm space-y-3">
                    <h4 className="font-serif font-bold text-kishtwar-green-950 border-b border-kishtwar-cream-100 pb-1.5 flex items-center space-x-2">
                      <Compass className="h-4 w-4 text-kishtwar-gold" />
                      <span>Traveler Tips</span>
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed font-light whitespace-pre-line">
                      {place.travelTips}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Nearby Accommodation */}
            {place.nearbyHotels && (
              <div className="bg-white rounded-2xl border border-kishtwar-cream-200 p-6 shadow-sm space-y-3">
                <h4 className="font-serif font-bold text-kishtwar-green-950 border-b border-kishtwar-cream-100 pb-1.5">
                  Accommodation & Dining Nearby
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed font-light whitespace-pre-line">
                  {place.nearbyHotels}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar Area (Right Column - spans 1 col) */}
          <div className="space-y-6">
            {/* Map Card */}
            <div className="bg-white rounded-3xl border border-kishtwar-cream-200 p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-serif font-bold text-kishtwar-green-950 flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-kishtwar-emerald" />
                <span>Location Map</span>
              </h3>
              <MapEmbed markers={markers} center={mapCenter} zoom={11} height="280px" />
              {hasGps && (
                <div className="text-[10px] text-gray-400 text-center font-medium">
                  Coordinates: {place.gpsLat?.toString()}, {place.gpsLng?.toString()}
                </div>
              )}
            </div>

            {/* Review Form */}
            <ReviewForm
              placeId={place.id}
              placeSlug={place.slug}
              existingReview={existingReview}
            />

            {/* Reviews list */}
            <div className="bg-white rounded-3xl border border-kishtwar-cream-200 p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-serif font-bold text-kishtwar-green-950 border-b border-kishtwar-cream-100 pb-2">
                Traveler Reviews
              </h3>
              
              {place.reviews.length > 0 ? (
                <div className="divide-y divide-kishtwar-cream-100 space-y-4">
                  {place.reviews.map((review) => (
                    <div key={review.id} className="pt-4 first:pt-0 space-y-2">
                      <div className="flex items-center justify-between">
                        {/* Reviewer User info */}
                        <div className="flex items-center space-x-2">
                          <img
                            src={review.user.avatar || "/images/placeholders/avatar.jpg"}
                            alt={review.user.name}
                            className="h-8 w-8 rounded-full border border-kishtwar-cream-200 object-cover"
                          />
                          <div>
                            <span className="text-xs font-bold text-kishtwar-green-900 block leading-none">
                              {review.user.name}
                            </span>
                            <span className="text-[9px] text-gray-400 font-light">
                              {new Date(review.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Stars */}
                        <StarRating rating={review.rating} size="sm" />
                      </div>

                      {/* Content */}
                      <div className="space-y-1 pl-10">
                        {review.title && (
                          <h5 className="text-xs font-bold text-kishtwar-green-900 font-serif">
                            {review.title}
                          </h5>
                        )}
                        {review.content && (
                          <p className="text-xs text-gray-600 leading-relaxed font-light">
                            {review.content}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-400 text-xs font-light">
                  No reviews yet. Be the first to share your thoughts!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
