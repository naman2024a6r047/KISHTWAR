"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import StarRating from "@/components/common/StarRating";
import { submitPlaceReview } from "@/actions/places.actions";

interface ReviewFormProps {
  placeId: number;
  placeSlug: string;
  existingReview?: {
    rating: number;
    title: string | null;
    content: string | null;
  } | null;
}

export default function ReviewForm({
  placeId,
  placeSlug,
  existingReview,
}: ReviewFormProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [rating, setRating] = useState(existingReview?.rating || 5);
  const [title, setTitle] = useState(existingReview?.title || "");
  const [content, setContent] = useState(existingReview?.content || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push(`/login?redirect=/tourist-places/${placeSlug}`);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await submitPlaceReview({
        placeId,
        rating,
        title: title.trim() || undefined,
        content: content.trim() || undefined,
      });

      if (res.success) {
        setSuccess(true);
        // Clear input form if it wasn't an edit
        if (!existingReview) {
          setTitle("");
          setContent("");
        }
      } else {
        setError(res.error || "Failed to submit review.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-kishtwar-cream/40 rounded-2xl p-6 text-center border border-kishtwar-cream-200">
        <h4 className="font-serif font-bold text-kishtwar-green-950 mb-2">
          Share Your Experience
        </h4>
        <p className="text-xs text-gray-600 mb-4 max-w-sm mx-auto font-light">
          Have you visited this place? Log in to leave a review and share your tips with other travelers.
        </p>
        <button
          onClick={() => router.push(`/login?redirect=/tourist-places/${placeSlug}`)}
          className="px-5 py-2.5 rounded-xl bg-kishtwar-green-500 hover:bg-kishtwar-green-600 text-white font-semibold text-xs transition-all shadow-sm"
        >
          Log In to Review
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-kishtwar-cream-200 shadow-sm space-y-4">
      <div>
        <h4 className="font-serif font-bold text-kishtwar-green-950 text-base">
          {existingReview ? "Edit Your Review" : "Leave a Review"}
        </h4>
        <p className="text-xs text-gray-500 font-light">
          Your feedback helps other travelers plan their trip to Kishtwar.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Select */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-kishtwar-green-900 block">
            Overall Rating
          </label>
          <StarRating
            rating={rating}
            maxStars={5}
            interactive={true}
            onRatingChange={setRating}
            size="lg"
          />
        </div>

        {/* Title Input */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-kishtwar-green-900 block">
            Review Title <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            placeholder="Summarize your experience (e.g. Breathtaking views!)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-kishtwar-cream-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-kishtwar-green-500 text-kishtwar-green-900 placeholder:text-gray-400"
          />
        </div>

        {/* Content Input */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-kishtwar-green-900 block">
            Review Details <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            placeholder="Share details about what you liked, how to reach, or best time to photograph..."
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-kishtwar-cream-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-kishtwar-green-500 text-kishtwar-green-900 placeholder:text-gray-400 resize-none leading-relaxed"
          />
        </div>

        {/* Error / Success Messages */}
        {error && (
          <div className="text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 font-medium">
            {error}
          </div>
        )}
        {success && (
          <div className="text-xs text-kishtwar-green-700 bg-kishtwar-green-50 p-3 rounded-lg border border-kishtwar-green-100 font-medium">
            Thank you! Your review has been saved successfully.
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 rounded-xl bg-kishtwar-green-500 hover:bg-kishtwar-green-600 text-white font-semibold text-xs transition-all shadow-sm disabled:opacity-50"
        >
          {isSubmitting
            ? "Submitting..."
            : existingReview
            ? "Update Review"
            : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
