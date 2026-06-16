import { getEventCategories } from "@/actions/events.actions";
import { requireRole } from "@/lib/auth";
import EventForm from "../EventForm";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export const revalidate = 0; // Dynamic rendering

export default async function ContributorCreateEventPage() {
  await requireRole(["CONTRIBUTOR", "SUPER_ADMIN"]);
  const categories = await getEventCategories();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-kishtwar-green-950">
          Create New Event
        </h1>
        <Breadcrumbs className="text-kishtwar-green-600 mt-1" />
      </div>

      {/* Event Form */}
      <EventForm categories={categories} />
    </div>
  );
}
