"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createVideo, deleteVideo } from "@/actions/videos.actions";
import {
  Plus,
  Save,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  Video,
  Eye,
  Link as LinkIcon,
  Globe
} from "lucide-react";

interface VideoData {
  id: number;
  youtubeUrl: string;
  youtubeId: string;
  thumbnail: string | null;
  title: string;
  description: string | null;
  status: string;
  viewCount: number;
  category: {
    id: number;
    name: string;
  };
}

interface ContributorVideosManagerProps {
  initialVideos: VideoData[];
  categories: any[];
}

export default function ContributorVideosManager({ initialVideos, categories }: ContributorVideosManagerProps) {
  const router = useRouter();
  const [videos, setVideos] = useState<VideoData[]>(initialVideos);
  const [isPending, startTransition] = useTransition();
  const [alertMessage, setAlertMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");

  const triggerAlert = (text: string, type: "success" | "error") => {
    setAlertMessage({ text, type });
    setTimeout(() => setAlertMessage(null), 4000);
  };

  const resetForm = () => {
    setTitle("");
    setYoutubeUrl("");
    setDescription("");
    setCategoryId(categories[0]?.id || "");
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !youtubeUrl) {
      triggerAlert("Title and YouTube URL are required.", "error");
      return;
    }

    startTransition(async () => {
      try {
        const res = await createVideo({
          title,
          youtubeUrl,
          description: description || undefined,
          categoryId: Number(categoryId),
        });

        if (res.success) {
          triggerAlert(res.message || "Video submitted successfully for moderation.", "success");
          resetForm();
          router.refresh();
          window.location.reload();
        } else {
          triggerAlert(res.error || "Failed to submit video.", "error");
        }
      } catch (err) {
        triggerAlert("An error occurred.", "error");
      }
    });
  };

  const handleDelete = async (videoId: number, videoTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${videoTitle}"?`)) return;

    startTransition(async () => {
      try {
        const res = await deleteVideo(videoId);
        if (res.success) {
          setVideos((prev) => prev.filter((v) => v.id !== videoId));
          triggerAlert("Video deleted successfully.", "success");
          router.refresh();
        } else {
          triggerAlert(res.error || "Failed to delete video.", "error");
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
        return "bg-gray-55 text-gray-500 border-gray-150";
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
          Manage My Video Contributions
        </h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-1.5 px-4 py-2 bg-kishtwar-green-900 hover:bg-kishtwar-green-950 text-white rounded-xl text-xs font-serif font-bold tracking-wide transition-all shadow-sm cursor-pointer"
          >
            <Plus className="h-4 w-4 text-kishtwar-gold shrink-0" />
            <span>Submit Video</span>
          </button>
        )}
      </div>

      {/* Video Submission Form */}
      {showForm && (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-kishtwar-cream-200 p-6 shadow-sm max-w-2xl">
          <h3 className="text-base font-serif font-bold text-kishtwar-green-950 border-b border-kishtwar-cream-150 pb-2 mb-4">
            Submit New Video Link
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold text-kishtwar-green-900">Video Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Hiking to Margan Pass"
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
              <label className="text-xs font-bold text-kishtwar-green-900">YouTube Video URL *</label>
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                required
                placeholder="e.g. https://www.youtube.com/watch?v=..."
                className="text-sm bg-white border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-4 py-2 text-gray-750 focus:ring-1 focus:ring-kishtwar-green-900"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-kishtwar-green-900">Short Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly summarize what this video covers..."
                className="text-sm bg-white border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-4 py-2 min-h-[70px] text-gray-750 focus:ring-1 focus:ring-kishtwar-green-900"
              />
            </div>

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
                <span>Submit Video</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {videos.map((vid) => (
          <div
            key={vid.id}
            className="bg-white/80 backdrop-blur-md rounded-2xl border border-kishtwar-cream-200 overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-all"
          >
            <div className="h-44 relative bg-gray-150 overflow-hidden">
              {vid.thumbnail ? (
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-kishtwar-cream flex items-center justify-center text-kishtwar-green-900">
                  <Video className="h-10 w-10" />
                </div>
              )}
              <div className="absolute top-2 left-2 flex gap-1">
                <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(vid.status)}`}>
                  {vid.status}
                </span>
                <span className="bg-black/60 text-kishtwar-gold text-[9px] font-bold px-2 py-0.5 rounded-full border border-kishtwar-gold/30">
                  {vid.category.name}
                </span>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="font-serif font-bold text-kishtwar-green-950 text-sm truncate" title={vid.title}>
                  {vid.title}
                </h4>
                {vid.description && (
                  <p className="text-gray-500 text-xs line-clamp-2 mt-1 leading-relaxed">
                    {vid.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-kishtwar-cream-100 pt-3">
                <div className="flex items-center space-x-2 text-xs text-gray-400 font-semibold">
                  <Eye className="h-3.5 w-3.5 mr-0.5 text-gray-400" />
                  <span>{vid.viewCount} views</span>
                </div>

                <div className="flex items-center space-x-1.5">
                  <a
                    href={vid.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-kishtwar-cream/30 hover:bg-kishtwar-cream/55 text-kishtwar-green-900 border border-kishtwar-cream-200 rounded-xl transition-all"
                    title="Watch on YouTube"
                  >
                    <Globe className="h-3.5 w-3.5" />
                  </a>
                  <button
                    onClick={() => handleDelete(vid.id, vid.title)}
                    disabled={isPending}
                    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl border border-red-100 transition-all cursor-pointer"
                    title="Delete Video"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {videos.length === 0 && !showForm && (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-kishtwar-cream-200 p-12 text-center flex flex-col items-center justify-center space-y-3">
          <Video className="h-10 w-10 text-gray-300" />
          <h3 className="font-serif font-bold text-kishtwar-green-950 text-sm">No video contributions yet</h3>
          <p className="text-xs text-gray-500 max-w-xs font-light">
            Share YouTube video links showcasing travel vlogs, treks, and documentaries of Kishtwar.
          </p>
        </div>
      )}
    </div>
  );
}
