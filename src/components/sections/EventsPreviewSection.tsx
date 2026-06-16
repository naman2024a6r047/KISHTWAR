import type { EventWithCategory } from "@/types";
import EventCard from "../cards/EventCard";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

interface EventsPreviewSectionProps {
  events: EventWithCategory[];
}

export default function EventsPreviewSection({ events }: EventsPreviewSectionProps) {
  if (!events || events.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-kishtwar-green-50 text-kishtwar-green-900 border border-kishtwar-green-200/50 text-xs font-bold uppercase tracking-wider">
              <Calendar className="h-4 w-4 text-kishtwar-gold" />
              <span>Events & Festivals</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-kishtwar-green-900">
              Happening in Kishtwar
            </h2>
            <p className="text-base text-gray-500 font-medium">
              Join upcoming festivals, pilgrimages, adventure camps, and administrative events in the district
            </p>
          </div>
          <Link
            href="/events"
            className="inline-flex items-center text-sm font-bold text-kishtwar-emerald hover:text-kishtwar-green-700 transition-colors uppercase tracking-wider gap-1.5 shrink-0"
          >
            <span>View All Events</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {events.slice(0, 2).map((event) => (
            <div key={event.id}>
              <EventCard event={event} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
