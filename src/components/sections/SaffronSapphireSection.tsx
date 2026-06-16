import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function SaffronSapphireSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-kishtwar-green-50 text-kishtwar-green-900 border border-kishtwar-green-200/50 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-kishtwar-gold" />
            <span>Valuable Treasures</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-kishtwar-green-900">
            Saffron & Sapphire
          </h2>
          <p className="text-sm sm:text-base text-gray-500 font-medium">
            Discover the legendary treasures that have put Kishtwar on the global map
          </p>
        </div>

        {/* Dual Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Saffron Card */}
          <div className="group relative rounded-3xl overflow-hidden shadow-lg border border-orange-100 bg-gradient-to-br from-orange-50/50 to-white p-8 sm:p-12 flex flex-col justify-between h-[380px] card-hover">
            {/* Background design elements */}
            <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-orange-100/50 filter blur-3xl group-hover:bg-orange-200/50 transition-colors duration-500" />
            
            <div className="space-y-4 relative z-10">
              <span className="px-3.5 py-1 text-xs font-bold rounded-full bg-orange-100 text-orange-800 uppercase tracking-wider">
                The Purple Harvest
              </span>
              <h3 className="text-2xl font-serif font-bold text-gray-900 group-hover:text-orange-700 transition-colors">
                Kishtwar Saffron
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                Renowned as one of the most aromatic and premium saffrons in the world, the purple crocus flowers bloom on the uplands of Kishtwar in late autumn. The crimson stigmas are handpicked with utmost care by local farmers.
              </p>
            </div>

            <div className="pt-6 relative z-10">
              <Link
                href="/explore/kishtwar-saffron"
                className="inline-flex items-center text-sm font-bold text-orange-600 hover:text-orange-800 transition-all gap-1 group-hover:translate-x-1 duration-200"
              >
                <span>Read Saffron Story</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Sapphire Card */}
          <div className="group relative rounded-3xl overflow-hidden shadow-lg border border-blue-100 bg-gradient-to-br from-blue-50/50 to-white p-8 sm:p-12 flex flex-col justify-between h-[380px] card-hover">
            {/* Background design elements */}
            <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-blue-100/50 filter blur-3xl group-hover:bg-blue-200/50 transition-colors duration-500" />
            
            <div className="space-y-4 relative z-10">
              <span className="px-3.5 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800 uppercase tracking-wider">
                The Blue Gem
              </span>
              <h3 className="text-2xl font-serif font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                Paddar Sapphire
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                Found at heights of over 4,500 meters in the remote Mines of Sumcham in Paddar Valley, Kishtwar, the Paddar sapphire is celebrated globally for its unique peacock-neck blue color and incomparable clarity.
              </p>
            </div>

            <div className="pt-6 relative z-10">
              <Link
                href="/explore/paddar-sapphire"
                className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 transition-all gap-1 group-hover:translate-x-1 duration-200"
              >
                <span>Read Sapphire Story</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
