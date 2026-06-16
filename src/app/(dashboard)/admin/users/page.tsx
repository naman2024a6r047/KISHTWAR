import { getAdminUsers } from "@/actions/admin.actions";
import UsersTable from "./UsersTable";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export const revalidate = 0; // Dynamic rendering

export default async function AdminUsersPage() {
  const usersRes = await getAdminUsers({ limit: 1000 });

  if (!usersRes.success || !usersRes.data) {
    return (
      <div className="p-6 text-center bg-red-50 rounded-2xl border border-red-200 max-w-7xl mx-auto">
        <h2 className="text-lg font-bold text-red-800">Failed to load users</h2>
        <p className="text-sm text-red-650 mt-1">{usersRes.error || "Please try again later."}</p>
      </div>
    );
  }

  const { users } = usersRes.data;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-kishtwar-green-950">
          User & Roles Management
        </h1>
        <Breadcrumbs className="text-kishtwar-green-600 mt-1" />
      </div>

      {/* Users table */}
      <UsersTable initialUsers={users} />
    </div>
  );
}
