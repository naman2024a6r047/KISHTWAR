import type { PlaceWithCategory } from "@/types";
import Link from "next/link";
import { ArrowRight, Landmark } from "lucide-react";
import PlaceCard from "../cards/PlaceCard";

interface CultureSectionProps {
  places: PlaceWithCategory[];
}

export default function CultureSection({ places }: CultureSectionProps) {
  // Filter for religious/historical places if available, otherwise fallback
  const culturalPlaces = places
    .filter((p) => p.category.slug === "religious-sites" || p.category.slug === "historical-sites")
    .slice(0, 2);

  const displayPlaces = culturalPlaces.length > 0 ? culturalPlaces : places.slice(0, 2);

  if (displayPlaces.length === 0) return null;

  return (
    <section className="py-20 bg-kishtwar-cream-100 border-y border-kishtwar-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Description Block */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-kishtwar-green-50 text-kishtwar-green-900 border border-kishtwar-green-200/50 text-xs font-bold uppercase tracking-wider">
              <Landmark className="h-4 w-4 text-kishtwar-gold" />
              <span>Heritage & Spirituality</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-kishtwar-green-900">
              A Blend of Devotion and Historic Legacy
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium">
              Kishtwar is widely revered as a sacred land of shrines and historic temples. It represents a beautiful syncretic cultural tapestry where the holy shrines of Sufi Saints Shah Asrar-ud-Din and Shah Farid-ud-Din coexist in the heart of the town, alongside ancient temples like Sarthal Devi and Chandi Mata in Paddar.
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Explore the pilgrimage routes, annual Yatras, Urs congregations, and the age-old folklore that binds the communities of this mountainous enclave.
            </p>
            <div className="pt-2">
              <Link
                href="/tourist-places?category=religious-sites"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-bold rounded-full text-white bg-kishtwar-green-900 hover:bg-kishtwar-green-800 transition-all shadow-md font-serif"
              >
                <span>View Shrines & Temples</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {displayPlaces.map((place) => (
              <div key={place.id}>
                <PlaceCard place={place} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
