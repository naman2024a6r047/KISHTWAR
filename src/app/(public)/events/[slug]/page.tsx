import { getEventBySlug } from "@/actions/events.actions";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import RichTextRenderer from "@/components/common/RichTextRenderer";
import MapEmbed from "@/components/common/MapEmbed";
import BookmarkButton from "@/components/common/BookmarkButton";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { Calendar, Clock, MapPin, ExternalLink, User, Compass } from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const event = await getEventBySlug(resolvedParams.slug);

  if (!event) {
    return {
      title: "Event Not Found | Kishtwar Tourism",
    };
  }

  const startDate = new Date(event.startDate);
  return {
    title: `${event.name} - Festival & Events in Kishtwar`,
    description:
      event.metaDescription ||
      event.shortDescription ||
      `Find details on ${event.name} scheduled for ${format(startDate, "MMMM dd, yyyy")} in Kishtwar.`,
    openGraph: {
      title: `${event.name} - Festival & Events in Kishtwar`,
      description:
        event.metaDescription ||
        event.shortDescription ||
        `Find details on ${event.name} scheduled for ${format(startDate, "MMMM dd, yyyy")} in Kishtwar.`,
      images: event.banner ? [event.banner] : undefined,
      type: "website",
    },
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const event = await getEventBySlug(resolvedParams.slug);

  if (!event) {
    notFound();
  }

  const startDate = new Date(event.startDate);
  const formattedDate = event.endDate
    ? `${format(startDate, "MMMM dd")} - ${format(new Date(event.endDate), "MMMM dd, yyyy")}`
    : format(startDate, "MMMM dd, yyyy");

  // Map settings
  const hasGps = event.gpsLat !== null && event.gpsLng !== null;
  const mapCenter: [number, number] = hasGps ? [event.gpsLat!, event.gpsLng!] : [33.3142, 75.7688];
  const markers = hasGps
    ? [
        {
          id: event.id,
          name: event.name,
          slug: event.slug,
          type: "place" as const, // Treat event markers similarly for maps icon loading
          lat: event.gpsLat!,
          lng: event.gpsLng!,
          description: event.shortDescription || "",
          image: event.banner || undefined,
        },
      ]
    : [];

  return (
    <main className="min-h-screen bg-kishtwar-cream/20 pb-16">
      {/* Hero Cover section */}
      {event.banner && (
        <section className="relative h-[35vh] sm:h-[45vh] w-full overflow-hidden bg-kishtwar-green-950">
          <img
            src={event.banner}
            alt={event.name}
            className="absolute inset-0 h-full w-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-kishtwar-green-950 via-kishtwar-green-950/40 to-black/30"></div>
        </section>
      )}

      {/* Main Details Body */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumbs className="text-kishtwar-green-600" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column (Left - 2 span) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-kishtwar-cream-200 p-6 sm:p-8 shadow-sm space-y-6">
              {/* Category + Actions */}
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-kishtwar-emerald/10 text-kishtwar-emerald text-xs font-bold uppercase tracking-wider">
                  {event.category.name}
                </span>
                <BookmarkButton
                  initialSaved={false}
                  itemId={event.id}
                  itemType="event"
                  size="md"
                />
              </div>

              {/* Event Title */}
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-kishtwar-green-950 leading-tight">
                {event.name}
              </h1>

              {/* Contributor Badge */}
              <div className="flex items-center space-x-1.5 text-xs text-gray-500 pb-4 border-b border-kishtwar-cream-100">
                <User className="h-4 w-4 text-kishtwar-gold" />
                <span>Submitted by {event.contributor.name}</span>
              </div>

              {/* Event Description (rich text) */}
              <div className="space-y-4">
                <h3 className="text-xl font-serif font-bold text-kishtwar-green-950 pb-1.5 border-b border-kishtwar-cream-100">
                  Event Overview & Information
                </h3>
                <RichTextRenderer content={event.description} />
              </div>
            </div>
          </div>

          {/* Sidebar Area (Right - 1 span) */}
          <div className="space-y-6">
            {/* Quick Details Card */}
            <div className="bg-white rounded-3xl border border-kishtwar-cream-200 p-6 shadow-sm space-y-5">
              <h3 className="text-lg font-serif font-bold text-kishtwar-green-950 border-b border-kishtwar-cream-100 pb-2">
                Event Schedule & Venue
              </h3>

              <div className="space-y-4">
                {/* Date */}
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-xl bg-kishtwar-green-50 text-kishtwar-green-600 shrink-0">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block leading-none mb-1">
                      Event Date
                    </span>
                    <span className="text-sm font-bold text-kishtwar-green-900 leading-snug">
                      {formattedDate}
                    </span>
                  </div>
                </div>

                {/* Time */}
                {event.startTime && (
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-xl bg-kishtwar-green-50 text-kishtwar-green-600 shrink-0">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-semibold block leading-none mb-1">
                        Starting Time
                      </span>
                      <span className="text-sm font-bold text-kishtwar-green-900">
                        {event.startTime}
                      </span>
                    </div>
                  </div>
                )}

                {/* Location */}
                {event.location && (
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-xl bg-kishtwar-green-50 text-kishtwar-green-600 shrink-0">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-semibold block leading-none mb-1">
                        Venue Location
                      </span>
                      <span className="text-sm font-bold text-kishtwar-green-900 whitespace-pre-line">
                        {event.location}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Registration / External Link CTA */}
              {event.registrationLink && (
                <a
                  href={event.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center space-x-1.5 py-3 rounded-xl bg-kishtwar-green-900 hover:bg-kishtwar-green-800 text-white font-serif font-bold text-sm shadow-md transition-all mt-4"
                >
                  <span>Register for Event</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>

            {/* Map Embed Card */}
            {hasGps && (
              <div className="bg-white rounded-3xl border border-kishtwar-cream-200 p-6 shadow-sm space-y-4">
                <h3 className="text-lg font-serif font-bold text-kishtwar-green-950 flex items-center space-x-2">
                  <Compass className="h-5 w-5 text-kishtwar-emerald" />
                  <span>Venue Map</span>
                </h3>
                <MapEmbed markers={markers} center={mapCenter} zoom={11} height="280px" />
                <div className="text-[10px] text-gray-400 text-center font-medium">
                  Coordinates: {event.gpsLat?.toString()}, {event.gpsLng?.toString()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
