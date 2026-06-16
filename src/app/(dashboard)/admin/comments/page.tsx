import { getAdminComments } from "@/actions/comments.actions";
import CommentsTable from "./CommentsTable";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export const revalidate = 0; // Dynamic rendering

export default async function AdminCommentsPage() {
  const res = await getAdminComments();
  const comments = res.success ? res.data || [] : [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-kishtwar-green-950">
            Comments Moderation
          </h1>
          <Breadcrumbs className="text-kishtwar-green-600 mt-1" />
        </div>
      </div>

      {/* Comments Table */}
      <CommentsTable initialComments={comments} />
    </div>
  );
}
