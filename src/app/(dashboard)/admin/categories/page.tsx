import { requireRole } from "@/lib/auth";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { FolderTree } from "lucide-react";
import CategoriesClient from "./CategoriesClient";
import { getCategories } from "@/actions/categories.actions";

export const metadata = {
  title: "Category Management | Kishtwar Admin",
};

export default async function CategoriesPage() {
  await requireRole(["SUPER_ADMIN"]);

  // Fetch all categories parallelly for the initial state
  const [places, blogs, photos, videos, events] = await Promise.all([
    getCategories("place"),
    getCategories("blog"),
    getCategories("photo"),
    getCategories("video"),
    getCategories("event"),
  ]);

  const initialData = {
    place: places.data || [],
    blog: blogs.data || [],
    photo: photos.data || [],
    video: videos.data || [],
    event: events.data || [],
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-kishtwar-green-950 flex items-center gap-2">
            <FolderTree className="h-7 w-7 text-kishtwar-gold" />
            Categories Management
          </h1>
          <Breadcrumbs className="text-kishtwar-green-600 mt-1" />
        </div>
      </div>

      {/* Main Client Area */}
      <CategoriesClient initialData={initialData} />
    </div>
  );
}
