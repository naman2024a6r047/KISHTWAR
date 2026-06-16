"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/common/DataTable";
import { deleteAdminComment } from "@/actions/comments.actions";
import { format } from "date-fns";
import { MessageSquare, Trash2, CheckCircle, AlertCircle, Eye, Loader2, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

interface CommentsTableProps {
  initialComments: any[];
}

export default function CommentsTable({ initialComments }: CommentsTableProps) {
  const router = useRouter();
  const [comments, setComments] = useState(initialComments);
  const [isPending, startTransition] = useTransition();
  const [actionCommentId, setActionCommentId] = useState<number | null>(null);
  const [alertMessage, setAlertMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const triggerAlert = (text: string, type: "success" | "error") => {
    setAlertMessage({ text, type });
    setTimeout(() => setAlertMessage(null), 4000);
  };

  const handleDelete = async (commentId: number, excerpt: string) => {
    if (!confirm(`Are you sure you want to delete the comment "${excerpt}"? This cannot be undone.`)) {
      return;
    }

    setActionCommentId(commentId);
    startTransition(async () => {
      try {
        const res = await deleteAdminComment(commentId);
        if (res.success) {
          setComments((prev) => prev.filter((c) => c.id !== commentId));
          triggerAlert(res.message || "Comment deleted successfully.", "success");
          router.refresh();
        } else {
          triggerAlert(res.error || "Failed to delete comment.", "error");
        }
      } catch (err) {
        triggerAlert("An error occurred while deleting the comment.", "error");
      } finally {
        setActionCommentId(null);
      }
    });
  };

  const columns = [
    {
      header: "Author",
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
            <span className="text-gray-900 font-bold text-xs block truncate max-w-[120px]">
              {row.user.name}
            </span>
            <span className="text-[10px] text-gray-400 block truncate max-w-[120px]">
              @{row.user.username}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Comment Content",
      accessor: "content" as const,
      sortable: true,
      render: (row: any) => (
        <div className="max-w-[320px] sm:max-w-[450px]">
          <p className="text-xs text-gray-700 font-medium whitespace-pre-wrap break-words line-clamp-3">
            {row.content}
          </p>
          {row.isEdited && (
            <span className="text-[9px] text-kishtwar-gold font-bold uppercase tracking-wider mt-0.5 block">
              (Edited)
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Target Content",
      accessor: (row: any) => {
        if (row.blog) return `Blog: ${row.blog.title}`;
        if (row.place) return `Place: ${row.place.name}`;
        if (row.photo) return `Photo: ${row.photo.title}`;
        return "Unknown";
      },
      sortable: true,
      render: (row: any) => {
        let type = "";
        let title = "";
        let link = "";

        if (row.blog) {
          type = "Blog";
          title = row.blog.title;
          link = `/blog/${row.blog.slug}`;
        } else if (row.place) {
          type = "Tourist Place";
          title = row.place.name;
          link = `/tourist-places/${row.place.slug}`;
        } else if (row.photo) {
          type = "Photo";
          title = row.photo.title;
          link = `/gallery`; // Gallery doesn't have individual slugs, goes to gallery overview
        }

        if (!type) return <span className="text-gray-400 text-xs">N/A</span>;

        return (
          <div className="flex flex-col text-xs max-w-[180px]">
            <span className="text-[10px] text-kishtwar-emerald font-bold uppercase tracking-wider">
              {type}
            </span>
            <Link
              href={link}
              target="_blank"
              className="text-gray-750 hover:text-kishtwar-green-900 font-serif font-bold truncate block underline decoration-dotted hover:decoration-solid"
              title={title}
            >
              {title}
            </Link>
          </div>
        );
      },
    },
    {
      header: "Posted Date",
      accessor: "createdAt" as const,
      sortable: true,
      render: (row: any) => (
        <span className="text-gray-400 font-medium text-xs block min-w-[110px]">
          {format(new Date(row.createdAt), "MMM dd, yyyy HH:mm")}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "id" as const,
      render: (row: any) => (
        <div className="flex items-center space-x-2">
          {row.blog || row.place ? (
            <Link
              href={row.blog ? `/blog/${row.blog.slug}` : `/tourist-places/${row.place.slug}`}
              target="_blank"
              className="p-2 bg-kishtwar-cream/30 hover:bg-kishtwar-cream/50 text-kishtwar-green-900 border border-kishtwar-cream-200 rounded-xl transition-all"
              title="View on Public Page"
            >
              <LinkIcon className="h-4 w-4" />
            </Link>
          ) : null}
          <button
            onClick={() => handleDelete(row.id, row.content.slice(0, 30))}
            disabled={isPending && actionCommentId === row.id}
            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl border border-red-100 transition-all cursor-pointer"
            title="Delete Comment"
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
        data={comments}
        searchKey="content"
        searchPlaceholder="Search comment text..."
        pageSize={15}
      />
    </div>
  );
}
