import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-kishtwar-cream/40 text-kishtwar-green-800 font-sans">
      <div className="flex flex-col items-center space-y-3">
        <Loader2 className="h-10 w-10 animate-spin text-kishtwar-emerald" />
        <span className="text-sm font-semibold tracking-wider text-kishtwar-green-950 font-serif">
          Entering Kishtwar...
        </span>
        <span className="text-[10px] text-gray-400 font-light tracking-wide">
          Loading scenic valleys, heritage landmarks, and stories
        </span>
      </div>
    </div>
  );
}
