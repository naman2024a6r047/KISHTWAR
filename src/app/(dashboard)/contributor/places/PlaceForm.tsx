"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPlace, updatePlace } from "@/actions/places.actions";
import RichTextEditor from "@/components/common/RichTextEditor";
import { Save, CheckCircle, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PlaceFormProps {
  categories: any[];
  initialData?: any;
}

export default function PlaceForm({ categories, initialData }: PlaceFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [alertMessage, setAlertMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // General Info
  const [name, setName] = useState(initialData?.name || "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || (categories[0]?.id || ""));
  const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || "");
  const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage || "");
  const [altitude, setAltitude] = useState(initialData?.altitude || "");

  // Coordinates & Travel
  const [gpsLat, setGpsLat] = useState(initialData?.gpsLat ? String(initialData.gpsLat) : "");
  const [gpsLng, setGpsLng] = useState(initialData?.gpsLng ? String(initialData.gpsLng) : "");
  const [bestSeason, setBestSeason] = useState(initialData?.bestSeason || "");
  const [visitingTime, setVisitingTime] = useState(initialData?.visitingTime || "");
  const [entryFee, setEntryFee] = useState(initialData?.entryFee || "");

  // Detailed Description
  const [description, setDescription] = useState(initialData?.description || "");
  const [history, setHistory] = useState(initialData?.history || "");
  const [howToReach, setHowToReach] = useState(initialData?.howToReach || "");
  const [travelTips, setTravelTips] = useState(initialData?.travelTips || "");
  const [nearbyHotels, setNearbyHotels] = useState(initialData?.nearbyHotels || "");

  const triggerAlert = (text: string, type: "success" | "error") => {
    setAlertMessage({ text, type });
    setTimeout(() => setAlertMessage(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !description.trim() || !featuredImage.trim()) {
      triggerAlert("Name, Detailed Description, and Featured Image are required.", "error");
      return;
    }

    startTransition(async () => {
      try {
        const placeData = {
          name,
          description,
          shortDescription: shortDescription || undefined,
          history: history || undefined,
          featuredImage,
          gpsLat: gpsLat ? parseFloat(gpsLat) : undefined,
          gpsLng: gpsLng ? parseFloat(gpsLng) : undefined,
          altitude: altitude || undefined,
          visitingTime: visitingTime || undefined,
          entryFee: entryFee || undefined,
          bestSeason: bestSeason || undefined,
          travelTips: travelTips || undefined,
          howToReach: howToReach || undefined,
          nearbyHotels: nearbyHotels || undefined,
          categoryId: Number(categoryId),
        };

        const res = initialData
          ? await updatePlace(initialData.id, placeData)
          : await createPlace(placeData);

        if (res.success) {
          triggerAlert(res.message || "Destination saved successfully.", "success");
          setTimeout(() => {
            router.push("/contributor/places");
            router.refresh();
          }, 1500);
        } else {
          triggerAlert(res.error || "Failed to save destination.", "error");
        }
      } catch (err) {
        triggerAlert("An error occurred while saving the destination.", "error");
      }
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Alert banner */}
      {alertMessage && (
        <div
          className={`fixed bottom-4 right-4 z-50 flex items-center space-x-2 px-4 py-3 rounded-2xl border shadow-lg text-sm font-semibold animate-slide-in-up ${
            alertMessage.type === "success"
              ? "bg-emerald-50 border-emerald-100 text-emerald-800"
              : "bg-red-50 border-red-100 text-red-800"
          }`}
        >
          {alertMessage.type === "success" ? (
            <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
          )}
          <span>{alertMessage.text}</span>
        </div>
      )}

      {/* Back button */}
      <div className="flex items-center">
        <Link
          href="/contributor/places"
          className="flex items-center text-xs font-serif font-bold text-kishtwar-green-900 hover:text-kishtwar-green-950 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1 shrink-0 text-kishtwar-gold" />
          Back to Places
        </Link>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: General Info */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-kishtwar-cream-200 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-serif font-bold text-kishtwar-green-950 border-b border-kishtwar-cream-150 pb-2 mb-4">
            1. General Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 flex flex-col space-y-1.5">
              <label htmlFor="name" className="text-xs font-bold text-kishtwar-green-950">
                Destination Name *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Paddar Blue Sapphire Mines"
                className="text-sm bg-white border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-4 py-2 text-gray-750 focus:ring-1 focus:ring-kishtwar-green-900"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label htmlFor="category" className="text-xs font-bold text-kishtwar-green-950">
                Category *
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="text-sm bg-white border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-3 py-2 text-gray-750 focus:ring-1 focus:ring-kishtwar-green-900 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3 flex flex-col space-y-1.5">
              <label htmlFor="shortDescription" className="text-xs font-bold text-kishtwar-green-950">
                Short Summary / Preview *
              </label>
              <textarea
                id="shortDescription"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                required
                placeholder="A short description shown on search cards..."
                className="text-sm bg-white border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-4 py-2 min-h-[60px] text-gray-750 focus:ring-1 focus:ring-kishtwar-green-900"
              />
            </div>

            <div className="md:col-span-2 flex flex-col space-y-1.5">
              <label htmlFor="featuredImage" className="text-xs font-bold text-kishtwar-green-950">
                Featured Cover Image URL *
              </label>
              <input
                id="featuredImage"
                type="text"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                required
                placeholder="Unsplash or Cloudinary image URL..."
                className="text-sm bg-white border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-4 py-2 text-gray-750 focus:ring-1 focus:ring-kishtwar-green-900"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label htmlFor="altitude" className="text-xs font-bold text-kishtwar-green-950">
                Altitude (e.g. 2,500m)
              </label>
              <input
                id="altitude"
                type="text"
                value={altitude}
                onChange={(e) => setAltitude(e.target.value)}
                placeholder="e.g. 2,100 meters"
                className="text-sm bg-white border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-4 py-2 text-gray-750 focus:ring-1 focus:ring-kishtwar-green-900"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Visitor Info & Coordinates */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-kishtwar-cream-200 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-serif font-bold text-kishtwar-green-950 border-b border-kishtwar-cream-150 pb-2 mb-4">
            2. Location & Travel Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="gpsLat" className="text-xs font-bold text-kishtwar-green-950">
                GPS Latitude (Decimal)
              </label>
              <input
                id="gpsLat"
                type="number"
                step="any"
                value={gpsLat}
                onChange={(e) => setGpsLat(e.target.value)}
                placeholder="e.g. 33.3134"
                className="text-sm bg-white border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-4 py-2 text-gray-750 focus:ring-1 focus:ring-kishtwar-green-900"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label htmlFor="gpsLng" className="text-xs font-bold text-kishtwar-green-950">
                GPS Longitude (Decimal)
              </label>
              <input
                id="gpsLng"
                type="number"
                step="any"
                value={gpsLng}
                onChange={(e) => setGpsLng(e.target.value)}
                placeholder="e.g. 75.7661"
                className="text-sm bg-white border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-4 py-2 text-gray-750 focus:ring-1 focus:ring-kishtwar-green-900"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label htmlFor="bestSeason" className="text-xs font-bold text-kishtwar-green-950">
                Best Season to Visit
              </label>
              <input
                id="bestSeason"
                type="text"
                value={bestSeason}
                onChange={(e) => setBestSeason(e.target.value)}
                placeholder="e.g. May to September"
                className="text-sm bg-white border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-4 py-2 text-gray-750 focus:ring-1 focus:ring-kishtwar-green-900"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label htmlFor="visitingTime" className="text-xs font-bold text-kishtwar-green-950">
                Visiting Timings
              </label>
              <input
                id="visitingTime"
                type="text"
                value={visitingTime}
                onChange={(e) => setVisitingTime(e.target.value)}
                placeholder="e.g. 6 AM - 6 PM"
                className="text-sm bg-white border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-4 py-2 text-gray-750 focus:ring-1 focus:ring-kishtwar-green-900"
              />
            </div>

            <div className="flex flex-col space-y-1.5 lg:col-span-2">
              <label htmlFor="entryFee" className="text-xs font-bold text-kishtwar-green-950">
                Entry Ticket Fee
              </label>
              <input
                id="entryFee"
                type="text"
                value={entryFee}
                onChange={(e) => setEntryFee(e.target.value)}
                placeholder="e.g. Free or ₹20 per person"
                className="text-sm bg-white border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-4 py-2 w-full text-gray-750 focus:ring-1 focus:ring-kishtwar-green-900"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Rich Details */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-kishtwar-cream-200 p-6 shadow-sm space-y-6">
          <h3 className="text-base font-serif font-bold text-kishtwar-green-950 border-b border-kishtwar-cream-150 pb-2 mb-4">
            3. Detailed Descriptions & Guides
          </h3>

          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-kishtwar-green-950">
              Detailed Description (Rich Text) *
            </label>
            <RichTextEditor
              content={description}
              onChange={(html) => setDescription(html)}
              placeholder="Detailed description about the destination, geology, points of interest..."
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label htmlFor="history" className="text-xs font-bold text-kishtwar-green-950">
              Historical & Cultural Background
            </label>
            <textarea
              id="history"
              value={history}
              onChange={(e) => setHistory(e.target.value)}
              placeholder="Tell the history or cultural significance of this place..."
              className="text-sm bg-white border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-4 py-2 min-h-[100px] text-gray-750 focus:ring-1 focus:ring-kishtwar-green-900"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label htmlFor="howToReach" className="text-xs font-bold text-kishtwar-green-950">
              How to Reach (Road, Air, Rail paths)
            </label>
            <textarea
              id="howToReach"
              value={howToReach}
              onChange={(e) => setHowToReach(e.target.value)}
              placeholder="Details on flight/train connections and highway roads to reach this spot..."
              className="text-sm bg-white border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-4 py-2 min-h-[80px] text-gray-750 focus:ring-1 focus:ring-kishtwar-green-900"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label htmlFor="travelTips" className="text-xs font-bold text-kishtwar-green-950">
              Important Travel Tips
            </label>
            <textarea
              id="travelTips"
              value={travelTips}
              onChange={(e) => setTravelTips(e.target.value)}
              placeholder="Safety tips, network connectivity guides, cash requirements..."
              className="text-sm bg-white border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-4 py-2 min-h-[80px] text-gray-750 focus:ring-1 focus:ring-kishtwar-green-900"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label htmlFor="nearbyHotels" className="text-xs font-bold text-kishtwar-green-950">
              Nearby Accommodation & Hotels
            </label>
            <textarea
              id="nearbyHotels"
              value={nearbyHotels}
              onChange={(e) => setNearbyHotels(e.target.value)}
              placeholder="Information about guest houses, homestays, or camping sites nearby..."
              className="text-sm bg-white border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-4 py-2 min-h-[80px] text-gray-750 focus:ring-1 focus:ring-kishtwar-green-900"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-kishtwar-cream-200 space-x-2">
            <Link
              href="/contributor/places"
              className="px-5 py-2.5 text-xs font-serif font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center space-x-1.5 px-5 py-2.5 bg-kishtwar-green-900 hover:bg-kishtwar-green-950 disabled:bg-kishtwar-green-800 text-white font-serif font-bold text-xs tracking-wide rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-kishtwar-gold shrink-0" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5 text-kishtwar-gold shrink-0" />
                  <span>{initialData ? "Save Changes" : "Submit Destination"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
