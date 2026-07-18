"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/common/DataTable";
import { updateUserRole, toggleUserActive, deleteUser, verifyUserEmail } from "@/actions/admin.actions";
import type { UserRole } from "@prisma/client";
import { format } from "date-fns";
import { Shield, ShieldAlert, Trash2, Ban, CheckCircle, AlertCircle, Sparkles, User, Loader2, BookOpen, MapPin } from "lucide-react";

interface UsersTableProps {
  initialUsers: any[];
}

export default function UsersTable({ initialUsers }: UsersTableProps) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [isPending, startTransition] = useTransition();
  const [actionUserId, setActionUserId] = useState<number | null>(null);
  const [alertMessage, setAlertMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Helper to show temporary feedback messages
  const triggerAlert = (text: string, type: "success" | "error") => {
    setAlertMessage({ text, type });
    setTimeout(() => setAlertMessage(null), 4000);
  };

  const handleRoleChange = async (userId: number, currentRole: UserRole, newRole: UserRole) => {
    if (currentRole === newRole) return;
    
    setActionUserId(userId);
    startTransition(async () => {
      try {
        const res = await updateUserRole(userId, newRole);
        if (res.success) {
          setUsers((prev) =>
            prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
          );
          triggerAlert(res.message || "User role updated successfully.", "success");
          router.refresh();
        } else {
          triggerAlert(res.error || "Failed to update role.", "error");
        }
      } catch (err) {
        triggerAlert("An error occurred while updating the role.", "error");
      } finally {
        setActionUserId(null);
      }
    });
  };

  const handleToggleActive = async (userId: number) => {
    setActionUserId(userId);
    startTransition(async () => {
      try {
        const res = await toggleUserActive(userId);
        if (res.success) {
          setUsers((prev) =>
            prev.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u))
          );
          triggerAlert(res.message || "User status updated successfully.", "success");
          router.refresh();
        } else {
          triggerAlert(res.error || "Failed to toggle status.", "error");
        }
      } catch (err) {
        triggerAlert("An error occurred while toggling status.", "error");
      } finally {
        setActionUserId(null);
      }
    });
  };

  const handleVerifyEmail = async (userId: number, name: string) => {
    if (!confirm(`Are you sure you want to manually verify ${name}'s email?`)) {
      return;
    }

    setActionUserId(userId);
    startTransition(async () => {
      try {
        const res = await verifyUserEmail(userId);
        if (res.success) {
          setUsers((prev) =>
            prev.map((u) => (u.id === userId ? { ...u, emailVerified: new Date() } : u))
          );
          triggerAlert(res.message || "Email verified successfully.", "success");
          router.refresh();
        } else {
          triggerAlert(res.error || "Failed to verify email.", "error");
        }
      } catch (err) {
        triggerAlert("An error occurred while verifying the email.", "error");
      } finally {
        setActionUserId(null);
      }
    });
  };

  const handleDelete = async (userId: number, name: string) => {
    if (!confirm(`Are you absolutely sure you want to delete ${name}'s account? This action is irreversible.`)) {
      return;
    }

    setActionUserId(userId);
    startTransition(async () => {
      try {
        const res = await deleteUser(userId);
        if (res.success) {
          setUsers((prev) => prev.filter((u) => u.id !== userId));
          triggerAlert(res.message || "User deleted successfully.", "success");
          router.refresh();
        } else {
          triggerAlert(res.error || "Failed to delete user.", "error");
        }
      } catch (err) {
        triggerAlert("An error occurred while deleting the user.", "error");
      } finally {
        setActionUserId(null);
      }
    });
  };

  const columns = [
    {
      header: "User Details",
      accessor: "name" as const,
      sortable: true,
      render: (row: any) => (
        <div className="flex items-center space-x-3">
          {row.avatar ? (
            <img
              src={row.avatar}
              alt={row.name}
              className="h-10 w-10 rounded-full object-cover border border-kishtwar-cream-200"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-kishtwar-cream-200 text-kishtwar-green-800 border border-kishtwar-cream-300 flex items-center justify-center font-bold text-sm">
              {row.name.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <span className="font-bold text-kishtwar-green-950 block truncate">
              {row.name}
            </span>
            <span className="text-[10px] text-gray-400 font-semibold block">
              @{row.username}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Email Address",
      accessor: "email" as const,
      sortable: true,
      render: (row: any) => (
        <div className="space-y-0.5">
          <span className="text-gray-700 block font-light">{row.email}</span>
          {row.emailVerified ? (
            <span className="inline-flex items-center text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-md">
              <CheckCircle className="h-2.5 w-2.5 mr-0.5" /> Verified
            </span>
          ) : (
            <button
              onClick={() => handleVerifyEmail(row.id, row.name)}
              disabled={isPending && actionUserId === row.id}
              className="inline-flex items-center text-[9px] text-amber-600 font-bold bg-amber-50 hover:bg-amber-100 px-1.5 py-0.5 rounded-md transition-colors cursor-pointer disabled:opacity-50"
              title="Click to manually verify email"
            >
              <Clock className="h-2.5 w-2.5 mr-0.5" /> Pending
            </button>
          )}
        </div>
      ),
    },
    {
      header: "System Role",
      accessor: "role" as const,
      sortable: true,
      render: (row: any) => (
        <div className="relative inline-block">
          {isPending && actionUserId === row.id ? (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-gray-400">
              <Loader2 className="h-3 w-3 animate-spin text-kishtwar-emerald" />
              <span>Updating...</span>
            </div>
          ) : (
            <select
              value={row.role}
              onChange={(e) => handleRoleChange(row.id, row.role, e.target.value as UserRole)}
              className="text-xs bg-white border border-kishtwar-cream-200 text-kishtwar-green-950 font-semibold px-2 py-1.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-kishtwar-green-500 cursor-pointer"
            >
              <option value="USER">User (Visitor)</option>
              <option value="CONTRIBUTOR">Contributor</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "isActive" as const,
      sortable: true,
      render: (row: any) => (
        <div className="flex items-center space-x-2">
          {row.isActive ? (
            <span className="inline-flex items-center text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 font-bold px-2 py-1 rounded-full">
              <CheckCircle className="h-3 w-3 mr-1" /> Active
            </span>
          ) : (
            <span className="inline-flex items-center text-[10px] text-red-700 bg-red-50 border border-red-100 font-bold px-2 py-1 rounded-full">
              <Ban className="h-3 w-3 mr-1" /> Banned
            </span>
          )}
          <button
            onClick={() => handleToggleActive(row.id)}
            disabled={isPending && actionUserId === row.id}
            className="p-1 rounded-lg border border-kishtwar-cream-200 hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors"
            title={row.isActive ? "Ban User" : "Activate User"}
          >
            {row.isActive ? <Ban className="h-3.5 w-3.5" /> : <CheckCircle className="h-3.5 w-3.5" />}
          </button>
        </div>
      ),
    },
    {
      header: "Contributions",
      accessor: (row: any) => row._count.blogs + row._count.touristPlaces,
      sortable: true,
      render: (row: any) => (
        <div className="flex flex-col space-y-0.5 text-xs text-gray-500 font-light">
          <span className="flex items-center">
            <BookOpen className="h-3.5 w-3.5 mr-1 text-gray-400" />
            <span className="font-semibold text-gray-700 mr-1">{row._count.blogs}</span> blogs
          </span>
          <span className="flex items-center">
            <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400" />
            <span className="font-semibold text-gray-700 mr-1">{row._count.touristPlaces}</span> places
          </span>
        </div>
      ),
    },
    {
      header: "Joined Date",
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
        <button
          onClick={() => handleDelete(row.id, row.name)}
          disabled={isPending && actionUserId === row.id}
          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl border border-red-100 transition-all cursor-pointer"
          title="Delete Account"
        >
          <Trash2 className="h-4 w-4" />
        </button>
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
        data={users}
        searchKey="name"
        searchPlaceholder="Filter users by name..."
        pageSize={10}
      />
    </div>
  );
}

// Inline fallback for mini-clock in case of build
function Clock({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}
