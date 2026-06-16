import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Link from "next/link";
import { Compass, Calendar, Users, Map, Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Kishtwar - Geography, History & Climate | Kishtwar Tourism",
  description:
    "Learn about Kishtwar District, its history, geography, sub-valleys (Paddar, Warwan, Dachhan), and administrative profile.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-kishtwar-cream/30 pb-16">
      {/* Banner / Header */}
      <section className="relative bg-kishtwar-green-900 text-white overflow-hidden py-16 sm:py-24">
        {/* Background Image / Overlay */}
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-15"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-kishtwar-green-950/50 via-kishtwar-green-900/90 to-kishtwar-green-900"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-kishtwar-gold/20 text-kishtwar-gold text-xs font-bold tracking-widest uppercase border border-kishtwar-gold/30">
            District Profile
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight">
            About <span className="text-gradient-gold">Kishtwar District</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-300 leading-relaxed font-light font-sans">
            Known historically as the &apos;Land of Saffron, Sapphire & Shrines&apos;, Kishtwar is one of the most mountainous and scenic districts of Jammu & Kashmir.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-10">
        {/* Breadcrumbs */}
        <Breadcrumbs className="text-kishtwar-green-600 mb-6" />

        {/* Section 1: Introduction */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl border border-kishtwar-cream-200 p-6 sm:p-10 shadow-sm">
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-kishtwar-green-950">
              Geography & Mountain Valleys
            </h2>
            <p className="text-sm text-gray-650 leading-relaxed font-light">
              Kishtwar District was carved out from the erstwhile Doda district in 2007. Bordered by Ladakh to the east and Himachal Pradesh to the south, the district is characterized by rugged mountainous ranges, alpine pastures, and fast-flowing rivers like the **Chenab (Chandrabhaga)**. The terrain is divided into highly isolated yet stunning sub-valleys: **Warwan Valley**, **Marwah Valley**, **Dachhan Valley**, **Chatroo**, and the sapphire-rich **Paddar Valley**.
            </p>
            <p className="text-sm text-gray-650 leading-relaxed font-light">
              A large part of the district is covered under the **Kishtwar High Altitude National Park**, which is home to rare Himalayan fauna such as the snow leopard, musk deer, and brown bear.
            </p>
          </div>

          <div className="lg:col-span-5 h-72 sm:h-96 rounded-2xl overflow-hidden bg-gray-100 shadow-sm border border-kishtwar-cream-200 relative">
            <img
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"
              alt="Mountain range of Kishtwar National Park"
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-[10px] font-semibold">
              Kishtwar Mountain Valleys
            </div>
          </div>
        </section>

        {/* Quick Facts Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-kishtwar-cream-200 p-5 shadow-sm text-center space-y-2">
            <div className="w-10 h-10 bg-kishtwar-green-50 text-kishtwar-green-600 rounded-xl flex items-center justify-center mx-auto border border-kishtwar-green-100">
              <Map className="h-5 w-5" />
            </div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Area</span>
            <span className="text-base font-bold text-kishtwar-green-950">7,737 sq km</span>
          </div>

          <div className="bg-white rounded-2xl border border-kishtwar-cream-200 p-5 shadow-sm text-center space-y-2">
            <div className="w-10 h-10 bg-kishtwar-green-50 text-kishtwar-green-600 rounded-xl flex items-center justify-center mx-auto border border-kishtwar-green-100">
              <Users className="h-5 w-5" />
            </div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Population</span>
            <span className="text-base font-bold text-kishtwar-green-950">~231,000</span>
          </div>

          <div className="bg-white rounded-2xl border border-kishtwar-cream-200 p-5 shadow-sm text-center space-y-2">
            <div className="w-10 h-10 bg-kishtwar-green-50 text-kishtwar-green-600 rounded-xl flex items-center justify-center mx-auto border border-kishtwar-green-100">
              <Compass className="h-5 w-5" />
            </div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Average Altitude</span>
            <span className="text-base font-bold text-kishtwar-green-950">1,631m to 6,000m+</span>
          </div>

          <div className="bg-white rounded-2xl border border-kishtwar-cream-200 p-5 shadow-sm text-center space-y-2">
            <div className="w-10 h-10 bg-kishtwar-green-50 text-kishtwar-green-600 rounded-xl flex items-center justify-center mx-auto border border-kishtwar-green-100">
              <Shield className="h-5 w-5" />
            </div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">GI Agronomic crops</span>
            <span className="text-base font-bold text-kishtwar-green-950">Saffron & Sapphire</span>
          </div>
        </div>

        {/* Section 2: Historical Context */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl border border-kishtwar-cream-200 p-6 sm:p-10 shadow-sm">
          <div className="lg:col-span-5 h-72 sm:h-96 rounded-2xl overflow-hidden bg-gray-100 shadow-sm border border-kishtwar-cream-200 relative lg:order-last">
            <img
              src="https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80"
              alt="Historical fortress ruins in Kishtwar"
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-[10px] font-semibold">
              Kishtwar Fort ruins
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-kishtwar-green-950">
              Historical Milestones & Rulers
            </h2>
            <p className="text-sm text-gray-655 leading-relaxed font-light">
              Kishtwar finds mention in Kalhana&apos;s epic Sanskrit chronicle **Rajatarangini** as *Kashthavata*. In the medieval period, it was ruled by independent Hindu Rajas until Raja Kirat Singh converted to Islam in 1664 under the influence of the Sufi saint Syed Shah Farid-ud-Din. In 1821, Maharaja Ranjit Singh&apos;s Dogra General **Zorawar Singh** annexed Kishtwar, making it a pivotal base for Dogra military campaigns into Ladakh and Tibet.
            </p>
            <p className="text-sm text-gray-655 leading-relaxed font-light">
              This synthesis of history gave birth to the harmonious, multi-ethnic society of Kishtwar today, where Kashmiri, Kishtwari, and Dogri languages are spoken in peace.
            </p>
          </div>
        </section>

        {/* Closing CTA */}
        <div className="bg-kishtwar-green-900 rounded-3xl p-8 text-center text-white border border-kishtwar-green-800 shadow-md space-y-4 max-w-xl mx-auto">
          <h4 className="text-xl font-serif font-bold">
            Start Planning Your Journey
          </h4>
          <p className="text-xs text-gray-300 leading-relaxed max-w-sm mx-auto font-light">
            Read travel guides written by contributors or find places to visit in Kishtwar.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/tourist-places"
              className="px-5 py-2.5 rounded-xl bg-kishtwar-gold hover:bg-kishtwar-gold-light text-kishtwar-green-950 font-serif font-bold text-xs shadow-sm transition-all"
            >
              Places to Visit
            </Link>
            <Link
              href="/blog"
              className="px-5 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-white font-serif font-bold text-xs transition-all"
            >
              Read Stories
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
