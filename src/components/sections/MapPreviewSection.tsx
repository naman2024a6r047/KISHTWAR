import type { MapMarker } from "@/types";
import MapEmbed from "../common/MapEmbed";
import Link from "next/link";
import { Map, ArrowRight } from "lucide-react";

interface MapPreviewSectionProps {
  markers: MapMarker[];
}

export default function MapPreviewSection({ markers }: MapPreviewSectionProps) {
  return (
    <section className="py-20 bg-kishtwar-cream-100 border-b border-kishtwar-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-kishtwar-green-50 text-kishtwar-green-900 border border-kishtwar-green-200/50 text-xs font-bold uppercase tracking-wider">
              <Map className="h-4 w-4 text-kishtwar-gold" />
              <span>Interactive Navigation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-kishtwar-green-900">
              Explore Kishtwar on Map
            </h2>
            <p className="text-base text-gray-500 font-medium">
              Locate tourist destinations, shrines, peaks, and key infrastructure on our map
            </p>
          </div>
          <Link
            href="/map"
            className="inline-flex items-center text-sm font-bold text-kishtwar-emerald hover:text-kishtwar-green-700 transition-colors uppercase tracking-wider gap-1.5 shrink-0"
          >
            <span>View Fullscreen Map</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Map Container wrapper */}
        <div className="bg-white p-4 rounded-3xl shadow-md border border-kishtwar-cream-200">
          <MapEmbed markers={markers} height="450px" />
        </div>
      </div>
    </section>
  );
}
