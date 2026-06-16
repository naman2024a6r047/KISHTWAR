import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Link from "next/link";
import { Landmark, Sparkles, Compass, Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Culture, Heritage & Pilgrimages | Kishtwar Tourism",
  description:
    "Explore the rich cultural tapestry of Kishtwar, from the sacred Machail Yatra to the historical Sufi shrines of Shah Asrar-ud-Din.",
};

export default function CultureHeritagePage() {
  return (
    <main className="min-h-screen bg-kishtwar-cream/30 pb-16">
      {/* Banner / Header */}
      <section className="relative bg-kishtwar-green-900 text-white overflow-hidden py-16 sm:py-24">
        {/* Background Image / Overlay */}
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-15"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-kishtwar-green-950/50 via-kishtwar-green-900/90 to-kishtwar-green-900"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-kishtwar-gold/20 text-kishtwar-gold text-xs font-bold tracking-widest uppercase border border-kishtwar-gold/30">
            Harmonious Tapestry
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight">
            Culture & <span className="text-gradient-gold">Heritage</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-300 leading-relaxed font-light font-sans">
            Uncover the unique blending of ancient Dogra traditions and rich Kashmiri culture, marked by sacred shrines, mountain yatras, and historical syncretism.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-10">
        {/* Breadcrumbs */}
        <Breadcrumbs className="text-kishtwar-green-600 mb-6" />

        {/* Section 1: Harmonious Pilgrimages */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl border border-kishtwar-cream-200 p-6 sm:p-10 shadow-sm">
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-kishtwar-gold">
                Syncretic Roots
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-kishtwar-green-950">
                Land of Shrines & Pilgrimages
              </h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed font-light">
              Kishtwar is historically celebrated as a sanctuary of religious harmony. It hosts the starting trails of the legendary **Chandi Mata Machail Yatra**, drawing hundreds of thousands of Hindu devotees to the remote Paddar valley every August. Simultaneously, it holds the highly revered historical shrines of Sufi saints **Hazrat Shah Asrar-ud-Din Baghdadi** and **Hazrat Shah Farid-ud-Din Baghdadi**, which serve as spiritual epicenters for all local communities.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start space-x-2 text-xs">
                <Landmark className="h-4.5 w-4.5 text-kishtwar-emerald shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-kishtwar-green-900 block">Machail Chandi Yatra</span>
                  <span className="text-gray-500 font-light font-sans">Annual mountain pilgrimage through scenic valleys of Paddar to Chandi Mata Temple.</span>
                </div>
              </div>
              <div className="flex items-start space-x-2 text-xs">
                <Landmark className="h-4.5 w-4.5 text-kishtwar-saffron shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-kishtwar-green-900 block">Astan-e-Faridia & Asraria</span>
                  <span className="text-gray-550 font-light">Centuries-old Sufi shrines situated in Kishtwar town representing spiritual peace.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 h-72 sm:h-96 rounded-2xl overflow-hidden bg-gray-100 shadow-sm border border-kishtwar-cream-200 relative">
            <img
              src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80"
              alt="Historical Shrine in Kishtwar"
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-[10px] font-semibold">
              Pilgrimage & Sacred Shrines
            </div>
          </div>
        </section>

        {/* Section 2: Folk arts & local festivals */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl border border-kishtwar-cream-200 p-6 sm:p-10 shadow-sm">
          <div className="lg:col-span-5 lg:order-last h-72 sm:h-96 rounded-2xl overflow-hidden bg-gray-100 shadow-sm border border-kishtwar-cream-200 relative">
            <img
              src="https://images.unsplash.com/photo-1583089892943-e02e5b017b6a?auto=format&fit=crop&w=600&q=80"
              alt="Cultural Folk Dance of Kishtwar"
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-[10px] font-semibold">
              Folk Performance, Kud Dance
            </div>
          </div>

          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-kishtwar-saffron">
                Art & Performance
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-kishtwar-green-950">
                Folk Dances, Music & Handloom Crafts
              </h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed font-light">
              The mountain lifestyle of Kishtwar has shaped vibrant art forms. The **Kud Dance**, performed during local fairs to propitiate devtas, is marked by rhythmic movements and blowing of massive brass trumpets. The Kashmiri **Bhand Pather** (folk theatre) is regularly staged in agrarian villages. Local handloom weavers in Kishtwar craft premium woolen blankets (*charas*) and fine embroidery that have been passed down for generations.
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4.5 w-4.5 text-kishtwar-gold shrink-0" />
                <span className="font-semibold text-kishtwar-green-950">Kud Dance & Dhambali</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4.5 w-4.5 text-kishtwar-gold shrink-0" />
                <span className="font-semibold text-kishtwar-green-950">Local Wool Handloom & Wooden Crafts</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTAs */}
        <div className="bg-kishtwar-green-900 rounded-3xl p-8 text-center text-white border border-kishtwar-green-800 shadow-md space-y-4 max-w-xl mx-auto">
          <h4 className="text-xl font-serif font-bold">
            Experience the Heritage Firsthand
          </h4>
          <p className="text-xs text-gray-300 leading-relaxed max-w-sm mx-auto font-light">
            Check our events calendar to see dates for upcoming festivals, yatra dates, and cultural programs.
          </p>
          <Link
            href="/events"
            className="inline-block px-6 py-2.5 rounded-xl bg-kishtwar-gold hover:bg-kishtwar-gold-light text-kishtwar-green-950 font-serif font-bold text-xs shadow-sm transition-all"
          >
            Check Events Calendar
          </Link>
        </div>
      </div>
    </main>
  );
}
