import { prisma } from "@/lib/prisma";
import { getEventCategories } from "@/actions/events.actions";
import { requireRole } from "@/lib/auth";
import EventForm from "../../EventForm";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { notFound } from "next/navigation";

export const revalidate = 0; // Dynamic rendering

interface EditEventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ContributorEditEventPage({ params }: EditEventPageProps) {
  const user = await requireRole(["CONTRIBUTOR", "SUPER_ADMIN"]);
  
  const { id } = await params;
  const eventId = parseInt(id, 10);

  if (isNaN(eventId)) {
    return notFound();
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    return notFound();
  }

  // Enforce ownership: only contributor who created the event or super admin can edit
  if (event.contributorId !== user.id && user.role !== "SUPER_ADMIN") {
    return notFound();
  }

  const categories = await getEventCategories();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-kishtwar-green-950">
          Edit Event Details
        </h1>
        <Breadcrumbs className="text-kishtwar-green-600 mt-1" />
      </div>

      {/* Event Form */}
      <EventForm categories={categories} initialData={event} />
    </div>
  );
}
