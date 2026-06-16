import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPhotoCategories } from "@/actions/gallery.actions";
import ContributorPhotosManager from "./ContributorPhotosManager";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export const revalidate = 0; // Dynamic rendering

export default async function ContributorPhotosPage() {
  const user = await requireRole(["CONTRIBUTOR", "SUPER_ADMIN"]);
  const categories = await getPhotoCategories();

  const photos = await prisma.photo.findMany({
    where: {
      contributorId: user.id,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
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
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-kishtwar-green-950">
          My Photo Gallery Contributions
        </h1>
        <Breadcrumbs className="text-kishtwar-green-600 mt-1" />
      </div>

      {/* Photos Manager */}
      <ContributorPhotosManager initialPhotos={photos} categories={categories} />
    </div>
  );
}
