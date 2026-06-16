"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/common/DataTable";
import { updateVideoStatus, toggleVideoFeatured, deleteVideo } from "@/actions/videos.actions";
import type { MediaStatus } from "@prisma/client";
import { format } from "date-fns";
import { Video, Trash2, Globe, CheckCircle, AlertCircle, Clock, Sparkles, Eye, Loader2 } from "lucide-react";

interface VideosTableProps {
  initialVideos: any[];
}

export default function VideosTable({ initialVideos }: VideosTableProps) {
  const router = useRouter();
  const [videos, setVideos] = useState(initialVideos);
  const [isPending, startTransition] = useTransition();
  const [actionVideoId, setActionVideoId] = useState<number | null>(null);
  const [alertMessage, setAlertMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const triggerAlert = (text: string, type: "success" | "error") => {
    setAlertMessage({ text, type });
    setTimeout(() => setAlertMessage(null), 4000);
  };

  const handleStatusChange = async (videoId: number, currentStatus: MediaStatus, newStatus: MediaStatus) => {
    if (currentStatus === newStatus) return;

    setActionVideoId(videoId);
    startTransition(async () => {
      try {
        const res = await updateVideoStatus(videoId, newStatus);
        if (res.success) {
          setVideos((prev) =>
            prev.map((v) => (v.id === videoId ? { ...v, status: newStatus } : v))
          );
          triggerAlert(res.message || "Video status updated successfully.", "success");
          router.refresh();
        } else {
          triggerAlert(res.error || "Failed to update status.", "error");
        }
      } catch (err) {
        triggerAlert("An error occurred while updating status.", "error");
      } finally {
        setActionVideoId(null);
      }
    });
  };

  const handleToggleFeatured = async (videoId: number) => {
    setActionVideoId(videoId);
    startTransition(async () => {
      try {
        const res = await toggleVideoFeatured(videoId);
        if (res.success) {
          setVideos((prev) =>
            prev.map((v) => (v.id === videoId ? { ...v, featured: !v.featured } : v))
          );
          triggerAlert(res.message || "Video featured status updated.", "success");
          router.refresh();
        } else {
          triggerAlert(res.error || "Failed to toggle featured status.", "error");
        }
      } catch (err) {
        triggerAlert("An error occurred while toggling featured status.", "error");
      } finally {
        setActionVideoId(null);
      }
    });
  };

  const handleDelete = async (videoId: number, title: string) => {
    if (!confirm(`Are you sure you want to delete the video entry "${title}"? This cannot be undone.`)) {
      return;
    }

    setActionVideoId(videoId);
    startTransition(async () => {
      try {
        const res = await deleteVideo(videoId);
        if (res.success) {
          setVideos((prev) => prev.filter((v) => v.id !== videoId));
          triggerAlert(res.message || "Video deleted successfully.", "success");
          router.refresh();
        } else {
          triggerAlert(res.error || "Failed to delete video.", "error");
        }
      } catch (err) {
        triggerAlert("An error occurred while deleting the video entry.", "error");
      } finally {
        setActionVideoId(null);
      }
    });
  };

  const columns = [
    {
      header: "Video Details",
      accessor: "title" as const,
      sortable: true,
      render: (row: any) => (
        <div className="flex items-center space-x-3">
          {row.thumbnail ? (
            <img
              src={row.thumbnail}
              alt={row.title}
              className="h-10 w-16 object-cover rounded-lg border border-kishtwar-cream-200 shrink-0 bg-gray-50"
            />
          ) : (
            <div className="h-10 w-16 rounded-lg bg-kishtwar-cream border border-kishtwar-cream-200 text-kishtwar-green-900 flex items-center justify-center font-bold text-xs shrink-0">
              <Video className="h-4 w-4" />
            </div>
          )}
          <div className="min-w-0">
            <span className="font-serif font-bold text-kishtwar-green-950 block truncate max-w-[200px]" title={row.title}>
              {row.title}
            </span>
            <span className="text-[10px] text-kishtwar-gold font-bold uppercase tracking-wider block">
              {row.category.name}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Contributor",
      accessor: (row: any) => row.contributor.name,
      sortable: true,
      render: (row: any) => (
        <div className="flex items-center space-x-2">
          {row.contributor.avatar ? (
            <img
              src={row.contributor.avatar}
              alt={row.contributor.name}
              className="h-6 w-6 rounded-full object-cover border border-kishtwar-cream-200"
            />
          ) : (
            <div className="h-6 w-6 rounded-full bg-kishtwar-cream text-kishtwar-green-900 border border-kishtwar-cream-200 flex items-center justify-center font-bold text-[10px]">
              {row.contributor.name.charAt(0)}
            </div>
          )}
          <span className="text-gray-750 font-medium truncate block max-w-[120px]">
            {row.contributor.name}
          </span>
        </div>
      ),
    },
    {
      header: "Moderation Status",
      accessor: "status" as const,
      sortable: true,
      render: (row: any) => (
        <div className="relative inline-block">
          {isPending && actionVideoId === row.id ? (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-gray-400">
              <Loader2 className="h-3 w-3 animate-spin text-kishtwar-emerald" />
              <span>Updating...</span>
            </div>
          ) : (
            <select
              value={row.status}
              onChange={(e) => handleStatusChange(row.id, row.status, e.target.value as MediaStatus)}
              className="text-xs bg-white border border-kishtwar-cream-200 text-kishtwar-green-950 font-semibold px-2 py-1.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-kishtwar-green-500 cursor-pointer"
            >
              <option value="DRAFT">Draft</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="PUBLISHED">Published</option>
            </select>
          )}
        </div>
      ),
    },
    {
      header: "Featured",
      accessor: "featured" as const,
      sortable: true,
      render: (row: any) => (
        <button
          onClick={() => handleToggleFeatured(row.id)}
          disabled={isPending && actionVideoId === row.id}
          className={`p-1.5 rounded-lg border transition-all ${
            row.featured
              ? "bg-amber-500 text-white border-amber-400"
              : "bg-kishtwar-cream/35 text-amber-500 border-kishtwar-cream-200 hover:bg-kishtwar-cream/50"
          }`}
          title={row.featured ? "Unfeature Video" : "Feature Video"}
        >
          <Sparkles className="h-3.5 w-3.5" />
        </button>
      ),
    },
    {
      header: "Views",
      accessor: "viewCount" as const,
      sortable: true,
      render: (row: any) => (
        <span className="text-gray-700 font-semibold text-xs flex items-center">
          <Eye className="h-3.5 w-3.5 mr-1 text-gray-400 shrink-0" />
          {row.viewCount}
        </span>
      ),
    },
    {
      header: "Created Date",
      accessor: "createdAt" as const,
      sortable: true,
      render: (row: any) => (
        <span className="text-gray-400 font-medium text-xs">
          {format(new Date(row.createdAt), "MMM dd, yyyy")}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "id" as const,
      render: (row: any) => (
        <div className="flex items-center space-x-2">
          <a
            href={row.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-kishtwar-cream/30 hover:bg-kishtwar-cream/50 text-kishtwar-green-900 border border-kishtwar-cream-200 rounded-xl transition-all"
            title="Open on YouTube"
          >
            <Globe className="h-4 w-4" />
          </a>
          <button
            onClick={() => handleDelete(row.id, row.title)}
            disabled={isPending && actionVideoId === row.id}
            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl border border-red-100 transition-all cursor-pointer"
            title="Delete Video"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4 relative">
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

      {/* Main Datatable */}
      <DataTable
        columns={columns}
        data={videos}
        searchKey="title"
        searchPlaceholder="Filter videos by title..."
        pageSize={10}
      />
    </div>
  );
}
