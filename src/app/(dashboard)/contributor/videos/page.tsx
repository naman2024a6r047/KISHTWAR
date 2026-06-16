import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getVideoCategories } from "@/actions/videos.actions";
import ContributorVideosManager from "./ContributorVideosManager";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export const revalidate = 0; // Dynamic rendering

export default async function ContributorVideosPage() {
  const user = await requireRole(["CONTRIBUTOR", "SUPER_ADMIN"]);
  const categories = await getVideoCategories();

  const videos = await prisma.video.findMany({
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
          My Video Gallery Contributions
        </h1>
        <Breadcrumbs className="text-kishtwar-green-600 mt-1" />
      </div>

      {/* Videos Manager */}
      <ContributorVideosManager initialVideos={videos} categories={categories} />
    </div>
  );
}
