"use client";

import { useState } from "react";
import PhotoCard from "@/components/cards/PhotoCard";
import LightboxGallery from "@/components/common/LightboxGallery";
import type { PhotoWithCategory } from "@/types";

interface GalleryContainerProps {
  photos: PhotoWithCategory[];
}

export default function GalleryContainer({ photos }: GalleryContainerProps) {
  const [activePhoto, setActivePhoto] = useState<PhotoWithCategory | null>(null);

  const handleImageClick = (photo: PhotoWithCategory) => {
    setActivePhoto(photo);
  };

  const handleClose = () => {
    setActivePhoto(null);
  };

  if (!photos || photos.length === 0) {
    return null;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            onImageClick={handleImageClick}
          />
        ))}
      </div>

      {/* Lightbox Gallery Modal */}
      {activePhoto && (
        <LightboxGallery
          photos={photos}
          activePhoto={activePhoto}
          onClose={handleClose}
        />
      )}
    </>
  );
}
