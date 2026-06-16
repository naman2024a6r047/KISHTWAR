import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import GalleryGrid from "./GalleryGrid";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Link from "next/link";
import { Plus } from "lucide-react";

export const revalidate = 0; // Dynamic rendering

export default async function AdminGalleryPage() {
  // Enforce super admin permission
  await requireRole(["SUPER_ADMIN"]);

  const photos = await prisma.photo.findMany({
    include: {
      category: {
        select: {
          name: true,
        },
      },
      contributor: {
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-kishtwar-green-950">
            Photo Gallery Moderation
          </h1>
          <Breadcrumbs className="text-kishtwar-green-600 mt-1" />
        </div>
        <div>
          <Link
            href="/contributor/photos"
            className="flex items-center space-x-1.5 px-4 py-2.5 bg-kishtwar-green-900 hover:bg-kishtwar-green-950 text-white rounded-xl text-xs font-serif font-bold tracking-wide transition-all shadow-sm"
          >
            <Plus className="h-4 w-4 text-kishtwar-gold shrink-0" />
            <span>Upload New Photo</span>
          </Link>
        </div>
      </div>

      {/* Gallery Grid Wrapper */}
      <GalleryGrid initialPhotos={photos} />
    </div>
  );
}
