"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PlaceImage {
  id: number;
  url: string;
  caption: string | null;
}

interface PlaceGalleryProps {
  images: PlaceImage[];
}

export default function PlaceGallery({ images }: PlaceGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIndex === null) return;
    setActiveIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIndex === null) return;
    setActiveIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-serif font-bold text-kishtwar-green-900 border-b border-kishtwar-cream-100 pb-2">
        Photo Gallery
      </h3>
      
      {/* Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {images.map((image, idx) => (
          <div
            key={image.id}
            onClick={() => setActiveIndex(idx)}
            className="group relative aspect-video overflow-hidden rounded-2xl border border-kishtwar-cream-200 bg-gray-100 cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
          >
            <img
              src={image.url}
              alt={image.caption || "Gallery image"}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
              <span className="text-[10px] text-white font-medium truncate w-full">
                {image.caption || "Click to zoom"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeIndex !== null && (
          <div
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setActiveIndex(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveIndex(null)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Nav controls */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Display active image */}
            <div className="max-w-5xl max-h-[80vh] px-4 flex flex-col items-center space-y-4">
              <motion.img
                key={activeIndex}
                src={images[activeIndex].url}
                alt={images[activeIndex].caption || "Gallery View"}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-2xl"
              />
              {images[activeIndex].caption && (
                <p className="text-white text-sm text-center bg-black/40 px-4 py-2 rounded-xl backdrop-blur-sm max-w-xl">
                  {images[activeIndex].caption}
                </p>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
