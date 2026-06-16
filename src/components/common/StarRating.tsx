"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function StarRating({
  rating,
  maxStars = 5,
  onRatingChange,
  interactive = false,
  size = "md",
  className,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const starSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-5 w-5",
    lg: "h-7 w-7",
  };

  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(null);
    }
  };

  const displayRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div 
      className={cn("flex items-center space-x-0.5", className)}
      onMouseLeave={handleMouseLeave}
    >
      {Array.from({ length: maxStars }, (_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= displayRating;
        const isHalf = !isFilled && starValue - 0.5 <= displayRating;

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            className={cn(
              "focus:outline-none transition-transform duration-100",
              interactive ? "cursor-pointer hover:scale-110 active:scale-95" : "cursor-default"
            )}
            aria-label={interactive ? `Rate ${starValue} out of ${maxStars}` : `${rating} stars`}
          >
            {isHalf ? (
              <div className="relative inline-block">
                <Star
                  className={cn(
                    starSizes[size],
                    "text-gray-300 fill-gray-300"
                  )}
                />
                <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
                  <Star
                    className={cn(
                      starSizes[size],
                      "text-kishtwar-saffron fill-kishtwar-saffron"
                    )}
                  />
                </div>
              </div>
            ) : (
              <Star
                className={cn(
                  starSizes[size],
                  isFilled
                    ? "text-kishtwar-saffron fill-kishtwar-saffron"
                    : "text-gray-300 fill-gray-300"
                )}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
