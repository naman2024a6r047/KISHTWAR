"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  initialLiked: boolean;
  initialLikeCount: number;
  itemId: number;
  itemType: "blog" | "place" | "photo" | "comment";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function LikeButton({
  initialLiked,
  initialLikeCount,
  itemId,
  itemType,
  className,
  size = "md",
}: LikeButtonProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLoading, setIsLoading] = useState(false);

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isLoading) return;

    // Optimistic UI updates
    const previousLiked = liked;
    const previousLikeCount = likeCount;

    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    setIsLoading(true);

    try {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, itemType }),
      });

      if (!res.ok) {
        // Rollback on error
        setLiked(previousLiked);
        setLikeCount(previousLikeCount);
      }
    } catch {
      // Rollback on network error
      setLiked(previousLiked);
      setLikeCount(previousLikeCount);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      className={cn(
        "inline-flex items-center gap-1.5 focus:outline-none transition-all group p-1.5 rounded-full hover:bg-red-500/10",
        liked ? "text-red-500" : "text-gray-500 hover:text-red-500",
        className
      )}
    >
      <motion.div
        whileTap={{ scale: 1.4 }}
        animate={liked ? { scale: [1, 1.25, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Heart
          className={cn(
            iconSizes[size],
            liked ? "fill-current" : "fill-transparent"
          )}
        />
      </motion.div>
      {likeCount > 0 && (
        <span className="text-xs sm:text-sm font-semibold tabular-nums">
          {likeCount}
        </span>
      )}
    </button>
  );
}
