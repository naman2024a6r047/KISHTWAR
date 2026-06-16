"use server";

import { prisma } from "@/lib/prisma";
import type { ContentStatus } from "@prisma/client";
import type { EventWithCategory, EventDetail, ApiResponse, PaginatedResponse } from "@/types";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getEventCategories() {
  try {
    const categories = await prisma.eventCategory.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return categories;
  } catch (error) {
    console.error("Error fetching event categories:", error);
    return [];
  }
}

interface GetEventsOptions {
  categoryId?: number;
  categorySlug?: string;
  status?: ContentStatus;
  featured?: boolean;
  upcomingOnly?: boolean;
  page?: number;
  limit?: number;
}

export async function getEvents(
  options: GetEventsOptions = {}
): Promise<PaginatedResponse<EventWithCategory>> {
  const {
    categoryId,
    categorySlug,
    status = "PUBLISHED",
    featured,
    upcomingOnly = false,
    page = 1,
    limit = 9,
  } = options;

  const skip = (page - 1) * limit;

  const where: any = {
    status,
  };

  if (featured !== undefined) {
    where.featured = featured;
  }

  if (categoryId) {
    where.categoryId = categoryId;
  } else if (categorySlug) {
    where.category = {
      slug: categorySlug,
    };
  }

  if (upcomingOnly) {
    // Events where startDate is greater than or equal to yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    where.startDate = {
      gte: yesterday,
    };
  }

  try {
    const [total, items] = await Promise.all([
      prisma.event.count({ where }),
      prisma.event.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: {
          startDate: "asc",
        },
        skip,
        take: limit,
      }),
    ]);

    const formattedData: EventWithCategory[] = items.map((evt) => ({
      id: evt.id,
      name: evt.name,
      slug: evt.slug,
      banner: evt.banner,
      shortDescription: evt.shortDescription,
      startDate: evt.startDate,
      endDate: evt.endDate,
      location: evt.location,
      category: evt.category,
      featured: evt.featured,
      status: evt.status,
    }));

    const totalPages = Math.ceil(total / limit);

    return {
      data: formattedData,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    };
  } catch (error) {
    console.error("Error fetching events:", error);
    return {
      data: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
        hasMore: false,
      },
    };
  }
}

export async function getEventBySlug(slug: string): Promise<EventDetail | null> {
  try {
    const evt = await prisma.event.findUnique({
      where: { slug },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
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
    });

    if (!evt || evt.status !== "PUBLISHED") {
      return null;
    }

    const eventDetail: EventDetail = {
      id: evt.id,
      name: evt.name,
      slug: evt.slug,
      banner: evt.banner,
      description: evt.description,
      shortDescription: evt.shortDescription,
      startDate: evt.startDate,
      endDate: evt.endDate,
      startTime: evt.startTime,
      location: evt.location,
      gpsLat: evt.gpsLat ? Number(evt.gpsLat) : null,
      gpsLng: evt.gpsLng ? Number(evt.gpsLng) : null,
      registrationLink: evt.registrationLink,
      category: evt.category,
      featured: evt.featured,
      status: evt.status,
      contributor: evt.contributor,
      metaTitle: evt.metaTitle,
      metaDescription: evt.metaDescription,
      createdAt: evt.createdAt,
    };

    return eventDetail;
  } catch (error) {
    console.error(`Error fetching event by slug ${slug}:`, error);
    return null;
  }
}

interface EventInputData {
  name: string;
  description: string;
  shortDescription?: string;
  banner?: string;
  startDate: Date;
  endDate?: Date;
  startTime?: string;
  location?: string;
  gpsLat?: number;
  gpsLng?: number;
  registrationLink?: string;
  categoryId: number;
  featured?: boolean;
}

/**
 * Create a new event
 */
export async function createEvent(data: EventInputData): Promise<ApiResponse> {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "SUPER_ADMIN" && user.role !== "CONTRIBUTOR")) {
      return { success: false, error: "Unauthorized. Admin or Contributor role required." };
    }

    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const existing = await prisma.event.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now().toString().slice(-4)}` : slug;

    const event = await prisma.event.create({
      data: {
        name: data.name,
        slug: finalSlug,
        description: data.description,
        shortDescription: data.shortDescription || null,
        banner: data.banner || null,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        startTime: data.startTime || null,
        location: data.location || null,
        gpsLat: data.gpsLat || null,
        gpsLng: data.gpsLng || null,
        registrationLink: data.registrationLink || null,
        categoryId: data.categoryId,
        contributorId: user.id,
        status: user.role === "SUPER_ADMIN" ? "PUBLISHED" : "SUBMITTED",
        featured: data.featured || false,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "event.create",
        entityType: "Event",
        entityId: event.id,
        metadata: { name: event.name, slug: event.slug },
      },
    });

    revalidatePath("/events");
    revalidatePath("/");

    return { success: true, message: "Event submitted successfully." };
  } catch (error: any) {
    console.error("Error creating event:", error);
    return { success: false, error: error.message || "Failed to create event." };
  }
}

/**
 * Update an existing event
 */
export async function updateEvent(id: number, data: Partial<EventInputData>): Promise<ApiResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return { success: false, error: "Event not found." };

    if (user.role !== "SUPER_ADMIN" && event.contributorId !== user.id) {
      return { success: false, error: "Unauthorized to edit this event." };
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.shortDescription !== undefined) updateData.shortDescription = data.shortDescription;
    if (data.banner !== undefined) updateData.banner = data.banner;
    if (data.startDate !== undefined) updateData.startDate = new Date(data.startDate);
    if (data.endDate !== undefined) updateData.endDate = data.endDate ? new Date(data.endDate) : null;
    if (data.startTime !== undefined) updateData.startTime = data.startTime;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.gpsLat !== undefined) updateData.gpsLat = data.gpsLat;
    if (data.gpsLng !== undefined) updateData.gpsLng = data.gpsLng;
    if (data.registrationLink !== undefined) updateData.registrationLink = data.registrationLink;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;

    if (user.role === "CONTRIBUTOR") {
      updateData.status = "SUBMITTED";
    }

    await prisma.event.update({
      where: { id },
      data: updateData,
    });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "event.update",
        entityType: "Event",
        entityId: id,
        metadata: { name: event.name },
      },
    });

    revalidatePath(`/events/${event.slug}`);
    revalidatePath("/events");
    revalidatePath("/");

    return { success: true, message: "Event updated successfully." };
  } catch (error: any) {
    console.error("Error updating event:", error);
    return { success: false, error: error.message || "Failed to update event." };
  }
}

/**
 * Delete an event
 */
export async function deleteEvent(id: number): Promise<ApiResponse> {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "SUPER_ADMIN") {
      return { success: false, error: "Unauthorized. Admin privileges required." };
    }

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return { success: false, error: "Event not found." };

    await prisma.event.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "event.delete",
        entityType: "Event",
        entityId: id,
        metadata: { name: event.name },
      },
    });

    revalidatePath("/events");
    revalidatePath("/");

    return { success: true, message: "Event deleted successfully." };
  } catch (error: any) {
    console.error("Error deleting event:", error);
    return { success: false, error: error.message || "Failed to delete event." };
  }
}

/**
 * Update event moderation status
 */
export async function updateEventStatus(id: number, status: ContentStatus): Promise<ApiResponse> {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "SUPER_ADMIN") {
      return { success: false, error: "Unauthorized. Admin privileges required." };
    }

    const event = await prisma.event.findUnique({
      where: { id },
      select: { name: true, contributorId: true },
    });
    if (!event) return { success: false, error: "Event not found." };

    await prisma.event.update({
      where: { id },
      data: { status },
    });

    // Notify contributor
    await prisma.notification.create({
      data: {
        userId: event.contributorId,
        type: "APPROVAL",
        title: `Event Review: ${status}`,
        message: `Your submitted event "${event.name}" has been ${status.toLowerCase()} by the admin.`,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: `event.status_${status.toLowerCase()}`,
        entityType: "Event",
        entityId: id,
        metadata: { name: event.name, status },
      },
    });

    revalidatePath("/events");
    revalidatePath("/");

    return { success: true, message: `Successfully updated event status to ${status}.` };
  } catch (error: any) {
    console.error("Error updating event status:", error);
    return { success: false, error: error.message || "Failed to update event status." };
  }
}

/**
 * Toggle featured flag of an event
 */
export async function toggleEventFeatured(id: number): Promise<ApiResponse> {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "SUPER_ADMIN") {
      return { success: false, error: "Unauthorized. Admin privileges required." };
    }

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return { success: false, error: "Event not found." };

    const updated = await prisma.event.update({
      where: { id },
      data: { featured: !event.featured },
    });

    revalidatePath("/events");
    revalidatePath("/");

    return { success: true, message: `Successfully ${updated.featured ? "featured" : "unfeatured"} event.` };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to toggle featured status." };
  }
}
