"use client";

import { motion } from "framer-motion";
import { MapPin, Compass, Home, Calendar, Landmark, Heart } from "lucide-react";

const stats = [
  { value: "100+", label: "Tourist Places", icon: MapPin },
  { value: "50+", label: "Trekking Routes", icon: Compass },
  { value: "35+", label: "Homestays", icon: Home },
  { value: "20+", label: "Festivals", icon: Calendar },
  { value: "Rich", label: "Culture & Heritage", icon: Landmark },
  { value: "Warm", label: "Hospitality", icon: Heart }
];

export default function StatsSection() {
  return (
    <section className="relative w-full py-4 sm:py-10 bg-[#042013] text-white overflow-hidden border-t border-white/5">
      {/* Subtle background overlay */}
      <div className="absolute inset-0 bg-black/15 z-0" />

      <div className="relative max-w-7xl mx-auto px-1 sm:px-6 lg:px-8 z-10">
        {/* Forced grid of 6 columns with vertical dividers across all viewport sizes */}
        <div className="grid grid-cols-6 divide-x divide-white/10">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="flex flex-col items-center justify-center text-center p-1 sm:p-4"
              >
                <div className="text-white/40 mb-1 sm:mb-2.5">
                  <Icon className="h-3.5 w-3.5 sm:h-5.5 sm:w-5.5 stroke-[1.25] text-white/50" />
                </div>
                <span className="text-xs sm:text-2xl font-serif font-bold text-[#c9a84c] leading-none">
                  {stat.value}
                </span>
                <span className="mt-1.5 text-[6px] sm:text-[10px] text-[#ebe5d0]/80 font-sans font-bold uppercase tracking-wider leading-none text-center">
                  {stat.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
