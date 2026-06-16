"use client";

import Link from "next/link";
import { Mountain, Home, Compass, Landmark, Sparkles, Map } from "lucide-react";

const quickNavItems = [
  {
    name: "Tourist Places",
    subtitle: "Explore Top Destinations",
    href: "/tourist-places",
    icon: Mountain,
    color: "text-[#c9a84c]",
    className: "col-span-1 border-r border-b border-gray-200/60 lg:border-b-0 lg:col-span-1"
  },
  {
    name: "Hotels & Stays",
    subtitle: "Find Best Places to Stay",
    href: "/tourist-places?category=hotels",
    icon: Home,
    color: "text-[#c9a84c]",
    className: "col-span-1 border-r border-b border-gray-200/60 lg:border-b-0 lg:col-span-1"
  },
  {
    name: "Adventure",
    subtitle: "Trekking, Camping & More",
    href: "/tourist-places?category=adventure-spots",
    icon: Compass,
    color: "text-[#c9a84c]",
    className: "col-span-1 border-r border-b border-gray-200/60 lg:border-b-0 lg:col-span-1"
  },
  {
    name: "Culture",
    subtitle: "Heritage, Festivals & Food",
    href: "/culture-heritage",
    icon: Landmark,
    color: "text-[#c9a84c]",
    className: "col-span-1 border-b border-gray-200/60 lg:border-b-0 lg:border-r lg:col-span-1"
  },
  {
    name: "Saffron & Sapphire",
    subtitle: "Our Pride & Heritage",
    href: "/saffron-sapphire",
    icon: Sparkles,
    color: "text-purple-600",
    className: "col-span-2 border-r border-gray-200/60 lg:col-span-1 lg:border-r"
  },
  {
    name: "Interactive Map",
    subtitle: "Explore Kishtwar",
    href: "/map",
    icon: Map,
    color: "text-[#c9a84c]",
    className: "col-span-2 lg:col-span-1"
  }
];

export default function QuickNavSection() {
  return (
    <section className="relative z-30 w-full py-4 bg-[#FAF8F5] border-t border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* White rounded container matching screenshot */}
        <div className="bg-white rounded-2xl border border-gray-200/70 shadow-md overflow-hidden grid grid-cols-4 lg:grid-cols-6">
          {quickNavItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={item.href}
                className={`flex flex-col items-center justify-center p-3.5 sm:p-5 text-center hover:opacity-85 transition-opacity duration-300 group ${item.className}`}
              >
                <div className="p-1 mb-1 bg-transparent rounded-lg shrink-0">
                  <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${item.color} stroke-[1.5] group-hover:scale-105 transition-transform`} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] sm:text-xs font-sans font-bold text-[#0f3820] leading-none group-hover:text-kishtwar-gold transition-colors">
                    {item.name}
                  </span>
                  <span className="text-[8px] text-gray-400 font-medium tracking-tight mt-1 leading-none">
                    {item.subtitle}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
