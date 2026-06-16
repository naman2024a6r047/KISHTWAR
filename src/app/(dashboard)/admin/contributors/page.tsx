import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import ContributorsList from "./ContributorsList";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export const revalidate = 0; // Dynamic rendering

export default async function AdminContributorsPage() {
  // Enforce super admin permission
  await requireRole(["SUPER_ADMIN"]);

  const contributors = await prisma.contributorProfile.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
          avatar: true,
          role: true,
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
          Contributors Verification
        </h1>
        <Breadcrumbs className="text-kishtwar-green-600 mt-1" />
      </div>

      {/* Contributors Grid */}
      <ContributorsList initialContributors={contributors} />
    </div>
  );
}
