"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/common/DataTable";
import { updateBlogStatus, deleteBlog } from "@/actions/blogs.actions";
import type { ContentStatus } from "@prisma/client";
import { format } from "date-fns";
import { BookOpen, Trash2, Edit, CheckCircle, AlertCircle, Clock, Heart, MessageSquare, Eye, Loader2 } from "lucide-react";
import Link from "next/link";

interface BlogsTableProps {
  initialBlogs: any[];
}

export default function BlogsTable({ initialBlogs }: BlogsTableProps) {
  const router = useRouter();
  const [blogs, setBlogs] = useState(initialBlogs);
  const [isPending, startTransition] = useTransition();
  const [actionBlogId, setActionBlogId] = useState<number | null>(null);
  const [alertMessage, setAlertMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const triggerAlert = (text: string, type: "success" | "error") => {
    setAlertMessage({ text, type });
    setTimeout(() => setAlertMessage(null), 4000);
  };

  const handleStatusChange = async (blogId: number, currentStatus: ContentStatus, newStatus: ContentStatus) => {
    if (currentStatus === newStatus) return;

    setActionBlogId(blogId);
    startTransition(async () => {
      try {
        const res = await updateBlogStatus(blogId, newStatus);
        if (res.success) {
          setBlogs((prev) =>
            prev.map((b) => (b.id === blogId ? { ...b, status: newStatus } : b))
          );
          triggerAlert(res.message || "Blog status updated successfully.", "success");
          router.refresh();
        } else {
          triggerAlert(res.error || "Failed to update status.", "error");
        }
      } catch (err) {
        triggerAlert("An error occurred while updating status.", "error");
      } finally {
        setActionBlogId(null);
      }
    });
  };

  const handleDelete = async (blogId: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    setActionBlogId(blogId);
    startTransition(async () => {
      try {
        const res = await deleteBlog(blogId);
        if (res.success) {
          setBlogs((prev) => prev.filter((b) => b.id !== blogId));
          triggerAlert(res.message || "Blog deleted successfully.", "success");
          router.refresh();
        } else {
          triggerAlert(res.error || "Failed to delete blog.", "error");
        }
      } catch (err) {
        triggerAlert("An error occurred while deleting the blog.", "error");
      } finally {
        setActionBlogId(null);
      }
    });
  };

  const columns = [
    {
      header: "Story / Blog Details",
      accessor: "title" as const,
      sortable: true,
      render: (row: any) => (
        <div className="flex items-center space-x-3">
          {row.featuredImage ? (
            <img
              src={row.featuredImage}
              alt={row.title}
              className="h-10 w-14 object-cover rounded-lg border border-kishtwar-cream-200 shrink-0 bg-gray-50"
            />
          ) : (
            <div className="h-10 w-14 rounded-lg bg-kishtwar-cream border border-kishtwar-cream-200 text-kishtwar-green-900 flex items-center justify-center font-bold text-xs shrink-0">
              Blog
            </div>
          )}
          <div className="min-w-0">
            <span className="font-serif font-bold text-kishtwar-green-950 block truncate max-w-[200px]">
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
      header: "Author",
      accessor: (row: any) => row.author.name,
      sortable: true,
      render: (row: any) => (
        <div className="flex items-center space-x-2">
          {row.author.avatar ? (
            <img
              src={row.author.avatar}
              alt={row.author.name}
              className="h-6 w-6 rounded-full object-cover border border-kishtwar-cream-200"
            />
          ) : (
            <div className="h-6 w-6 rounded-full bg-kishtwar-cream text-kishtwar-green-900 border border-kishtwar-cream-200 flex items-center justify-center font-bold text-[10px]">
              {row.author.name.charAt(0)}
            </div>
          )}
          <span className="text-gray-750 font-medium truncate block max-w-[120px]">
            {row.author.name}
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
          {isPending && actionBlogId === row.id ? (
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
            <Heart className="h-3.5 w-3.5 mr-1 text-red-500 shrink-0" />
            <span className="font-semibold text-gray-700 mr-1">{row.likeCount}</span> likes
          </span>
          <span className="flex items-center">
            <MessageSquare className="h-3.5 w-3.5 mr-1 text-kishtwar-emerald shrink-0" />
            <span className="font-semibold text-gray-700 mr-1">{row.commentCount}</span> comments
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
            href={`/admin/blogs/${row.id}/edit`}
            className="p-2 bg-kishtwar-cream/30 hover:bg-kishtwar-cream/50 text-kishtwar-green-900 border border-kishtwar-cream-200 hover:border-kishtwar-cream-300 rounded-xl transition-all"
            title="Edit Post"
          >
            <Edit className="h-4 w-4" />
          </Link>
          <button
            onClick={() => handleDelete(row.id, row.title)}
            disabled={isPending && actionBlogId === row.id}
            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl border border-red-100 transition-all cursor-pointer"
            title="Delete Post"
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
        data={blogs}
        searchKey="title"
        searchPlaceholder="Filter blogs by title..."
        pageSize={10}
      />
    </div>
  );
}
