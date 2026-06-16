import Link from "next/link";
import { Compass, ArrowLeft, Map } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-kishtwar-cream/40 text-center font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl border border-kishtwar-cream-200 p-8 sm:p-12 shadow-xl space-y-6">
        {/* Animated Compass Icon */}
        <div className="w-20 h-20 bg-kishtwar-green-50 text-kishtwar-green-600 rounded-3xl flex items-center justify-center mx-auto border border-kishtwar-green-100 shadow-sm animate-float">
          <Compass className="h-10 w-10 text-kishtwar-emerald" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-kishtwar-green-950">
            404 — Valley Not Found
          </h1>
          <p className="text-sm text-gray-650 leading-relaxed font-light">
            The trail you are looking for seems to have vanished in the mist. It may have been moved, deleted, or was never mapped.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center space-x-2 py-3 rounded-xl bg-kishtwar-green-900 hover:bg-kishtwar-green-800 text-white font-serif font-bold text-sm transition-all shadow-md"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return Home</span>
          </Link>
          <Link
            href="/tourist-places"
            className="flex-1 inline-flex items-center justify-center space-x-2 py-3 rounded-xl border border-kishtwar-cream-200 bg-white hover:bg-kishtwar-green-50 text-kishtwar-green-700 font-serif font-bold text-sm transition-all shadow-sm"
          >
            <Map className="h-4 w-4 text-kishtwar-emerald" />
            <span>Explore Places</span>
          </Link>
        </div>
      </div>
      <p className="text-[10px] text-gray-400 font-light mt-8 tracking-wide">
        &copy; {new Date().getFullYear()} Kishtwar Tourism Board.
      </p>
    </div>
  );
}
