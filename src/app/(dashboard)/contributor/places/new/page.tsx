import { getPlaceCategories } from "@/actions/places.actions";
import { requireRole } from "@/lib/auth";
import PlaceForm from "../PlaceForm";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export const revalidate = 0; // Dynamic rendering

export default async function ContributorCreatePlacePage() {
  await requireRole(["CONTRIBUTOR", "SUPER_ADMIN"]);
  const categories = await getPlaceCategories();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-kishtwar-green-950">
          Add Tourist Destination
        </h1>
        <Breadcrumbs className="text-kishtwar-green-600 mt-1" />
      </div>

      {/* Place Form */}
      <PlaceForm categories={categories} />
    </div>
  );
}
