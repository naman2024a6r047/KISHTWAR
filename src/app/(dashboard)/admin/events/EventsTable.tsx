"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/common/DataTable";
import { updateEventStatus, toggleEventFeatured, deleteEvent } from "@/actions/events.actions";
import type { ContentStatus } from "@prisma/client";
import { format } from "date-fns";
import { Calendar, Trash2, Edit, CheckCircle, AlertCircle, Sparkles, MapPin, Loader2 } from "lucide-react";
import Link from "next/link";

interface EventsTableProps {
  initialEvents: any[];
}

export default function EventsTable({ initialEvents }: EventsTableProps) {
  const router = useRouter();
  const [events, setEvents] = useState(initialEvents);
  const [isPending, startTransition] = useTransition();
  const [actionEventId, setActionEventId] = useState<number | null>(null);
  const [alertMessage, setAlertMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const triggerAlert = (text: string, type: "success" | "error") => {
    setAlertMessage({ text, type });
    setTimeout(() => setAlertMessage(null), 4000);
  };

  const handleStatusChange = async (eventId: number, currentStatus: ContentStatus, newStatus: ContentStatus) => {
    if (currentStatus === newStatus) return;

    setActionEventId(eventId);
    startTransition(async () => {
      try {
        const res = await updateEventStatus(eventId, newStatus);
        if (res.success) {
          setEvents((prev) =>
            prev.map((e) => (e.id === eventId ? { ...e, status: newStatus } : e))
          );
          triggerAlert(res.message || "Event status updated successfully.", "success");
          router.refresh();
        } else {
          triggerAlert(res.error || "Failed to update status.", "error");
        }
      } catch (err) {
        triggerAlert("An error occurred while updating status.", "error");
      } finally {
        setActionEventId(null);
      }
    });
  };

  const handleToggleFeatured = async (eventId: number) => {
    setActionEventId(eventId);
    startTransition(async () => {
      try {
        const res = await toggleEventFeatured(eventId);
        if (res.success) {
          setEvents((prev) =>
            prev.map((e) => (e.id === eventId ? { ...e, featured: !e.featured } : e))
          );
          triggerAlert(res.message || "Event featured status updated.", "success");
          router.refresh();
        } else {
          triggerAlert(res.error || "Failed to toggle featured status.", "error");
        }
      } catch (err) {
        triggerAlert("An error occurred while toggling featured status.", "error");
      } finally {
        setActionEventId(null);
      }
    });
  };

  const handleDelete = async (eventId: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    setActionEventId(eventId);
    startTransition(async () => {
      try {
        const res = await deleteEvent(eventId);
        if (res.success) {
          setEvents((prev) => prev.filter((e) => e.id !== eventId));
          triggerAlert(res.message || "Event deleted successfully.", "success");
          router.refresh();
        } else {
          triggerAlert(res.error || "Failed to delete event.", "error");
        }
      } catch (err) {
        triggerAlert("An error occurred while deleting the event.", "error");
      } finally {
        setActionEventId(null);
      }
    });
  };

  const columns = [
    {
      header: "Event Details",
      accessor: "name" as const,
      sortable: true,
      render: (row: any) => (
        <div className="flex items-center space-x-3">
          {row.banner ? (
            <img
              src={row.banner}
              alt={row.name}
              className="h-10 w-16 object-cover rounded-lg border border-kishtwar-cream-200 shrink-0 bg-gray-50"
            />
          ) : (
            <div className="h-10 w-16 rounded-lg bg-kishtwar-cream border border-kishtwar-cream-200 text-kishtwar-green-900 flex items-center justify-center font-bold text-xs shrink-0">
              <Calendar className="h-4 w-4" />
            </div>
          )}
          <div className="min-w-0">
            <span className="font-serif font-bold text-kishtwar-green-950 block truncate max-w-[200px]" title={row.name}>
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
      header: "Contributor",
      accessor: (row: any) => row.contributor?.name || "System",
      sortable: true,
      render: (row: any) => (
        <div className="flex items-center space-x-2">
          {row.contributor?.avatar ? (
            <img
              src={row.contributor.avatar}
              alt={row.contributor.name}
              className="h-6 w-6 rounded-full object-cover border border-kishtwar-cream-200"
            />
          ) : (
            <div className="h-6 w-6 rounded-full bg-kishtwar-cream text-kishtwar-green-900 border border-kishtwar-cream-200 flex items-center justify-center font-bold text-[10px]">
              {row.contributor?.name ? row.contributor.name.charAt(0) : "S"}
            </div>
          )}
          <span className="text-gray-750 font-medium truncate block max-w-[120px]">
            {row.contributor?.name || "System"}
          </span>
        </div>
      ),
    },
    {
      header: "Location",
      accessor: "location" as const,
      sortable: true,
      render: (row: any) => (
        <span className="text-xs text-gray-700 font-semibold flex items-center truncate max-w-[150px]" title={row.location}>
          <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400 shrink-0" />
          {row.location || "N/A"}
        </span>
      ),
    },
    {
      header: "Event Dates",
      accessor: "startDate" as const,
      sortable: true,
      render: (row: any) => {
        const start = format(new Date(row.startDate), "MMM dd, yyyy");
        const end = row.endDate ? format(new Date(row.endDate), "MMM dd, yyyy") : null;
        return (
          <div className="flex flex-col text-xs text-gray-500">
            <span className="font-semibold text-gray-700">{start}</span>
            {end && <span className="text-[10px]">to {end}</span>}
          </div>
        );
      },
    },
    {
      header: "Moderation Status",
      accessor: "status" as const,
      sortable: true,
      render: (row: any) => (
        <div className="relative inline-block">
          {isPending && actionEventId === row.id ? (
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
              <option value="SUBMITTED">Submitted</option>
              <option value="APPROVED">Approved</option>
              <option value="PUBLISHED">Published</option>
              <option value="REJECTED">Rejected</option>
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
          disabled={isPending && actionEventId === row.id}
          className={`p-1.5 rounded-lg border transition-all ${
            row.featured
              ? "bg-amber-500 text-white border-amber-400"
              : "bg-kishtwar-cream/35 text-amber-500 border-kishtwar-cream-200 hover:bg-kishtwar-cream/50"
          }`}
          title={row.featured ? "Unfeature Event" : "Feature Event"}
        >
          <Sparkles className="h-3.5 w-3.5" />
        </button>
      ),
    },
    {
      header: "Actions",
      accessor: "id" as const,
      render: (row: any) => (
        <div className="flex items-center space-x-2">
          <Link
            href={`/contributor/events/${row.id}/edit`}
            className="p-2 bg-kishtwar-cream/30 hover:bg-kishtwar-cream/50 text-kishtwar-green-900 border border-kishtwar-cream-200 hover:border-kishtwar-cream-300 rounded-xl transition-all"
            title="Edit Event"
          >
            <Edit className="h-4 w-4" />
          </Link>
          <button
            onClick={() => handleDelete(row.id, row.name)}
            disabled={isPending && actionEventId === row.id}
            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl border border-red-100 transition-all cursor-pointer"
            title="Delete Event"
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
        data={events}
        searchKey="name"
        searchPlaceholder="Filter events by name..."
        pageSize={10}
      />
    </div>
  );
}
