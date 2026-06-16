import Link from "next/link";
import { MapPin, Calendar, Star } from "lucide-react";
import type { PlaceWithCategory } from "@/types";
import { cn } from "@/lib/utils";
import BookmarkButton from "../common/BookmarkButton";

interface PlaceCardProps {
  place: PlaceWithCategory;
  saved?: boolean;
}

export default function PlaceCard({ place, saved = false }: PlaceCardProps) {
  return (
    <div className="group rounded-2xl overflow-hidden border border-kishtwar-cream-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full card-hover">
      {/* Image Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        <img
          src={place.featuredImage}
          alt={place.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Category Badge */}
        <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full bg-kishtwar-green-900/80 backdrop-blur-sm text-kishtwar-gold border border-kishtwar-green-800/40 uppercase tracking-wider">
          {place.category.name}
        </span>

        {/* Bookmark Action */}
        <div className="absolute top-3 right-3">
          <BookmarkButton
            initialSaved={saved}
            itemId={place.id}
            itemType="place"
            size="sm"
          />
        </div>

        {/* Rating Overlay */}
        {place.reviewCount > 0 && (
          <div className="absolute bottom-3 left-3 flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white border border-white/10 text-xs font-bold">
            <Star className="h-3.5 w-3.5 fill-kishtwar-saffron text-kishtwar-saffron shrink-0" />
            <span className="text-white">{Number(place.averageRating).toFixed(1)}</span>
            <span className="text-gray-300 font-medium">({place.reviewCount})</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          <Link href={`/tourist-places/${place.slug}`}>
            <h3 className="text-lg font-serif font-bold text-kishtwar-green-900 hover:text-kishtwar-gold transition-colors line-clamp-1">
              {place.name}
            </h3>
          </Link>
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {place.shortDescription || "Explore the scenic beauty and historic roots of this magnificent destination in Kishtwar."}
          </p>
        </div>

        {/* Footer info */}
        <div className="pt-4 mt-4 border-t border-kishtwar-cream-100 flex items-center justify-between text-xs text-gray-500 font-medium">
          {place.gpsLat && place.gpsLng ? (
            <div className="flex items-center space-x-1 text-kishtwar-green-700">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span>Location Map</span>
            </div>
          ) : (
            <div />
          )}

          <Link
            href={`/tourist-places/${place.slug}`}
            className="text-kishtwar-emerald hover:text-kishtwar-green-700 font-bold flex items-center space-x-1"
          >
            <span>Explore Details</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
