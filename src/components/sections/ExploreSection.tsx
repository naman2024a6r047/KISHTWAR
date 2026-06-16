"use client";

import Link from "next/link";

const placesData = [
  {
    name: "Sinthan Top",
    subtitle: "Breathtaking Views",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=600",
    href: "/tourist-places/sinthan-top"
  },
  {
    name: "Warwan Valley",
    subtitle: "Heaven on Earth",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=600",
    href: "/tourist-places/warwan-valley"
  },
  {
    name: "Machail Mata Temple",
    subtitle: "A Sacred Journey",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&q=80&w=600",
    href: "/tourist-places/machail-mata-temple"
  },
  {
    name: "Kishtwar National Park",
    subtitle: "Wildlife & Biodiversity",
    image: "https://images.unsplash.com/photo-1602491453979-04a12e086302?auto=format&fit=crop&q=80&w=600",
    href: "/tourist-places/kishtwar-national-park"
  }
];

const newsData = [
  {
    title: "Machail Mata Yatra 2024 Dates",
    excerpt: "The annual Machail Mata Yatra will commence from 25th July 2024.",
    date: "May 20, 2024",
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=200",
    href: "/events/annual-holy-machail-mata-yatra"
  },
  {
    title: "Kishtwar Saffron Harvest Begins",
    excerpt: "Saffron harvest season has begun in higher reaches of Kishtwar.",
    date: "May 18, 2024",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=200",
    href: "/blog/saffron-of-kishtwar-the-red-gold"
  },
  {
    title: "New Trekking Route Opened",
    excerpt: "Paddar Valley to Janglar Trek route is now open for adventurers.",
    date: "May 15, 2024",
    image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&q=80&w=200",
    href: "/blog/ultimate-guide-trekking-paddar-valley"
  }
];

export default function ExploreSection() {
  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Responsive Outer Grid: 
            - Mobile: 1 column
            - Desktop: 12 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Explore Kishtwar - Full width on mobile/tablet, 50% width on desktop */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0a2916]">
                Explore Kishtwar
              </h2>
              <Link
                href="/tourist-places"
                className="text-xs font-bold text-kishtwar-green-700 hover:text-kishtwar-gold transition-colors"
              >
                View All
              </Link>
            </div>
            
            {/* 4-column grid on mobile too! */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {placesData.map((place, idx) => (
                <Link key={idx} href={place.href} className="group relative block h-[120px] sm:h-[180px] lg:h-[200px] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent z-10" />
                  <img
                    src={place.image}
                    alt={place.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 left-2 z-20 space-y-0.5 pr-1">
                    <h3 className="text-[9px] sm:text-sm font-serif font-bold text-white leading-tight">
                      {place.name}
                    </h3>
                    <p className="text-[7px] sm:text-[10px] text-white/70 font-medium leading-none">
                      {place.subtitle}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: About Kishtwar - Omitted on mobile/tablet, shown only on desktop */}
          <div className="hidden lg:block lg:col-span-3 space-y-4">
            <h2 className="text-2xl font-serif font-bold text-[#0a2916]">
              About Kishtwar
            </h2>
            
            <div className="bg-[#FAF8F5] rounded-2xl p-6 border border-gray-200/50 shadow-sm flex flex-col justify-between h-[200px] lg:h-[416px]">
              <div className="space-y-4">
                <p className="text-[13px] text-gray-700 leading-relaxed font-serif">
                  Kishtwar, the crown of Jammu & Kashmir, is famous for its breathtaking landscapes, rich culture, ancient history, and warm hospitality. Known as the Land of Sapphire and Saffron, it is a paradise for travelers, adventure seekers, and peace lovers.
                </p>
              </div>
              <div className="pt-4">
                <Link
                  href="/about"
                  className="inline-block px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg transition-colors font-sans"
                >
                  Read More
                </Link>
              </div>
            </div>
          </div>

          {/* Column 3: News & Events - Full width on mobile/tablet, 25% on desktop */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0a2916]">
                News & Events
              </h2>
              <Link
                href="/events"
                className="text-xs font-bold text-kishtwar-green-700 hover:text-kishtwar-gold transition-colors"
              >
                View All News
              </Link>
            </div>
            
            <div className="space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                {newsData.map((item, idx) => (
                  <Link key={idx} href={item.href} className="flex items-start space-x-3 group hover:opacity-90 transition-opacity pb-3 border-b border-gray-100 last:border-b-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover shrink-0 border border-gray-100"
                    />
                    <div className="flex flex-col space-y-0.5">
                      <h4 className="text-xs sm:text-sm font-sans font-bold text-gray-900 group-hover:text-kishtwar-gold transition-colors leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-gray-500 leading-tight">
                        {item.excerpt}
                      </p>
                      <span className="text-[9px] text-gray-400 font-medium mt-0.5">
                        🗓️ {item.date}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
