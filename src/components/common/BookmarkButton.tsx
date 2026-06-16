"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  initialSaved: boolean;
  itemId: number;
  itemType: "blog" | "place" | "event";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function BookmarkButton({
  initialSaved,
  itemId,
  itemType,
  className,
  size = "md",
}: BookmarkButtonProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isLoading) return;

    const previousSaved = saved;
    setSaved(!saved);
    setIsLoading(true);

    try {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, itemType }),
      });

      if (!res.ok) {
        setSaved(previousSaved);
      }
    } catch {
      setSaved(previousSaved);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleBookmark}
      className={cn(
        "inline-flex items-center justify-center focus:outline-none transition-all group p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm",
        saved ? "text-kishtwar-gold" : "text-white hover:text-kishtwar-gold",
        className
      )}
      title={saved ? "Remove from Bookmarks" : "Save to Bookmarks"}
    >
      <motion.div
        whileTap={{ scale: 1.3 }}
        animate={saved ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.2 }}
      >
        <Bookmark
          className={cn(
            iconSizes[size],
            saved ? "fill-current" : "fill-transparent"
          )}
        />
      </motion.div>
    </button>
  );
}
