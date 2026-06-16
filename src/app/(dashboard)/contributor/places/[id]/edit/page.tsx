import { prisma } from "@/lib/prisma";
import { getPlaceCategories } from "@/actions/places.actions";
import { requireRole } from "@/lib/auth";
import PlaceForm from "../../PlaceForm";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { notFound } from "next/navigation";

export const revalidate = 0; // Dynamic rendering

interface EditPlacePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ContributorEditPlacePage({ params }: EditPlacePageProps) {
  const user = await requireRole(["CONTRIBUTOR", "SUPER_ADMIN"]);
  
  const { id } = await params;
  const placeId = parseInt(id, 10);

  if (isNaN(placeId)) {
    return notFound();
  }

  const place = await prisma.touristPlace.findUnique({
    where: { id: placeId },
  });

  if (!place) {
    return notFound();
  }

  // Enforce ownership: only contributor who created the place or super admin can edit
  if (place.contributorId !== user.id && user.role !== "SUPER_ADMIN") {
    return notFound();
  }

  const categories = await getPlaceCategories();

  // Convert decimal coordinates to standard numbers for react form compatibility
  const formattedPlace = {
    ...place,
    gpsLat: place.gpsLat ? Number(place.gpsLat) : null,
    gpsLng: place.gpsLng ? Number(place.gpsLng) : null,
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-kishtwar-green-950">
          Edit Destination Details
        </h1>
        <Breadcrumbs className="text-kishtwar-green-600 mt-1" />
      </div>

      {/* Place Form */}
      <PlaceForm categories={categories} initialData={formattedPlace} />
    </div>
  );
}
