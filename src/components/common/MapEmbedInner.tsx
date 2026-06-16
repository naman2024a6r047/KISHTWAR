"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { MapMarker } from "@/types";
import "leaflet/dist/leaflet.css";

// Fix for default Leaflet icon markers in Next.js
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

interface MapEmbedInnerProps {
  markers?: MapMarker[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  interactive?: boolean;
}

// Sub-component to handle map flyTo when center changes dynamically
function ChangeMapView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function MapEmbedInner({
  markers = [],
  center = [33.3142, 75.7688], // Kishtwar coordinates
  zoom = 10,
  height = "400px",
  interactive = true,
}: MapEmbedInnerProps) {
  return (
    <div className="w-full relative overflow-hidden rounded-2xl border border-kishtwar-cream-200 shadow-sm" style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={interactive}
        dragging={interactive}
        zoomControl={interactive}
        doubleClickZoom={interactive}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <ChangeMapView center={center} zoom={zoom} />

        {markers.map((marker) => {
          // You can customize icon colors/shapes based on marker.type in the future
          return (
            <Marker key={marker.id} position={[marker.lat, marker.lng]}>
              <Popup>
                <div className="p-1 max-w-[200px] text-gray-800 font-sans">
                  {marker.image && (
                    <img
                      src={marker.image}
                      alt={marker.name}
                      className="aspect-video w-full object-cover rounded-lg mb-2"
                    />
                  )}
                  <h4 className="font-bold text-xs text-kishtwar-green-950 font-serif">
                    {marker.name}
                  </h4>
                  {marker.description && (
                    <p className="text-[10px] text-gray-500 line-clamp-2 mt-1">
                      {marker.description}
                    </p>
                  )}
                  <a
                    href={`/tourist-places/${marker.slug}`}
                    className="inline-block mt-2 text-[10px] font-bold text-kishtwar-emerald hover:underline"
                  >
                    View Details
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
