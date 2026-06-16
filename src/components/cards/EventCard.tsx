import Link from "next/link";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import type { EventWithCategory } from "@/types";
import { format } from "date-fns";
import BookmarkButton from "../common/BookmarkButton";

interface EventCardProps {
  event: EventWithCategory;
  saved?: boolean;
}

export default function EventCard({ event, saved = false }: EventCardProps) {
  const startDate = new Date(event.startDate);
  const eventDay = format(startDate, "dd");
  const eventMonth = format(startDate, "MMM");
  const eventYear = format(startDate, "yyyy");
  const formattedDate = event.endDate
    ? `${format(startDate, "MMM dd")} - ${format(new Date(event.endDate), "MMM dd, yyyy")}`
    : format(startDate, "MMMM dd, yyyy");

  return (
    <div className="group rounded-2xl overflow-hidden border border-kishtwar-cream-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row h-full card-hover">
      {/* Banner / Date Badge Container */}
      <div className="relative h-48 md:h-auto md:w-56 shrink-0 bg-gray-100 overflow-hidden">
        <img
          src={event.banner || "/images/placeholders/event.jpg"}
          alt={event.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Dynamic Date Calendar Badge */}
        <div className="absolute top-3 left-3 flex flex-col items-center justify-center h-14 w-12 rounded-xl bg-white text-kishtwar-green-950 shadow-md border border-gray-100 font-serif">
          <span className="text-[10px] uppercase font-bold text-kishtwar-emerald tracking-wide">
            {eventMonth}
          </span>
          <span className="text-xl font-bold leading-none -mt-0.5">
            {eventDay}
          </span>
        </div>

        {/* Bookmark Action */}
        <div className="absolute top-3 right-3">
          <BookmarkButton
            initialSaved={saved}
            itemId={event.id}
            itemType="event"
            size="sm"
          />
        </div>

        {/* Category Label */}
        <span className="absolute bottom-3 left-3 px-2.5 py-0.5 text-[10px] font-bold rounded bg-black/60 backdrop-blur-sm text-white uppercase tracking-wider">
          {event.category.name}
        </span>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Calendar Detail */}
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-kishtwar-emerald">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formattedDate}</span>
          </div>

          <Link href={`/events/${event.slug}`}>
            <h3 className="text-lg font-serif font-bold text-kishtwar-green-900 hover:text-kishtwar-gold transition-colors line-clamp-1 leading-snug">
              {event.name}
            </h3>
          </Link>

          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {event.shortDescription || "Join this exciting event happening in Kishtwar. Discover cultural programs, local festivals, and seasonal activities."}
          </p>
        </div>

        {/* Footer Details */}
        <div className="pt-3 border-t border-kishtwar-cream-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
          {event.location ? (
            <div className="flex items-center space-x-1 text-gray-500 font-semibold">
              <MapPin className="h-3.5 w-3.5 text-kishtwar-gold shrink-0" />
              <span className="truncate max-w-[200px]">{event.location}</span>
            </div>
          ) : (
            <div />
          )}

          <Link
            href={`/events/${event.slug}`}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-full text-white bg-kishtwar-green-900 hover:bg-kishtwar-green-800 transition-colors uppercase tracking-wider w-fit shrink-0 font-serif"
          >
            <span>Event Details</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
