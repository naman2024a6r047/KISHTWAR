"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPhoto, deletePhoto } from "@/actions/gallery.actions";
import {
  Plus,
  Save,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  Heart,
  Download
} from "lucide-react";

interface Photo {
  id: number;
  url: string;
  thumbnailUrl: string | null;
  title: string;
  caption: string | null;
  status: string;
  likeCount: number;
  downloadCount: number;
  category: {
    id: number;
    name: string;
  };
}

interface ContributorPhotosManagerProps {
  initialPhotos: Photo[];
  categories: any[];
}

export default function ContributorPhotosManager({ initialPhotos, categories }: ContributorPhotosManagerProps) {
  const router = useRouter();
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [isPending, startTransition] = useTransition();
  const [alertMessage, setAlertMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");

  const triggerAlert = (text: string, type: "success" | "error") => {
    setAlertMessage({ text, type });
    setTimeout(() => setAlertMessage(null), 4000);
  };

  const resetForm = () => {
    setTitle("");
    setCaption("");
    setImageUrl("");
    setCategoryId(categories[0]?.id || "");
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !imageUrl) {
      triggerAlert("Title and Photo URL are required.", "error");
      return;
    }

    startTransition(async () => {
      try {
        const res = await createPhoto({
          title,
          caption: caption || undefined,
          url: imageUrl,
          publicId: `contrib_${Date.now()}`, // Simple mock public ID for db
          categoryId: Number(categoryId),
        });

        if (res.success) {
          triggerAlert(res.message || "Photo submitted successfully for moderation.", "success");
          resetForm();
          router.refresh();
          // Reload page locally to show new photo in list
          window.location.reload();
        } else {
          triggerAlert(res.error || "Failed to submit photo.", "error");
        }
      } catch (err) {
        triggerAlert("An error occurred.", "error");
      }
    });
  };

  const handleDelete = async (photoId: number, photoTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${photoTitle}"?`)) return;

    startTransition(async () => {
      try {
        const res = await deletePhoto(photoId);
        if (res.success) {
          setPhotos((prev) => prev.filter((p) => p.id !== photoId));
          triggerAlert("Photo deleted successfully.", "success");
          router.refresh();
        } else {
          triggerAlert(res.error || "Failed to delete photo.", "error");
        }
      } catch (err) {
        triggerAlert("An error occurred.", "error");
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "SUBMITTED":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "PUBLISHED":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-gray-50 text-gray-500 border-gray-150";
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
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

      {/* Header button */}
      <div className="flex justify-between items-center border-b border-kishtwar-cream-200 pb-2">
        <h2 className="text-sm font-serif font-bold text-kishtwar-green-950">
          Manage My Photo Contributions
        </h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-1.5 px-4 py-2 bg-kishtwar-green-900 hover:bg-kishtwar-green-950 text-white rounded-xl text-xs font-serif font-bold tracking-wide transition-all shadow-sm cursor-pointer"
          >
            <Plus className="h-4 w-4 text-kishtwar-gold shrink-0" />
            <span>Submit Photo</span>
          </button>
        )}
      </div>

      {/* Upload Form */}
      {showForm && (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-kishtwar-cream-200 p-6 shadow-sm max-w-2xl">
          <h3 className="text-base font-serif font-bold text-kishtwar-green-950 border-b border-kishtwar-cream-150 pb-2 mb-4">
            Submit New Photo
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold text-kishtwar-green-900">Photo Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Chowgan Ground at Dusk"
                  className="text-sm bg-white border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-4 py-2 text-gray-750 focus:ring-1 focus:ring-kishtwar-green-900"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold text-kishtwar-green-900">Category *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  className="text-sm bg-white border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-3 py-2.5 text-gray-750 focus:ring-1 focus:ring-kishtwar-green-900 cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-kishtwar-green-900">Photo URL *</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
                placeholder="Unsplash, Cloudinary, or any web image link..."
                className="text-sm bg-white border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-4 py-2 text-gray-750 focus:ring-1 focus:ring-kishtwar-green-900"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-kishtwar-green-900">Caption / Description</label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Explain what is in the picture, location details, camera parameters..."
                className="text-sm bg-white border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-4 py-2 min-h-[70px] text-gray-750 focus:ring-1 focus:ring-kishtwar-green-900"
              />
            </div>

            {imageUrl && (
              <div className="mt-2 rounded-xl overflow-hidden border border-kishtwar-cream-250 max-h-40 relative max-w-xs bg-gray-50 flex items-center justify-center">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="object-cover h-full w-full"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4 border-t border-kishtwar-cream-200">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-xs font-serif font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center space-x-1.5 px-5 py-2.5 bg-kishtwar-green-900 hover:bg-kishtwar-green-950 disabled:bg-kishtwar-green-800 text-white font-serif font-bold text-xs tracking-wide rounded-xl transition-all cursor-pointer"
              >
                {isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5 text-kishtwar-gold shrink-0" />
                )}
                <span>Submit Photo</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Photos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="bg-white/80 backdrop-blur-md rounded-2xl border border-kishtwar-cream-200 overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-all"
          >
            <div className="h-44 relative bg-gray-150 overflow-hidden">
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 left-2 flex gap-1">
                <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(photo.status)}`}>
                  {photo.status}
                </span>
                <span className="bg-black/60 text-kishtwar-gold text-[9px] font-bold px-2 py-0.5 rounded-full border border-kishtwar-gold/30">
                  {photo.category.name}
                </span>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="font-serif font-bold text-kishtwar-green-950 text-sm truncate" title={photo.title}>
                  {photo.title}
                </h4>
                {photo.caption && (
                  <p className="text-gray-500 text-xs line-clamp-2 mt-1 leading-relaxed">
                    {photo.caption}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-kishtwar-cream-100 pt-3">
                <div className="flex items-center space-x-3 text-xs text-gray-400 font-semibold">
                  <span className="flex items-center">
                    <Heart className="h-3.5 w-3.5 mr-1 text-red-500" /> {photo.likeCount}
                  </span>
                  <span className="flex items-center">
                    <Download className="h-3.5 w-3.5 mr-1 text-kishtwar-green-900" /> {photo.downloadCount}
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(photo.id, photo.title)}
                  disabled={isPending}
                  className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl border border-red-100 transition-all cursor-pointer"
                  title="Delete Photo"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {photos.length === 0 && !showForm && (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-kishtwar-cream-200 p-12 text-center flex flex-col items-center justify-center space-y-3">
          <ImageIcon className="h-10 w-10 text-gray-300" />
          <h3 className="font-serif font-bold text-kishtwar-green-950 text-sm">No photo contributions yet</h3>
          <p className="text-xs text-gray-500 max-w-xs font-light">
            Share high-quality photos of valleys, shrines, and local life in Kishtwar to populate the visual gallery.
          </p>
        </div>
      )}
    </div>
  );
}
