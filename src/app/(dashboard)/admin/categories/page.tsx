import { requireRole } from "@/lib/auth";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { FolderTree, Settings, Plus } from "lucide-react";

export const metadata = {
  title: "Category Management | Kishtwar Admin",
};

export default async function CategoriesPage() {
  await requireRole(["SUPER_ADMIN"]);

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
        <div className="flex items-center gap-3">
          <button className="flex items-center space-x-1.5 px-4 py-2 bg-kishtwar-green-900 hover:bg-kishtwar-green-950 text-white font-serif font-bold text-xs tracking-wide rounded-xl shadow-sm hover:shadow transition-all">
            <Plus className="h-4 w-4 text-kishtwar-gold shrink-0" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-kishtwar-cream-200 p-8 shadow-sm text-center">
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <div className="w-16 h-16 bg-kishtwar-green-50 text-kishtwar-green-600 rounded-full flex items-center justify-center mb-2">
            <Settings className="w-8 h-8 animate-spin-slow" />
          </div>
          <h2 className="text-xl font-serif font-bold text-kishtwar-green-950">
            Category Management Coming Soon
          </h2>
          <p className="text-gray-500 max-w-md text-sm">
            This module is currently under development. Soon you will be able to manage categories for blogs, tourist places, media, and events here.
          </p>
        </div>
      </div>
    </div>
  );
}
