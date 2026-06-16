"use client";

import { useEffect, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Download, Heart } from "lucide-react";
import type { PhotoWithCategory } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import LikeButton from "./LikeButton";

interface LightboxGalleryProps {
  photos: PhotoWithCategory[];
  activePhoto: PhotoWithCategory | null;
  onClose: () => void;
}

export default function LightboxGallery({
  photos,
  activePhoto,
  onClose,
}: LightboxGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(-1);

  const handleNext = useCallback(() => {
    if (currentIndex < photos.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0); // Loop back
    }
  }, [currentIndex, photos.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(photos.length - 1); // Loop to end
    }
  }, [currentIndex, photos.length]);

  useEffect(() => {
    Promise.resolve().then(() => {
      if (activePhoto) {
        const idx = photos.findIndex((p) => p.id === activePhoto.id);
        setCurrentIndex(idx);
      } else {
        setCurrentIndex(-1);
      }
    });
  }, [activePhoto, photos]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    if (currentIndex !== -1) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, onClose, handleNext, handlePrev]);

  const handleDownload = async (e: React.MouseEvent, photo: PhotoWithCategory) => {
    e.stopPropagation();
    try {
      const response = await fetch(photo.url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${photo.title.toLowerCase().replace(/\s+/g, "-")}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      await fetch(`/api/photos/${photo.id}/download`, { method: "POST" });
    } catch {
      // Fail silently
    }
  };

  if (currentIndex === -1 || !photos[currentIndex]) return null;

  const currentPhoto = photos[currentIndex];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
          title="Close (Esc)"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Navigation Buttons */}
        {photos.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50 hover:scale-105 active:scale-95"
              title="Previous"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50 hover:scale-105 active:scale-95"
              title="Next"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Main Content Area */}
        <div className="w-full max-w-5xl px-4 flex flex-col items-center justify-center h-full max-h-[85vh] py-16">
          <motion.div
            key={currentPhoto.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative flex items-center justify-center overflow-hidden max-h-[70vh] rounded-lg shadow-2xl border border-white/5"
          >
            <img
              src={currentPhoto.url}
              alt={currentPhoto.title}
              className="max-h-[70vh] max-w-full object-contain rounded-lg"
            />
          </motion.div>

          {/* Details Overlay bottom */}
          <div className="w-full max-w-3xl mt-6 text-white text-center space-y-2 px-4 z-40 bg-black/40 p-4 rounded-xl border border-white/5 backdrop-blur-md">
            <h3 className="text-lg sm:text-xl font-serif font-bold tracking-wide">
              {currentPhoto.title}
            </h3>
            {currentPhoto.caption && (
              <p className="text-xs sm:text-sm text-kishtwar-cream-200 line-clamp-2 max-w-2xl mx-auto">
                {currentPhoto.caption}
              </p>
            )}
            <div className="flex items-center justify-between text-xs text-gray-400 max-w-lg mx-auto pt-3 border-t border-white/10">
              <span className="font-semibold">By {currentPhoto.contributor.name}</span>
              <span className="px-2 py-0.5 rounded bg-kishtwar-gold text-kishtwar-green-950 font-bold uppercase tracking-wider text-[9px]">
                {currentPhoto.category.name}
              </span>
              <div className="flex items-center space-x-3">
                <LikeButton
                  initialLiked={false}
                  initialLikeCount={currentPhoto.likeCount}
                  itemId={currentPhoto.id}
                  itemType="photo"
                  className="text-white hover:text-red-400 p-0 hover:bg-transparent"
                  size="sm"
                />
                <button
                  onClick={(e) => handleDownload(e, currentPhoto)}
                  className="flex items-center space-x-1 text-white hover:text-kishtwar-gold transition-colors p-1"
                  title="Download image"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
