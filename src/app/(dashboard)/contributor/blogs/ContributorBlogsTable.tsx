"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/common/DataTable";
import { deleteBlog } from "@/actions/blogs.actions";
import { format } from "date-fns";
import { BookOpen, Edit, Trash2, CheckCircle, AlertCircle, Eye, Heart, MessageSquare, Loader2 } from "lucide-react";
import Link from "next/link";

interface ContributorBlogsTableProps {
  initialBlogs: any[];
}

export default function ContributorBlogsTable({ initialBlogs }: ContributorBlogsTableProps) {
  const router = useRouter();
  const [blogs, setBlogs] = useState(initialBlogs);
  const [isPending, startTransition] = useTransition();
  const [actionBlogId, setActionBlogId] = useState<number | null>(null);
  const [alertMessage, setAlertMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const triggerAlert = (text: string, type: "success" | "error") => {
    setAlertMessage({ text, type });
    setTimeout(() => setAlertMessage(null), 4000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "SUBMITTED":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "APPROVED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "PUBLISHED":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "REJECTED":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-gray-50 text-gray-650 border-gray-150";
    }
  };

  const columns = [
    {
      header: "Blog / Story Details",
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
              <BookOpen className="h-4 w-4" />
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
      header: "Status",
      accessor: "status" as const,
      sortable: true,
      render: (row: any) => (
        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(row.status)}`}>
          {row.status}
        </span>
      ),
    },
    {
      header: "Metrics",
      accessor: "viewCount" as const,
      sortable: true,
      render: (row: any) => (
        <div className="flex flex-col space-y-0.5 text-xs text-gray-500 font-light">
          <span className="flex items-center">
            <Eye className="h-3.5 w-3.5 mr-1 text-gray-400 shrink-0" />
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
          {row.status === "PUBLISHED" && (
            <Link
              href={`/blog/${row.slug}`}
              target="_blank"
              className="p-2 bg-kishtwar-cream/30 hover:bg-kishtwar-cream/55 text-kishtwar-green-900 border border-kishtwar-cream-200 rounded-xl transition-all"
              title="View Blog Page"
            >
              <Eye className="h-4 w-4" />
            </Link>
          )}
          <Link
            href={`/contributor/blogs/${row.id}/edit`}
            className="p-2 bg-kishtwar-cream/30 hover:bg-kishtwar-cream/55 text-kishtwar-green-900 border border-kishtwar-cream-200 hover:border-kishtwar-cream-300 rounded-xl transition-all"
            title="Edit Blog"
          >
            <Edit className="h-4 w-4" />
          </Link>
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
        searchPlaceholder="Filter my blogs..."
        pageSize={10}
      />
    </div>
  );
}
