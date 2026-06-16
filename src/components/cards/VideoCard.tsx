"use client";

import { useState } from "react";
import { Play, Eye, Calendar, User } from "lucide-react";
import type { VideoWithCategory } from "@/types";
import { cn } from "@/lib/utils";

interface VideoCardProps {
  video: VideoWithCategory;
  onPlayClick?: (video: VideoWithCategory) => void;
}

export default function VideoCard({ video, onPlayClick }: VideoCardProps) {
  return (
    <div className="group rounded-2xl overflow-hidden border border-kishtwar-cream-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full card-hover">
      {/* Video Thumbnail with Play Button Overlay */}
      <div 
        onClick={() => onPlayClick?.(video)}
        className="relative aspect-video w-full overflow-hidden bg-gray-950 cursor-pointer"
      >
        <img
          src={video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
          alt={video.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Dark overlay & Play Button */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
          <div className="h-14 w-14 rounded-full bg-kishtwar-gold hover:bg-kishtwar-gold-light text-kishtwar-green-900 flex items-center justify-center shadow-lg transition-all duration-200 transform group-hover:scale-110">
            <Play className="h-6 w-6 fill-current translate-x-0.5" />
          </div>
        </div>

        {/* Category Badge */}
        <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full bg-kishtwar-green-900/80 backdrop-blur-sm text-kishtwar-gold border border-kishtwar-green-800/40 uppercase tracking-wider">
          {video.category.name}
        </span>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div className="space-y-2.5">
          <h3 
            onClick={() => onPlayClick?.(video)}
            className="text-base font-serif font-bold text-kishtwar-green-900 hover:text-kishtwar-gold transition-colors line-clamp-2 leading-snug cursor-pointer"
          >
            {video.title}
          </h3>
          {video.description && (
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {video.description}
            </p>
          )}
        </div>

        {/* Footer Details */}
        <div className="pt-4 mt-4 border-t border-kishtwar-cream-100 flex items-center justify-between text-xs text-gray-500 font-medium">
          <span className="flex items-center space-x-1">
            <User className="h-3.5 w-3.5 text-kishtwar-gold shrink-0" />
            <span className="truncate max-w-[120px]">{video.contributor.name}</span>
          </span>

          <span className="flex items-center space-x-1 text-gray-400">
            <Eye className="h-3.5 w-3.5" />
            <span>{video.viewCount} views</span>
          </span>
        </div>
      </div>
    </div>
  );
}
