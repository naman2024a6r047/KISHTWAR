"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/common/DataTable";
import { format } from "date-fns";
import { Calendar, Edit, Eye, MapPin } from "lucide-react";
import Link from "next/link";

interface ContributorEventsTableProps {
  initialEvents: any[];
}

export default function ContributorEventsTable({ initialEvents }: ContributorEventsTableProps) {
  const router = useRouter();
  const [events, setEvents] = useState(initialEvents);

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
        return "bg-gray-55 text-gray-655 border-gray-150";
    }
  };

  const columns = [
    {
      header: "Event / Festival Details",
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
      header: "Dates",
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
      header: "Actions",
      accessor: "id" as const,
      render: (row: any) => (
        <div className="flex items-center space-x-2">
          {row.status === "PUBLISHED" && (
            <Link
              href={`/events/${row.slug}`}
              target="_blank"
              className="p-2 bg-kishtwar-cream/30 hover:bg-kishtwar-cream/55 text-kishtwar-green-900 border border-kishtwar-cream-200 rounded-xl transition-all"
              title="View Event Page"
            >
              <Eye className="h-4 w-4" />
            </Link>
          )}
          <Link
            href={`/contributor/events/${row.id}/edit`}
            className="p-2 bg-kishtwar-cream/30 hover:bg-kishtwar-cream/55 text-kishtwar-green-900 border border-kishtwar-cream-200 hover:border-kishtwar-cream-300 rounded-xl transition-all"
            title="Edit Event"
          >
            <Edit className="h-4 w-4" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={events}
        searchKey="name"
        searchPlaceholder="Filter my events..."
        pageSize={10}
      />
    </div>
  );
}
