"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/common/DataTable";
import { updatePlaceStatus, deletePlace } from "@/actions/places.actions";
import type { ContentStatus } from "@prisma/client";
import { format } from "date-fns";
import { MapPin, Trash2, Edit, CheckCircle, AlertCircle, Clock, Star, Eye, Loader2 } from "lucide-react";
import Link from "next/link";

interface PlacesTableProps {
  initialPlaces: any[];
}

export default function PlacesTable({ initialPlaces }: PlacesTableProps) {
  const router = useRouter();
  const [places, setPlaces] = useState(initialPlaces);
  const [isPending, startTransition] = useTransition();
  const [actionPlaceId, setActionPlaceId] = useState<number | null>(null);
  const [alertMessage, setAlertMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const triggerAlert = (text: string, type: "success" | "error") => {
    setAlertMessage({ text, type });
    setTimeout(() => setAlertMessage(null), 4000);
  };

  const handleStatusChange = async (placeId: number, currentStatus: ContentStatus, newStatus: ContentStatus) => {
    if (currentStatus === newStatus) return;

    setActionPlaceId(placeId);
    startTransition(async () => {
      try {
        const res = await updatePlaceStatus(placeId, newStatus);
        if (res.success) {
          setPlaces((prev) =>
            prev.map((p) => (p.id === placeId ? { ...p, status: newStatus } : p))
          );
          triggerAlert(res.message || "Destination status updated successfully.", "success");
          router.refresh();
        } else {
          triggerAlert(res.error || "Failed to update status.", "error");
        }
      } catch (err) {
        triggerAlert("An error occurred while updating status.", "error");
      } finally {
        setActionPlaceId(null);
      }
    });
  };

  const handleDelete = async (placeId: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    setActionPlaceId(placeId);
    startTransition(async () => {
      try {
        const res = await deletePlace(placeId);
        if (res.success) {
          setPlaces((prev) => prev.filter((p) => p.id !== placeId));
          triggerAlert(res.message || "Destination deleted successfully.", "success");
          router.refresh();
        } else {
          triggerAlert(res.error || "Failed to delete place.", "error");
        }
      } catch (err) {
        triggerAlert("An error occurred while deleting the destination.", "error");
      } finally {
        setActionPlaceId(null);
      }
    });
  };

  const columns = [
    {
      header: "Destination Details",
      accessor: "name" as const,
      sortable: true,
      render: (row: any) => (
        <div className="flex items-center space-x-3">
          <img
            src={row.featuredImage}
            alt={row.name}
            className="h-12 w-16 object-cover rounded-lg border border-kishtwar-cream-200 shrink-0 bg-gray-50"
          />
          <div className="min-w-0">
            <span className="font-serif font-bold text-kishtwar-green-950 block truncate">
              {row.name}
            </span>
            <span className="text-[10px] text-kishtwar-gold font-bold uppercase tracking-wider block">
              {row.category.name}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Submitted By",
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
          {isPending && actionPlaceId === row.id ? (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-gray-400">
              <Loader2 className="h-3 w-3 animate-spin text-kishtwar-emerald" />
              <span>Updating...</span>
            </div>
          ) : (
            <select
              value={row.status}
              onChange={(e) => handleStatusChange(row.id, row.status, e.target.value as ContentStatus)}
              className="text-xs bg-white border border-kishtwar-cream-200 text-kishtwar-green-950 font-semibold px-2 py-1.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-kishtwar-green-500 cursor-pointer"
            >
              <option value="DRAFT">Draft</option>
              <option value="SUBMITTED">Submitted (Under Review)</option>
              <option value="APPROVED">Approved</option>
              <option value="PUBLISHED">Published</option>
              <option value="REJECTED">Rejected</option>
            </select>
          )}
        </div>
      ),
    },
    {
      header: "Metrics",
      accessor: "viewCount" as const,
      sortable: true,
      render: (row: any) => (
        <div className="flex flex-col space-y-0.5 text-xs text-gray-500 font-light">
          <span className="flex items-center">
            <Eye className="h-3.5 w-3.5 mr-1 text-gray-450 shrink-0" />
            <span className="font-semibold text-gray-700 mr-1">{row.viewCount}</span> views
          </span>
          <span className="flex items-center">
            <Star className="h-3.5 w-3.5 mr-1 text-amber-500 fill-amber-500 shrink-0" />
            <span className="font-semibold text-gray-700 mr-1">{Number(row.averageRating).toFixed(1)}</span>
            <span className="text-gray-400">({row.reviewCount})</span>
          </span>
        </div>
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
          <Link
            href={`/admin/places/${row.id}/edit`}
            className="p-2 bg-kishtwar-cream/30 hover:bg-kishtwar-cream/50 text-kishtwar-green-900 border border-kishtwar-cream-200 hover:border-kishtwar-cream-300 rounded-xl transition-all"
            title="Edit Details"
          >
            <Edit className="h-4 w-4" />
          </Link>
          <button
            onClick={() => handleDelete(row.id, row.name)}
            disabled={isPending && actionPlaceId === row.id}
            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl border border-red-100 transition-all cursor-pointer"
            title="Delete Destination"
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
        data={places}
        searchKey="name"
        searchPlaceholder="Filter destinations by name..."
        pageSize={10}
      />
    </div>
  );
}
