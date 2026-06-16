"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an analytics service
    console.error("Global boundary error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-kishtwar-cream/40 text-center font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl border border-kishtwar-cream-200 p-8 sm:p-12 shadow-xl space-y-6">
        {/* Error icon */}
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto border border-red-100 shadow-sm">
          <AlertTriangle className="h-10 w-10" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-kishtwar-green-950">
            Something Went Wrong
          </h1>
          <p className="text-xs text-gray-500 leading-relaxed font-light">
            An unexpected error occurred while loading this section of the portal. Our team has been notified.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 inline-flex items-center justify-center space-x-2 py-3 rounded-xl bg-kishtwar-green-900 hover:bg-kishtwar-green-800 text-white font-serif font-bold text-sm transition-all shadow-md cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center space-x-2 py-3 rounded-xl border border-kishtwar-cream-200 bg-white hover:bg-kishtwar-green-50 text-kishtwar-green-700 font-serif font-bold text-sm transition-all shadow-sm"
          >
            <Home className="h-4 w-4 text-kishtwar-gold" />
            <span>Go to Home</span>
          </Link>
        </div>
      </div>
      <p className="text-[10px] text-gray-400 font-light mt-8 tracking-wide">
        &copy; {new Date().getFullYear()} Kishtwar Tourism Board.
      </p>
    </div>
  );
}
