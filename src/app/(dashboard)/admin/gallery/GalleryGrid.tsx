"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deletePhoto, updatePhotoStatus, togglePhotoFeatured } from "@/actions/gallery.actions";
import type { MediaStatus } from "@prisma/client";
import {
  Heart,
  Download,
  Trash2,
  Sparkles,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  Search,
} from "lucide-react";

interface GalleryGridProps {
  initialPhotos: any[];
}

export default function GalleryGrid({ initialPhotos }: GalleryGridProps) {
  const router = useRouter();
  const [photos, setPhotos] = useState(initialPhotos);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [actionPhotoId, setActionPhotoId] = useState<number | null>(null);
  const [alertMessage, setAlertMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const triggerAlert = (text: string, type: "success" | "error") => {
    setAlertMessage({ text, type });
    setTimeout(() => setAlertMessage(null), 4000);
  };

  const handleStatusChange = async (photoId: number, currentStatus: MediaStatus, newStatus: MediaStatus) => {
    if (currentStatus === newStatus) return;

    setActionPhotoId(photoId);
    startTransition(async () => {
      try {
        const res = await updatePhotoStatus(photoId, newStatus);
        if (res.success) {
          setPhotos((prev) =>
            prev.map((p) => (p.id === photoId ? { ...p, status: newStatus } : p))
          );
          triggerAlert(res.message || "Photo status updated successfully.", "success");
          router.refresh();
        } else {
          triggerAlert(res.error || "Failed to update status.", "error");
        }
      } catch (err) {
        triggerAlert("An error occurred while updating status.", "error");
      } finally {
        setActionPhotoId(null);
      }
    });
  };

  const handleToggleFeatured = async (photoId: number) => {
    setActionPhotoId(photoId);
    startTransition(async () => {
      try {
        const res = await togglePhotoFeatured(photoId);
        if (res.success) {
          setPhotos((prev) =>
            prev.map((p) => (p.id === photoId ? { ...p, featured: !p.featured } : p))
          );
          triggerAlert(res.message || "Photo featured status updated.", "success");
          router.refresh();
        } else {
          triggerAlert(res.error || "Failed to update featured status.", "error");
        }
      } catch (err) {
        triggerAlert("An error occurred while updating featured status.", "error");
      } finally {
        setActionPhotoId(null);
      }
    });
  };

  const handleDelete = async (photoId: number, title: string) => {
    if (!confirm(`Are you sure you want to delete the photo "${title}"? This cannot be undone.`)) {
      return;
    }

    setActionPhotoId(photoId);
    startTransition(async () => {
      try {
        const res = await deletePhoto(photoId);
        if (res.success) {
          setPhotos((prev) => prev.filter((p) => p.id !== photoId));
          triggerAlert(res.message || "Photo deleted successfully.", "success");
          router.refresh();
        } else {
          triggerAlert(res.error || "Failed to delete photo.", "error");
        }
      } catch (err) {
        triggerAlert("An error occurred while deleting the photo.", "error");
      } finally {
        setActionPhotoId(null);
      }
    });
  };

  const filteredPhotos = photos.filter((p) => {
    const search = searchQuery.toLowerCase();
    const titleMatch = p.title.toLowerCase().includes(search);
    const catMatch = p.category.name.toLowerCase().includes(search);
    const authorMatch = p.contributor.name.toLowerCase().includes(search);
    return titleMatch || catMatch || authorMatch;
  });

  return (
    <div className="space-y-6">
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

      {/* Filter search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search photos by title, category, or contributor..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-4 py-2.5 w-full rounded-xl border border-kishtwar-cream-200 bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-kishtwar-green-500 focus:border-transparent transition-all placeholder:text-gray-400"
        />
      </div>

      {/* Grid rendering */}
      {filteredPhotos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPhotos.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-kishtwar-cream-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-md hover:border-kishtwar-cream-300 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Photo thumbnail */}
              <div className="relative aspect-video w-full bg-gray-100 border-b border-kishtwar-cream-100/50 overflow-hidden group">
                <img
                  src={p.url}
                  alt={p.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Overlay details */}
                <div className="absolute top-2 left-2 flex space-x-1">
                  <span className="text-[9px] font-bold text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md">
                    {p.category.name}
                  </span>
                </div>

                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => handleToggleFeatured(p.id)}
                    disabled={isPending && actionPhotoId === p.id}
                    className={`p-1.5 rounded-lg border transition-all ${
                      p.featured
                        ? "bg-amber-500 text-white border-amber-400"
                        : "bg-black/65 text-amber-400 border-black/40 hover:bg-black/80"
                    }`}
                    title={p.featured ? "Unfeature Photo" : "Feature Photo"}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Information */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-kishtwar-green-950 text-sm truncate" title={p.title}>
                    {p.title}
                  </h3>
                  <div className="flex items-center space-x-1.5 mt-1">
                    {p.contributor.avatar ? (
                      <img
                        src={p.contributor.avatar}
                        alt={p.contributor.name}
                        className="h-5 w-5 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-5 w-5 rounded-full bg-kishtwar-cream text-kishtwar-green-900 flex items-center justify-center font-bold text-[9px] border border-kishtwar-cream-200">
                        {p.contributor.name.charAt(0)}
                      </div>
                    )}
                    <span className="text-[10px] text-gray-400 font-semibold truncate block max-w-[150px]">
                      @{p.contributor.username}
                    </span>
                  </div>
                </div>

                {/* Status and Action bar */}
                <div className="space-y-3 pt-2 border-t border-kishtwar-cream-100/50">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-medium flex items-center">
                      <Heart className="h-3 w-3 mr-0.5 text-red-400 shrink-0" />
                      {p.likeCount}
                      <Download className="h-3 w-3 ml-2 mr-0.5 text-blue-400 shrink-0" />
                      {p.downloadCount}
                    </span>

                    {/* Simple delete button */}
                    <button
                      onClick={() => handleDelete(p.id, p.title)}
                      disabled={isPending && actionPhotoId === p.id}
                      className="p-1 text-red-500 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                      title="Delete Photo"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Moderation Select */}
                  <div className="relative">
                    {isPending && actionPhotoId === p.id ? (
                      <div className="flex items-center justify-center space-x-1 py-1.5 text-[10px] text-gray-400">
                        <Loader2 className="h-3 w-3 animate-spin text-kishtwar-emerald" />
                        <span>Updating...</span>
                      </div>
                    ) : (
                      <select
                        value={p.status}
                        onChange={(e) => handleStatusChange(p.id, p.status, e.target.value as MediaStatus)}
                        className="w-full text-[10px] bg-white border border-kishtwar-cream-200 text-kishtwar-green-950 font-bold px-2 py-1.5 rounded-lg focus:outline-none cursor-pointer"
                      >
                        <option value="DRAFT">Draft</option>
                        <option value="SUBMITTED">Submitted</option>
                        <option value="PUBLISHED">Published (Public)</option>
                      </select>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-kishtwar-cream-200 rounded-3xl p-12 text-center text-gray-400 font-light text-sm shadow-xs">
          No photos found.
        </div>
      )}
    </div>
  );
}
