"use client";

import { useState } from "react";
import VideoCard from "@/components/cards/VideoCard";
import type { VideoWithCategory } from "@/types";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoContainerProps {
  videos: VideoWithCategory[];
}

export default function VideoContainer({ videos }: VideoContainerProps) {
  const [activeVideo, setActiveVideo] = useState<VideoWithCategory | null>(null);

  const handlePlayClick = (video: VideoWithCategory) => {
    setActiveVideo(video);
  };

  if (!videos || videos.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onPlayClick={handlePlayClick}
          />
        ))}
      </div>

      {/* Video Player Lightbox Modal */}
      <AnimatePresence>
        {activeVideo && (
          <div
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setActiveVideo(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Video Player Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-video"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking player itself
            >
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                title={activeVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
