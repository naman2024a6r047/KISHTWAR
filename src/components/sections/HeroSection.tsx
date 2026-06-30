"use client";

import { useState, useEffect, useCallback } from "react";
import type { HeroSlideData } from "@/types";
import { Users, Maximize, Mountain, MessageSquare, Calendar, ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface HeroSectionProps {
  slides: HeroSlideData[];
}

export default function HeroSection({ slides }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  // Graceful fallback for broken images
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    target.style.display = "none";
    if (target.parentElement) {
      target.parentElement.style.background = "linear-gradient(135deg, #0a2916 0%, #134328 50%, #1a5c38 100%)";
    }
  };

  const handleNext = useCallback(() => {
    if (!slides || slides.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides]);

  const handlePrev = useCallback(() => {
    if (!slides || slides.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides]);

  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const interval = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [slides, handleNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  return (
    <section 
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      /* 
        CRITICAL MOBILE REQUIREMENT:
        - Occupies exactly 55-60% of the mobile viewport height (58vh)
        - Height-capped min-height of 460px to prevent clipping of texts
        - Rounded bottom corners (rounded-b-[28px] sm:rounded-b-[32px])
        - Overflow hidden to mask sliding background scale animations
      */
      className="relative w-full h-[58vh] min-h-[460px] lg:h-[100dvh] lg:min-h-[650px] rounded-b-[28px] sm:rounded-b-[32px] lg:rounded-none overflow-hidden bg-black text-white z-10 flex items-center justify-center pt-16 lg:pt-0"
    >
      
      {/* Background Slideshow */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        {slides && slides.length > 0 ? (
          slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
                index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {/* 
                CRITICAL REQUIREMENT: Dark gradient overlay
                - Top: rgba(0,0,0,0.35)
                - Bottom: rgba(0,0,0,0.65)
              */}
              <div 
                className="absolute inset-0 z-10" 
                style={{
                  background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.45) 50%, rgba(0, 0, 0, 0.65) 100%)"
                }}
              />
              <img
                src={slide.backgroundImage}
                alt={slide.title || "Kishtwar Landscape"}
                className="w-full h-full object-cover scale-105 transition-transform duration-[6000ms] ease-out"
                style={{
                  transform: index === currentIndex ? "scale(1.05) translate(1px, 1px)" : "scale(1.0)"
                }}
                onError={handleImageError}
              />
            </div>
          ))
        ) : (
          <div className="absolute inset-0">
            <div 
              className="absolute inset-0 z-10" 
              style={{
                background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.45) 50%, rgba(0, 0, 0, 0.65) 100%)"
              }}
            />
            <img
              src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1920"
              alt="Default Kishtwar Landscape"
              className="w-full h-full object-cover scale-105"
              onError={handleImageError}
            />
          </div>
        )}
      </div>

      {/* Main Grid Content */}
      <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 z-20 flex flex-col justify-center h-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-12 items-center">
          
          {/* Left Column: Text & Metrics */}
          <div className="lg:col-span-7 flex flex-col space-y-3 sm:space-y-6 lg:space-y-8 text-center lg:text-left mt-2 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-1 sm:space-y-2.5"
            >
              <p className="text-xs sm:text-lg lg:text-2xl font-serif italic text-kishtwar-cream-100/90 font-medium">
                Welcome to
              </p>
              <h1 className="text-3xl sm:text-6xl md:text-7.5xl lg:text-8.5xl font-serif font-bold tracking-tight text-white drop-shadow-xl leading-none">
                Kishtwar
              </h1>
              <h2 className="text-[10px] sm:text-xl lg:text-2xl font-serif text-white/90 font-medium tracking-wide drop-shadow-md">
                Land of Sapphire, Saffron & Shrines
              </h2>

              {/* Diamond Separator */}
              <div className="flex items-center justify-center lg:justify-start py-1 max-w-[240px] sm:max-w-[320px] mx-auto lg:mx-0 opacity-80">
                <div className="h-[1px] flex-1 bg-white/20" />
                <span className="mx-2 text-[8px] text-kishtwar-gold-light leading-none">❖</span>
                <div className="h-[1px] flex-1 bg-white/20" />
              </div>
            </motion.div>

            {/* Metrics Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="grid grid-cols-5 gap-1 py-3 border-t border-b border-white/10"
            >
              {/* Population */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-0.5">
                <Users className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5 text-kishtwar-gold shrink-0 opacity-80" />
                <div className="flex flex-col">
                  <span className="text-[6.5px] sm:text-[9px] font-sans font-bold uppercase tracking-wider text-white/50 leading-none">Population</span>
                  <span className="text-[8.5px] sm:text-[13px] font-sans font-bold text-white mt-0.5 leading-tight">2.35 Lakhs+</span>
                </div>
              </div>

              {/* Area */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-0.5">
                <Maximize className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5 text-kishtwar-gold shrink-0 opacity-80" />
                <div className="flex flex-col">
                  <span className="text-[6.5px] sm:text-[9px] font-sans font-bold uppercase tracking-wider text-white/50 leading-none">Area</span>
                  <span className="text-[8.5px] sm:text-[13px] font-sans font-bold text-white mt-0.5 leading-tight">8,098 km²</span>
                </div>
              </div>

              {/* Elevation */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-0.5">
                <Mountain className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5 text-kishtwar-gold shrink-0 opacity-80" />
                <div className="flex flex-col">
                  <span className="text-[6.5px] sm:text-[9px] font-sans font-bold uppercase tracking-wider text-white/50 leading-none">Elevation</span>
                  <span className="text-[8.5px] sm:text-[13px] font-sans font-bold text-white mt-0.5 leading-tight">1,650 m</span>
                </div>
              </div>

              {/* Languages */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-0.5">
                <MessageSquare className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5 text-kishtwar-gold shrink-0 opacity-80" />
                <div className="flex flex-col">
                  <span className="text-[6.5px] sm:text-[9px] font-sans font-bold uppercase tracking-wider text-white/50 leading-none">Languages</span>
                  <span className="text-[7.5px] sm:text-[11px] font-sans font-bold text-white mt-0.5 leading-tight">Kishtwari, Hindi,<br />Urdu, Kashmiri</span>
                </div>
              </div>

              {/* District Formed */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-0.5">
                <Calendar className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5 text-kishtwar-gold shrink-0 opacity-80" />
                <div className="flex flex-col">
                  <span className="text-[6.5px] sm:text-[9px] font-sans font-bold uppercase tracking-wider text-white/50 leading-none">District Formed</span>
                  <span className="text-[8.5px] sm:text-[13px] font-sans font-bold text-white mt-0.5 leading-tight">2007</span>
                </div>
              </div>
            </motion.div>

            {/* Action CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-row items-center justify-center lg:justify-start gap-3 w-full"
            >
              <Link
                href="/tourist-places"
                className="flex-1 lg:flex-initial px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-lg text-[10px] sm:text-xs font-sans font-bold text-white bg-[#032013]/90 border border-white/10 hover:bg-[#06331f] hover:border-white transition-all shadow-lg flex items-center justify-center gap-1.5"
              >
                <span>Explore Kishtwar</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/videos"
                className="flex-1 lg:flex-initial px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-lg text-[10px] sm:text-xs font-sans font-bold text-white bg-transparent border border-white/30 hover:bg-white/10 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Watch Video</span>
                <PlayCircle className="h-3.5 w-3.5 fill-none" />
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Kishtwar SVG District Map (Hidden on mobile) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="hidden lg:flex lg:col-span-5 items-center justify-center relative w-full h-[500px]"
          >
            <div className="w-full h-full max-w-[480px] relative">
              <svg viewBox="0 0 600 600" className="w-full h-full drop-shadow-2xl select-none">
                <path 
                  d="M 220 50 
                     C 280 60, 320 30, 390 80 
                     C 430 110, 480 90, 520 150 
                     C 550 200, 530 280, 560 330 
                     C 580 370, 530 450, 490 480 
                     C 460 500, 430 550, 380 540 
                     C 320 530, 300 480, 270 470 
                     C 230 460, 200 510, 160 490 
                     C 120 470, 130 410, 110 370 
                     C 90 330, 70 290, 100 240 
                     C 120 200, 150 180, 170 120 
                     C 190 70, 180 40, 220 50 Z" 
                  fill="#134328" 
                  fillOpacity="0.75" 
                  stroke="#c9a84c" 
                  strokeWidth="2.5" 
                />
                <path
                  d="M 240 120 L 280 200 L 260 310 L 450 330 L 490 410 L 400 500"
                  fill="none"
                  stroke="#c9a84c"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  className="opacity-70"
                />
                {/* Pins */}
                <g className="cursor-pointer group">
                  <circle cx="240" cy="120" r="5" fill="#dfc77a" />
                  <circle cx="240" cy="120" r="10" stroke="#dfc77a" strokeWidth="1" fill="none" className="animate-ping" style={{ animationDuration: '3s' }} />
                  <text x="250" y="125" className="fill-white font-sans text-xs font-semibold drop-shadow-md group-hover:fill-kishtwar-gold transition-colors">Sinthan Top</text>
                </g>
                <g className="cursor-pointer group">
                  <circle cx="280" cy="200" r="5" fill="#dfc77a" />
                  <circle cx="280" cy="200" r="10" stroke="#dfc77a" strokeWidth="1" fill="none" className="animate-ping" style={{ animationDuration: '3.5s' }} />
                  <text x="290" y="205" className="fill-white font-sans text-xs font-semibold drop-shadow-md group-hover:fill-kishtwar-gold transition-colors">Chatroo</text>
                </g>
                <g className="cursor-pointer group">
                  <circle cx="260" cy="310" r="6" fill="#dfc77a" />
                  <circle cx="260" cy="310" r="12" stroke="#dfc77a" strokeWidth="1.5" fill="none" className="animate-ping" style={{ animationDuration: '2.5s' }} />
                  <text x="272" y="315" className="fill-white font-sans text-xs font-bold drop-shadow-md group-hover:fill-kishtwar-gold transition-colors">Kishtwar</text>
                </g>
                <g className="cursor-pointer group">
                  <circle cx="450" cy="330" r="5" fill="#dfc77a" />
                  <circle cx="450" cy="330" r="10" stroke="#dfc77a" strokeWidth="1" fill="none" className="animate-ping" style={{ animationDuration: '4s' }} />
                  <text x="460" y="335" className="fill-white font-sans text-xs font-semibold drop-shadow-md group-hover:fill-kishtwar-gold transition-colors">Paddar</text>
                </g>
                <g className="cursor-pointer group">
                  <circle cx="490" cy="410" r="5" fill="#dfc77a" />
                  <circle cx="490" cy="410" r="10" stroke="#dfc77a" strokeWidth="1" fill="none" className="animate-ping" style={{ animationDuration: '3s' }} />
                  <text x="500" y="415" className="fill-white font-sans text-xs font-semibold drop-shadow-md group-hover:fill-kishtwar-gold transition-colors">Machail</text>
                </g>
                <g className="cursor-pointer group">
                  <circle cx="400" cy="500" r="5" fill="#dfc77a" />
                  <circle cx="400" cy="500" r="10" stroke="#dfc77a" strokeWidth="1" fill="none" className="animate-ping" style={{ animationDuration: '4.5s' }} />
                  <text x="410" y="505" className="fill-white font-sans text-xs font-semibold drop-shadow-md group-hover:fill-kishtwar-gold transition-colors">Warwan Valley</text>
                </g>
              </svg>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Previous / Next Arrow Buttons (visible on desktop, hidden on mobile where swipe works) */}
      {slides && slides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 text-white/80 hover:bg-black/50 hover:text-white transition-all duration-200 cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 text-white/80 hover:bg-black/50 hover:text-white transition-all duration-200 cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Swipe Indicators */}
      {slides && slides.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 z-30 flex items-center justify-center space-x-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "w-6 bg-[#c9a84c]" : "w-1.5 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
