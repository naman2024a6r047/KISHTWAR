"use client";

import { useState } from "react";
import { Download, Heart, Eye, User } from "lucide-react";
import type { PhotoWithCategory } from "@/types";
import { cn } from "@/lib/utils";
import LikeButton from "../common/LikeButton";

interface PhotoCardProps {
  photo: PhotoWithCategory;
  onImageClick?: (photo: PhotoWithCategory) => void;
  liked?: boolean;
}

export default function PhotoCard({
  photo,
  onImageClick,
  liked = false,
}: PhotoCardProps) {
  const [downloadCount, setDownloadCount] = useState(photo.downloadCount);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setDownloadCount((prev) => prev + 1);
      // Actual download logic will fetch the file and trigger download
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

      // Notify server about download increment
      await fetch(`/api/photos/${photo.id}/download`, { method: "POST" });
    } catch {
      // Fail silently, download still proceeds locally
    }
  };

  return (
    <div
      onClick={() => onImageClick?.(photo)}
      className="group relative rounded-2xl overflow-hidden bg-gray-950 shadow-sm border border-kishtwar-cream-200 cursor-zoom-in aspect-auto min-h-[220px] max-h-[420px] card-hover"
    >
      {/* Photo Image */}
      <img
        src={photo.thumbnailUrl || photo.url}
        alt={photo.title}
        width={photo.width || 600}
        height={photo.height || 400}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 z-10">
        {/* Top items: category */}
        <div className="flex justify-between items-start">
          <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-kishtwar-gold text-kishtwar-green-900 uppercase tracking-wider">
            {photo.category.name}
          </span>
        </div>

        {/* Bottom items: title, author, actions */}
        <div className="space-y-3 text-white">
          <div>
            <h4 className="text-sm font-serif font-bold tracking-wide leading-snug line-clamp-1">
              {photo.title}
            </h4>
            <span className="text-[10px] text-kishtwar-cream-200 font-semibold flex items-center space-x-1 mt-0.5">
              <User className="h-3 w-3 text-kishtwar-gold shrink-0" />
              <span>By {photo.contributor.name}</span>
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
            <div className="flex items-center space-x-3">
              {/* Like trigger */}
              <LikeButton
                initialLiked={liked}
                initialLikeCount={photo.likeCount}
                itemId={photo.id}
                itemType="photo"
                className="text-white hover:text-red-400 p-0 hover:bg-transparent"
                size="sm"
              />
              
              {/* Download trigger */}
              <button
                onClick={handleDownload}
                className="flex items-center space-x-1 text-white hover:text-kishtwar-gold transition-colors p-1"
                title="Download image"
              >
                <Download className="h-4 w-4 shrink-0" />
                <span className="font-semibold tabular-nums">{downloadCount}</span>
              </button>
            </div>

            <span className="text-[10px] text-gray-300">
              {photo.width && photo.height ? `${photo.width} × ${photo.height}` : ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
