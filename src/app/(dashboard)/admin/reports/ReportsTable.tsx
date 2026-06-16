"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/common/DataTable";
import { updateReportStatus } from "@/actions/reports.actions";
import type { ReportStatus, ReportReason } from "@prisma/client";
import { format } from "date-fns";
import { Flag, Trash2, CheckCircle, AlertCircle, Eye, Edit2, Loader2, Link as LinkIcon, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface ReportsTableProps {
  initialReports: any[];
}

export default function ReportsTable({ initialReports }: ReportsTableProps) {
  const router = useRouter();
  const [reports, setReports] = useState(initialReports);
  const [isPending, startTransition] = useTransition();
  const [actionReportId, setActionReportId] = useState<number | null>(null);
  const [editingNotesId, setEditingNotesId] = useState<number | null>(null);
  const [tempNotes, setTempNotes] = useState("");
  const [alertMessage, setAlertMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const triggerAlert = (text: string, type: "success" | "error") => {
    setAlertMessage({ text, type });
    setTimeout(() => setAlertMessage(null), 4000);
  };

  const handleStatusChange = async (reportId: number, currentStatus: ReportStatus, newStatus: ReportStatus) => {
    if (currentStatus === newStatus) return;

    setActionReportId(reportId);
    startTransition(async () => {
      try {
        const res = await updateReportStatus(reportId, newStatus);
        if (res.success) {
          setReports((prev) =>
            prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
          );
          triggerAlert(res.message || "Report status updated successfully.", "success");
          router.refresh();
        } else {
          triggerAlert(res.error || "Failed to update status.", "error");
        }
      } catch (err) {
        triggerAlert("An error occurred while updating status.", "error");
      } finally {
        setActionReportId(null);
      }
    });
  };

  const handleNotesSubmit = async (reportId: number) => {
    setActionReportId(reportId);
    startTransition(async () => {
      try {
        const report = reports.find((r) => r.id === reportId);
        const res = await updateReportStatus(reportId, report.status, tempNotes);
        if (res.success) {
          setReports((prev) =>
            prev.map((r) => (r.id === reportId ? { ...r, adminNotes: tempNotes } : r))
          );
          setEditingNotesId(null);
          triggerAlert("Admin notes updated successfully.", "success");
          router.refresh();
        } else {
          triggerAlert(res.error || "Failed to update notes.", "error");
        }
      } catch (err) {
        triggerAlert("An error occurred while saving notes.", "error");
      } finally {
        setActionReportId(null);
      }
    });
  };

  const getReasonColor = (reason: ReportReason) => {
    switch (reason) {
      case "SPAM":
        return "bg-rose-50 border-rose-100 text-rose-700";
      case "INAPPROPRIATE":
        return "bg-amber-50 border-amber-100 text-amber-700";
      case "MISLEADING":
        return "bg-sky-50 border-sky-100 text-sky-700";
      case "COPYRIGHT":
        return "bg-purple-50 border-purple-100 text-purple-700";
      default:
        return "bg-gray-50 border-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "REVIEWED":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "RESOLVED":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "DISMISSED":
        return "bg-gray-150 text-gray-750 border-gray-200";
      default:
        return "bg-gray-50 text-gray-650";
    }
  };

  const columns = [
    {
      header: "Reporter",
      accessor: (row: any) => row.user.name,
      sortable: true,
      render: (row: any) => (
        <div className="flex items-center space-x-2">
          {row.user.avatar ? (
            <img
              src={row.user.avatar}
              alt={row.user.name}
              className="h-7 w-7 rounded-full object-cover border border-kishtwar-cream-200"
            />
          ) : (
            <div className="h-7 w-7 rounded-full bg-kishtwar-cream text-kishtwar-green-900 border border-kishtwar-cream-200 flex items-center justify-center font-bold text-[10px]">
              {row.user.name.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <span className="text-gray-900 font-bold text-xs block truncate max-w-[110px]">
              {row.user.name}
            </span>
            <span className="text-[10px] text-gray-400 block truncate max-w-[110px]">
              @{row.user.username}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Reason & Info",
      accessor: "reason" as const,
      sortable: true,
      render: (row: any) => (
        <div className="space-y-1 max-w-[250px]">
          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${getReasonColor(row.reason)}`}>
            {row.reason}
          </span>
          <p className="text-xs text-gray-700 font-medium whitespace-pre-wrap break-words line-clamp-2" title={row.description}>
            {row.description || <span className="text-gray-400 font-light italic">No explanation provided</span>}
          </p>
        </div>
      ),
    },
    {
      header: "Reported Item",
      accessor: "referenceType" as const,
      sortable: true,
      render: (row: any) => {
        const item = row.reportedItem;
        if (!item) {
          return (
            <div className="flex items-center text-xs text-red-500 font-semibold">
              <AlertTriangle className="h-3.5 w-3.5 mr-1" />
              <span>Item deleted or not found</span>
            </div>
          );
        }

        let link = "";
        let title = "";

        if (row.referenceType === "Blog") {
          link = `/blog/${item.slug}`;
          title = item.title;
        } else if (row.referenceType === "Place" || row.referenceType === "TouristPlace") {
          link = `/tourist-places/${item.slug}`;
          title = item.name;
        } else if (row.referenceType === "Comment") {
          title = item.content;
        } else if (row.referenceType === "Photo") {
          link = item.url;
          title = item.title;
        } else if (row.referenceType === "Video") {
          link = item.youtubeUrl;
          title = item.title;
        }

        return (
          <div className="flex flex-col text-xs max-w-[180px]">
            <span className="text-[10px] text-kishtwar-gold font-bold uppercase tracking-wider">
              {row.referenceType}
            </span>
            {link ? (
              <Link
                href={link}
                target="_blank"
                className="text-gray-700 hover:text-kishtwar-green-900 font-serif font-bold truncate block underline decoration-dotted hover:decoration-solid"
                title={title}
              >
                {title}
              </Link>
            ) : (
              <span className="text-gray-700 font-medium truncate block" title={title}>
                {title}
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: "Status",
      accessor: "status" as const,
      sortable: true,
      render: (row: any) => (
        <div className="relative inline-block">
          {isPending && actionReportId === row.id && editingNotesId !== row.id ? (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-gray-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-kishtwar-emerald" />
              <span>Updating...</span>
            </div>
          ) : (
            <select
              value={row.status}
              onChange={(e) => handleStatusChange(row.id, row.status, e.target.value as ReportStatus)}
              className="text-xs bg-white border border-kishtwar-cream-200 text-kishtwar-green-950 font-semibold px-2 py-1.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-kishtwar-green-500 cursor-pointer"
            >
              <option value="PENDING">Pending</option>
              <option value="REVIEWED">Reviewed</option>
              <option value="RESOLVED">Resolved</option>
              <option value="DISMISSED">Dismissed</option>
            </select>
          )}
        </div>
      ),
    },
    {
      header: "Admin Notes",
      accessor: "adminNotes" as const,
      render: (row: any) => {
        if (editingNotesId === row.id) {
          return (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={tempNotes}
                onChange={(e) => setTempNotes(e.target.value)}
                placeholder="Enter notes..."
                className="text-xs border border-kishtwar-cream-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-kishtwar-green-550 w-[140px]"
              />
              <button
                onClick={() => handleNotesSubmit(row.id)}
                disabled={isPending}
                className="text-xs bg-kishtwar-green-900 text-white font-bold px-2 py-1 rounded-lg hover:bg-kishtwar-green-950 cursor-pointer"
              >
                Save
              </button>
              <button
                onClick={() => setEditingNotesId(null)}
                className="text-xs text-gray-400 font-semibold px-1.5 py-1 rounded hover:bg-gray-100 cursor-pointer"
              >
                X
              </button>
            </div>
          );
        }

        return (
          <div className="flex items-center space-x-1 max-w-[160px]">
            <span className="text-xs text-gray-500 font-medium truncate block max-w-[130px]" title={row.adminNotes || ""}>
              {row.adminNotes || <span className="text-gray-400 italic font-light">None</span>}
            </span>
            <button
              onClick={() => {
                setEditingNotesId(row.id);
                setTempNotes(row.adminNotes || "");
              }}
              className="p-1 hover:bg-kishtwar-cream/50 text-gray-400 hover:text-kishtwar-green-900 rounded-lg transition-all"
              title="Edit Admin Notes"
            >
              <Edit2 className="h-3 w-3" />
            </button>
          </div>
        );
      },
    },
    {
      header: "Reported At",
      accessor: "createdAt" as const,
      sortable: true,
      render: (row: any) => (
        <span className="text-gray-400 font-medium text-xs block min-w-[90px]">
          {format(new Date(row.createdAt), "MMM dd, yyyy")}
        </span>
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
        data={reports}
        searchKey="description"
        searchPlaceholder="Filter reports by explanation..."
        pageSize={10}
      />
    </div>
  );
}
