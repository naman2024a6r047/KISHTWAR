import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Link from "next/link";
import { Sparkles, Calendar, Heart, Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kishtwar Saffron & Paddar Sapphire | Kishtwar Tourism",
  description:
    "Discover Kishtwar's world-famous GI-tagged Saffron and the legendary cornflower blue Sapphires of Paddar Valley.",
};

export default function SaffronSapphirePage() {
  return (
    <main className="min-h-screen bg-kishtwar-cream/30 pb-16">
      {/* Banner / Header */}
      <section className="relative bg-kishtwar-green-900 text-white overflow-hidden py-16 sm:py-24">
        {/* Background Image / Overlay */}
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-15"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-kishtwar-green-950/50 via-kishtwar-green-900/90 to-kishtwar-green-900"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-kishtwar-gold/20 text-kishtwar-gold text-xs font-bold tracking-widest uppercase border border-kishtwar-gold/30">
            Natural Treasures
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight">
            Saffron & <span className="text-gradient-gold">Sapphires</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-300 leading-relaxed font-light font-sans">
            Delve into the stories of Kishtwar’s twin jewels: the rarest cornflower-blue sapphires of Paddar and the premium aroma-rich saffron of Pochhal.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-10">
        {/* Breadcrumbs */}
        <Breadcrumbs className="text-kishtwar-green-600 mb-6" />

        {/* Section 1: Kishtwar Saffron */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl border border-kishtwar-cream-200 p-6 sm:p-10 shadow-sm">
          {/* Text content */}
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-kishtwar-saffron">
                GI-Tagged Pride
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-kishtwar-green-950">
                Kishtwar Saffron — The Golden Spice
              </h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed font-light">
              Grown predominantly in the fertile, elevated plateaus of Pochhal, Matta, and surrounding villages in Kishtwar, our Saffron (*Crocus sativus*) is renowned for its intense coloring, therapeutic fragrance, and chemical purity. In 2023, Kishtwar Saffron was officially granted the **Geographical Indication (GI) Tag**, solidifying its rank alongside the world&apos;s finest spices.
            </p>
            
            {/* Quick stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-kishtwar-cream/55 border border-kishtwar-cream-200">
                <Calendar className="h-5 w-5 text-kishtwar-saffron mb-1.5" />
                <span className="text-[10px] text-gray-400 font-bold block uppercase">Harvest Season</span>
                <span className="text-xs font-bold text-kishtwar-green-900">Late Oct - Nov</span>
              </div>
              <div className="p-4 rounded-2xl bg-kishtwar-cream/55 border border-kishtwar-cream-200">
                <Sparkles className="h-5 w-5 text-kishtwar-gold mb-1.5" />
                <span className="text-[10px] text-gray-400 font-bold block uppercase">Aroma Index</span>
                <span className="text-xs font-bold text-kishtwar-green-900">Highest Crocin Levels</span>
              </div>
              <div className="p-4 rounded-2xl bg-kishtwar-cream/55 border border-kishtwar-cream-200">
                <Shield className="h-5 w-5 text-kishtwar-emerald mb-1.5" />
                <span className="text-[10px] text-gray-400 font-bold block uppercase">Quality Tag</span>
                <span className="text-xs font-bold text-kishtwar-green-900">GI Certified</span>
              </div>
            </div>
          </div>

          {/* Image content */}
          <div className="lg:col-span-5 h-72 sm:h-96 rounded-2xl overflow-hidden bg-gray-100 shadow-sm border border-kishtwar-cream-200 relative">
            <img
              src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80"
              alt="Saffron harvest fields in Pochhal"
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-[10px] font-semibold">
              Saffron Flower fields, Kishtwar
            </div>
          </div>
        </section>

        {/* Section 2: Paddar Sapphires */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl border border-kishtwar-cream-200 p-6 sm:p-10 shadow-sm">
          {/* Image Content */}
          <div className="lg:col-span-5 lg:order-last h-72 sm:h-96 rounded-2xl overflow-hidden bg-gray-100 shadow-sm border border-kishtwar-cream-200 relative">
            <img
              src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80"
              alt="Paddar sapphire crystals"
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-[10px] font-semibold">
              Premium Blue Sapphires of Paddar
            </div>
          </div>

          {/* Text content */}
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-kishtwar-sapphire">
                Legendary Gems
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-kishtwar-green-950">
                Paddar Sapphires — Cornflower Blue
              </h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed font-light">
              Mined in the rugged high-altitude terrains of Paddar Valley, at altitudes exceeding 4,500 meters, Paddar Sapphire crystals are famous globally for their signature **&quot;cornflower blue&quot;** hue and velvety, lustrous transparency. First discovered in 1881 following a landslide, these gems represent the absolute pinnacle of gemstone grades and are highly coveted by collectors and jewelers globally.
            </p>

            {/* Facts info */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start space-x-3 text-xs">
                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-bold text-kishtwar-green-900 block">Cornflower Blue Hue</span>
                  <span className="text-gray-500 font-light">Unique light dispersion gives Paddar sapphires their rich, velvety color profile.</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs">
                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                  <Heart className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-bold text-kishtwar-green-900 block">Paddar Mines Location</span>
                  <span className="text-gray-550 font-light">Located in the high alpine valleys near Sumcham village, Paddar District.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Explore Card Links */}
        <div className="bg-kishtwar-green-900 rounded-3xl p-8 text-center text-white border border-kishtwar-green-800 shadow-md space-y-4 max-w-xl mx-auto">
          <h4 className="text-xl font-serif font-bold">
            Plan a Visit to the Plateaus
          </h4>
          <p className="text-xs text-gray-300 leading-relaxed max-w-sm mx-auto font-light">
            Witness the saffron harvest fields during November or explore the wilderness of Paddar Valley.
          </p>
          <Link
            href="/tourist-places"
            className="inline-block px-6 py-2.5 rounded-xl bg-kishtwar-gold hover:bg-kishtwar-gold-light text-kishtwar-green-950 font-serif font-bold text-xs shadow-sm transition-all"
          >
            Find Places to Explore
          </Link>
        </div>
      </div>
    </main>
  );
}
