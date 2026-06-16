"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import type { MapMarker } from "@/types";

const MapEmbedInner = dynamic(() => import("./MapEmbedInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full bg-kishtwar-cream flex flex-col items-center justify-center border border-kishtwar-cream-200 rounded-2xl animate-pulse text-kishtwar-green-700 space-y-2" style={{ height: "400px" }}>
      <MapPin className="h-8 w-8 animate-bounce text-kishtwar-gold" />
      <span className="text-sm font-semibold tracking-wide">Loading Interactive Map...</span>
    </div>
  ),
});

interface MapEmbedProps {
  markers?: MapMarker[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  interactive?: boolean;
}

export default function MapEmbed(props: MapEmbedProps) {
  return <MapEmbedInner {...props} />;
}
