"use client";

import { useState } from "react";
import Link from "next/link";
import LightboxGallery from "../common/LightboxGallery";

const galleryImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&q=80&w=600",
    title: "Snowy Mountain Peak",
    caption: "A majestic snow peak in the Kishtwar range."
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600",
    title: "Saffron Flower Bloom",
    caption: "Beautiful purple saffron flowers blooming in the fields."
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600",
    title: "Snowy Mountain Range",
    caption: "Stunning ridges covered in snow under a blue sky."
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=600",
    title: "River in the Valley",
    caption: "The crystal clear river flowing through a scenic valley."
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&q=80&w=600",
    title: "Cultural Celebration",
    caption: "Local dancers in traditional clothing celebrating a festival."
  }
];

interface GalleryPhoto {
  id: number;
  url: string;
  title: string;
  caption: string;
}

export default function GalleryPreviewSection() {
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);

  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0a2916]">
            Gallery
          </h2>
          <Link
            href="/gallery"
            className="text-xs font-bold text-gray-500 hover:text-kishtwar-gold underline uppercase tracking-wider transition-colors"
          >
            View All
          </Link>
        </div>

        {/* Photos Row: 
            - Horizontal snap-scroll on mobile/tablet (with bleed padding)
            - 5-column grid on desktop */}
        <div className="flex overflow-x-auto lg:grid lg:grid-cols-5 gap-4 snap-x snap-mandatory scroll-smooth hide-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
          {galleryImages.map((photo) => (
            <div 
              key={photo.id}
              onClick={() => setActivePhoto(photo)}
              className="cursor-pointer overflow-hidden rounded-xl aspect-[4/3] relative group shadow-sm shrink-0 w-[80vw] sm:w-[45vw] lg:w-auto snap-center"
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Trigger Overlay */}
      {activePhoto && (
        <LightboxGallery
          photos={galleryImages.map(img => ({
            id: img.id,
            url: img.url,
            thumbnailUrl: img.url,
            title: img.title,
            caption: img.caption,
            category: { id: 1, name: "Gallery", slug: "gallery" },
            contributor: { id: 1, name: "Admin", username: "admin", avatar: null },
            likeCount: 0,
            downloadCount: 0,
            featured: true,
            width: 800,
            height: 600
          }))}
          activePhoto={{
            id: activePhoto.id,
            url: activePhoto.url,
            thumbnailUrl: activePhoto.url,
            title: activePhoto.title,
            caption: activePhoto.caption,
            category: { id: 1, name: "Gallery", slug: "gallery" },
            contributor: { id: 1, name: "Admin", username: "admin", avatar: null },
            likeCount: 0,
            downloadCount: 0,
            featured: true,
            width: 800,
            height: 600
          }}
          onClose={() => setActivePhoto(null)}
        />
      )}
    </section>
  );
}
