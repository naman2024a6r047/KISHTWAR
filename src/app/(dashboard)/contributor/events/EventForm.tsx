"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createEvent, updateEvent } from "@/actions/events.actions";
import RichTextEditor from "@/components/common/RichTextEditor";
import { Save, CheckCircle, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface EventFormProps {
  categories: any[];
  initialData?: any;
}

export default function EventForm({ categories, initialData }: EventFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [alertMessage, setAlertMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Form State
  const [name, setName] = useState(initialData?.name || "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || (categories[0]?.id || ""));
  const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || "");
  const [banner, setBanner] = useState(initialData?.banner || "");
  
  // Date and Time (HTML input type="date" expects YYYY-MM-DD format)
  const getFormattedDate = (dateVal: any) => {
    if (!dateVal) return "";
    return new Date(dateVal).toISOString().split("T")[0];
  };

  const [startDate, setStartDate] = useState(getFormattedDate(initialData?.startDate));
  const [endDate, setEndDate] = useState(getFormattedDate(initialData?.endDate));
  const [startTime, setStartTime] = useState(initialData?.startTime || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [registrationLink, setRegistrationLink] = useState(initialData?.registrationLink || "");
  const [description, setDescription] = useState(initialData?.description || "");

  const triggerAlert = (text: string, type: "success" | "error") => {
    setAlertMessage({ text, type });
    setTimeout(() => setAlertMessage(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !startDate || !description.trim()) {
      triggerAlert("Name, Start Date, and Detailed Description are required.", "error");
      return;
    }

    startTransition(async () => {
      try {
        const eventData = {
          name,
          description,
          shortDescription: shortDescription || undefined,
          banner: banner || undefined,
          startDate: new Date(startDate),
          endDate: endDate ? new Date(endDate) : undefined,
          startTime: startTime || undefined,
          location: location || undefined,
          registrationLink: registrationLink || undefined,
          categoryId: Number(categoryId),
        };

        const res = initialData
          ? await updateEvent(initialData.id, eventData)
          : await createEvent(eventData);

        if (res.success) {
          triggerAlert(res.message || "Event saved successfully.", "success");
          setTimeout(() => {
            router.push("/contributor/events");
            router.refresh();
          }, 1500);
        } else {
          triggerAlert(res.error || "Failed to save event.", "error");
        }
      } catch (err) {
        triggerAlert("An error occurred while saving the event.", "error");
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
          href="/contributor/events"
          className="flex items-center text-xs font-serif font-bold text-kishtwar-green-900 hover:text-kishtwar-green-950 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1 shrink-0 text-kishtwar-gold" />
          Back to Events
        </Link>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: General Info */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-kishtwar-cream-200 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-serif font-bold text-kishtwar-green-950 border-b border-kishtwar-cream-150 pb-2 mb-4">
            1. Event details & Banner
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 flex flex-col space-y-1.5">
              <label htmlFor="name" className="text-xs font-bold text-kishtwar-green-950">
                Event Name *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Saffron Harvest Festival 2026"
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
                Brief Summary / Excerpt *
              </label>
              <textarea
                id="shortDescription"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                required
                placeholder="Write a brief overview of the festival/pilgrimage for lists and preview cards..."
                className="text-sm bg-white border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-4 py-2 min-h-[60px] text-gray-750 focus:ring-1 focus:ring-kishtwar-green-900"
              />
            </div>

            <div className="md:col-span-3 flex flex-col space-y-1.5">
              <label htmlFor="banner" className="text-xs font-bold text-kishtwar-green-950">
                Featured Banner Image URL
              </label>
              <input
                id="banner"
                type="text"
                value={banner}
                onChange={(e) => setBanner(e.target.value)}
                placeholder="Paste the URL to the main banner image (e.g. Cloudinary, Unsplash)"
                className="text-sm bg-white border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-4 py-2 text-gray-750 focus:ring-1 focus:ring-kishtwar-green-900"
              />
            </div>
          </div>

          {banner && (
            <div className="mt-2 rounded-xl overflow-hidden border border-kishtwar-cream-250 max-h-40 relative max-w-sm bg-gray-50 flex items-center justify-center">
              <img
                src={banner}
                alt="Banner preview"
                className="object-cover h-full w-full"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        {/* Section 2: Dates, Time & Location */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-kishtwar-cream-200 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-serif font-bold text-kishtwar-green-950 border-b border-kishtwar-cream-150 pb-2 mb-4">
            2. Date, Time & Venue Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="startDate" className="text-xs font-bold text-kishtwar-green-950">
                Start Date *
              </label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="text-sm bg-white border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-4 py-2 text-gray-750 focus:ring-1 focus:ring-kishtwar-green-900"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label htmlFor="endDate" className="text-xs font-bold text-kishtwar-green-950">
                End Date (Optional)
              </label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-sm bg-white border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-4 py-2 text-gray-750 focus:ring-1 focus:ring-kishtwar-green-900"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label htmlFor="startTime" className="text-xs font-bold text-kishtwar-green-950">
                Start Time (e.g. 10:00 AM)
              </label>
              <input
                id="startTime"
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="e.g. 10:00 AM"
                className="text-sm bg-white border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-4 py-2 text-gray-750 focus:ring-1 focus:ring-kishtwar-green-900"
              />
            </div>

            <div className="md:col-span-2 flex flex-col space-y-1.5">
              <label htmlFor="location" className="text-xs font-bold text-kishtwar-green-950">
                Event Venue / Location
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Chowgan Ground, Kishtwar town"
                className="text-sm bg-white border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-4 py-2 text-gray-750 focus:ring-1 focus:ring-kishtwar-green-900"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label htmlFor="registrationLink" className="text-xs font-bold text-kishtwar-green-950">
                Registration / Web Link
              </label>
              <input
                id="registrationLink"
                type="text"
                value={registrationLink}
                onChange={(e) => setRegistrationLink(e.target.value)}
                placeholder="e.g. https://kishtwar.nic.in/yatra"
                className="text-sm bg-white border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-4 py-2 text-gray-750 focus:ring-1 focus:ring-kishtwar-green-900"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Rich Description */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-kishtwar-cream-200 p-6 shadow-sm space-y-6">
          <h3 className="text-base font-serif font-bold text-kishtwar-green-950 border-b border-kishtwar-cream-150 pb-2 mb-4">
            3. Detailed Description
          </h3>

          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-kishtwar-green-950">
              Event Description (Rich Text) *
            </label>
            <RichTextEditor
              content={description}
              onChange={(html) => setDescription(html)}
              placeholder="Provide a detailed outline of schedules, arrangements, local significance, or instructions..."
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-kishtwar-cream-200 space-x-2">
            <Link
              href="/contributor/events"
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
                  <span>{initialData ? "Save Changes" : "Submit Event"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
