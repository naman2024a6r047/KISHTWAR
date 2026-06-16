"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import type { ContentStatus } from "@prisma/client";
import type {
  PlaceWithCategory,
  PlaceDetail,
  PlaceReviewWithUser,
  ApiResponse,
  PaginatedResponse,
} from "@/types";
import { revalidatePath } from "next/cache";

/**
 * Fetch a list of place categories.
 */
export async function getPlaceCategories() {
  try {
    const categories = await prisma.placeCategory.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return categories;
  } catch (error) {
    console.error("Error fetching place categories:", error);
    return [];
  }
}

interface GetPlacesOptions {
  search?: string;
  categoryId?: number;
  categorySlug?: string;
  status?: ContentStatus;
  featured?: boolean;
  page?: number;
  limit?: number;
}

/**
 * Fetch places based on search filters and pagination.
 */
export async function getPlaces(
  options: GetPlacesOptions = {}
): Promise<PaginatedResponse<PlaceWithCategory>> {
  const {
    search,
    categoryId,
    categorySlug,
    status = "PUBLISHED",
    featured,
    page = 1,
    limit = 9,
  } = options;

  const skip = (page - 1) * limit;

  // Build query where clause
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

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      { shortDescription: { contains: search } },
    ];
  }

  try {
    const [total, items] = await Promise.all([
      prisma.touristPlace.count({ where }),
      prisma.touristPlace.findMany({
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
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
    ]);

    // Format fields (convert Prisma Decimal objects to number)
    const formattedData: PlaceWithCategory[] = items.map((place) => ({
      id: place.id,
      name: place.name,
      slug: place.slug,
      shortDescription: place.shortDescription,
      featuredImage: place.featuredImage,
      category: place.category,
      averageRating: Number(place.averageRating),
      reviewCount: place.reviewCount,
      viewCount: place.viewCount,
      gpsLat: place.gpsLat ? Number(place.gpsLat) : null,
      gpsLng: place.gpsLng ? Number(place.gpsLng) : null,
      featured: place.featured,
      status: place.status,
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
    console.error("Error fetching places:", error);
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

/**
 * Fetch a single place by its slug, incrementing the view count in the process.
 */
export async function getPlaceBySlug(slug: string): Promise<PlaceDetail | null> {
  try {
    // Increment view count
    const updatedPlace = await prisma.touristPlace.update({
      where: { slug },
      data: {
        viewCount: {
          increment: 1,
        },
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          orderBy: {
            sortOrder: "asc",
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
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!updatedPlace || updatedPlace.status !== "PUBLISHED") {
      return null;
    }

    // Format the detail object to map Decimal fields to numbers
    const placeDetail: PlaceDetail = {
      id: updatedPlace.id,
      name: updatedPlace.name,
      slug: updatedPlace.slug,
      description: updatedPlace.description,
      shortDescription: updatedPlace.shortDescription,
      history: updatedPlace.history,
      featuredImage: updatedPlace.featuredImage,
      category: updatedPlace.category,
      averageRating: Number(updatedPlace.averageRating),
      reviewCount: updatedPlace.reviewCount,
      viewCount: updatedPlace.viewCount,
      gpsLat: updatedPlace.gpsLat ? Number(updatedPlace.gpsLat) : null,
      gpsLng: updatedPlace.gpsLng ? Number(updatedPlace.gpsLng) : null,
      altitude: updatedPlace.altitude,
      visitingTime: updatedPlace.visitingTime,
      entryFee: updatedPlace.entryFee,
      bestSeason: updatedPlace.bestSeason,
      travelTips: updatedPlace.travelTips,
      howToReach: updatedPlace.howToReach,
      nearbyHotels: updatedPlace.nearbyHotels,
      images: updatedPlace.images,
      contributor: updatedPlace.contributor,
      reviews: updatedPlace.reviews.map((rev) => ({
        id: rev.id,
        rating: rev.rating,
        title: rev.title,
        content: rev.content,
        createdAt: rev.createdAt,
        user: rev.user,
      })),
      metaTitle: updatedPlace.metaTitle,
      metaDescription: updatedPlace.metaDescription,
      featured: updatedPlace.featured,
      status: updatedPlace.status,
      publishedAt: updatedPlace.publishedAt,
      createdAt: updatedPlace.createdAt,
    };

    return placeDetail;
  } catch (error) {
    console.error(`Error fetching place by slug ${slug}:`, error);
    return null;
  }
}

interface SubmitReviewData {
  placeId: number;
  rating: number;
  title?: string;
  content?: string;
}

/**
 * Submit or update a place review. Recalculates averageRating and reviewCount.
 */
export async function submitPlaceReview(
  data: SubmitReviewData
): Promise<ApiResponse<PlaceReviewWithUser>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "You must be logged in to leave a review." };
    }

    const { placeId, rating, title, content } = data;

    if (rating < 1 || rating > 5) {
      return { success: false, error: "Rating must be between 1 and 5." };
    }

    // Create or update review
    const review = await prisma.placeReview.upsert({
      where: {
        placeId_userId: {
          placeId,
          userId: user.id,
        },
      },
      update: {
        rating,
        title: title || null,
        content: content || null,
      },
      create: {
        placeId,
        userId: user.id,
        rating,
        title: title || null,
        content: content || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    // Recalculate average rating & review count for the tourist place
    const aggregations = await prisma.placeReview.aggregate({
      where: { placeId },
      _avg: {
        rating: true,
      },
      _count: {
        id: true,
      },
    });

    const averageRating = aggregations._avg.rating || 0;
    const reviewCount = aggregations._count.id || 0;

    await prisma.touristPlace.update({
      where: { id: placeId },
      data: {
        averageRating,
        reviewCount,
      },
    });

    // Revalidate paths to refresh page state
    const place = await prisma.touristPlace.findUnique({
      where: { id: placeId },
      select: { slug: true },
    });

    if (place) {
      revalidatePath(`/tourist-places/${place.slug}`);
      revalidatePath(`/tourist-places`);
      revalidatePath(`/`);
    }

    return {
      success: true,
      data: {
        id: review.id,
        rating: review.rating,
        title: review.title,
        content: review.content,
        createdAt: review.createdAt,
        user: review.user,
      },
    };
  } catch (error) {
    console.error("Error submitting place review:", error);
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}

interface PlaceInputImage {
  url: string;
  publicId: string;
  caption?: string;
}

interface PlaceInputData {
  name: string;
  description: string;
  shortDescription?: string;
  history?: string;
  featuredImage: string;
  gpsLat?: number;
  gpsLng?: number;
  altitude?: string;
  visitingTime?: string;
  entryFee?: string;
  bestSeason?: string;
  travelTips?: string;
  howToReach?: string;
  nearbyHotels?: string;
  categoryId: number;
  images?: PlaceInputImage[];
}

/**
 * Create a new tourist place
 */
export async function createPlace(data: PlaceInputData): Promise<ApiResponse> {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "SUPER_ADMIN" && user.role !== "CONTRIBUTOR")) {
      return { success: false, error: "Unauthorized. Admin or Contributor role required." };
    }

    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check slug uniqueness
    const existing = await prisma.touristPlace.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now().toString().slice(-4)}` : slug;

    const place = await prisma.touristPlace.create({
      data: {
        name: data.name,
        slug: finalSlug,
        description: data.description,
        shortDescription: data.shortDescription || null,
        history: data.history || null,
        featuredImage: data.featuredImage,
        gpsLat: data.gpsLat || null,
        gpsLng: data.gpsLng || null,
        altitude: data.altitude || null,
        visitingTime: data.visitingTime || null,
        entryFee: data.entryFee || null,
        bestSeason: data.bestSeason || null,
        travelTips: data.travelTips || null,
        howToReach: data.howToReach || null,
        nearbyHotels: data.nearbyHotels || null,
        categoryId: data.categoryId,
        contributorId: user.id,
        status: user.role === "SUPER_ADMIN" ? "PUBLISHED" : "SUBMITTED",
        publishedAt: user.role === "SUPER_ADMIN" ? new Date() : null,
        images: {
          create: data.images?.map((img, idx) => ({
            url: img.url,
            publicId: img.publicId,
            caption: img.caption || null,
            sortOrder: idx,
          })) || [],
        },
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "place.create",
        entityType: "TouristPlace",
        entityId: place.id,
        metadata: { name: place.name, slug: place.slug },
      },
    });

    revalidatePath("/tourist-places");
    revalidatePath("/");

    return { success: true, message: "Tourist place created successfully." };
  } catch (error: any) {
    console.error("Error creating place:", error);
    return { success: false, error: error.message || "Failed to create tourist place." };
  }
}

/**
 * Update an existing tourist place
 */
export async function updatePlace(id: number, data: Partial<PlaceInputData>): Promise<ApiResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const place = await prisma.touristPlace.findUnique({ where: { id } });
    if (!place) return { success: false, error: "Tourist place not found." };

    if (user.role !== "SUPER_ADMIN" && place.contributorId !== user.id) {
      return { success: false, error: "Unauthorized to edit this place." };
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.shortDescription !== undefined) updateData.shortDescription = data.shortDescription;
    if (data.history !== undefined) updateData.history = data.history;
    if (data.featuredImage !== undefined) updateData.featuredImage = data.featuredImage;
    if (data.gpsLat !== undefined) updateData.gpsLat = data.gpsLat;
    if (data.gpsLng !== undefined) updateData.gpsLng = data.gpsLng;
    if (data.altitude !== undefined) updateData.altitude = data.altitude;
    if (data.visitingTime !== undefined) updateData.visitingTime = data.visitingTime;
    if (data.entryFee !== undefined) updateData.entryFee = data.entryFee;
    if (data.bestSeason !== undefined) updateData.bestSeason = data.bestSeason;
    if (data.travelTips !== undefined) updateData.travelTips = data.travelTips;
    if (data.howToReach !== undefined) updateData.howToReach = data.howToReach;
    if (data.nearbyHotels !== undefined) updateData.nearbyHotels = data.nearbyHotels;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;

    // If contributor edits, reset status to SUBMITTED for review
    if (user.role === "CONTRIBUTOR") {
      updateData.status = "SUBMITTED";
    }

    await prisma.touristPlace.update({
      where: { id },
      data: updateData,
    });

    if (data.images) {
      await prisma.placeImage.deleteMany({ where: { placeId: id } });
      if (data.images.length > 0) {
        await prisma.placeImage.createMany({
          data: data.images.map((img: any, idx: number) => ({
            placeId: id,
            url: img.url,
            publicId: img.publicId,
            caption: img.caption || null,
            sortOrder: idx,
          })),
        });
      }
    }

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "place.update",
        entityType: "TouristPlace",
        entityId: id,
        metadata: { name: place.name },
      },
    });

    revalidatePath(`/tourist-places/${place.slug}`);
    revalidatePath(`/tourist-places`);
    revalidatePath(`/`);

    return { success: true, message: "Tourist place updated successfully." };
  } catch (error: any) {
    console.error("Error updating place:", error);
    return { success: false, error: error.message || "Failed to update tourist place." };
  }
}

/**
 * Delete a tourist place
 */
export async function deletePlace(id: number): Promise<ApiResponse> {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "SUPER_ADMIN") {
      return { success: false, error: "Unauthorized. Admin privileges required." };
    }

    const place = await prisma.touristPlace.findUnique({ where: { id } });
    if (!place) return { success: false, error: "Tourist place not found." };

    await prisma.touristPlace.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "place.delete",
        entityType: "TouristPlace",
        entityId: id,
        metadata: { name: place.name },
      },
    });

    revalidatePath("/tourist-places");
    revalidatePath("/");

    return { success: true, message: "Tourist place deleted successfully." };
  } catch (error: any) {
    console.error("Error deleting place:", error);
    return { success: false, error: error.message || "Failed to delete tourist place." };
  }
}

/**
 * Update place verification/publication status
 */
export async function updatePlaceStatus(id: number, status: ContentStatus): Promise<ApiResponse> {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "SUPER_ADMIN") {
      return { success: false, error: "Unauthorized. Admin privileges required." };
    }

    const place = await prisma.touristPlace.findUnique({
      where: { id },
      select: { name: true, contributorId: true },
    });
    
    if (!place) return { success: false, error: "Tourist place not found." };

    const updateData: any = { status };
    if (status === "PUBLISHED") {
      updateData.publishedAt = new Date();
    }

    await prisma.touristPlace.update({
      where: { id },
      data: updateData,
    });

    // Notify contributor
    await prisma.notification.create({
      data: {
        userId: place.contributorId,
        type: "APPROVAL",
        title: `Destination Review: ${status}`,
        message: `Your submitted destination "${place.name}" has been ${status.toLowerCase()} by the admin.`,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: `place.status_${status.toLowerCase()}`,
        entityType: "TouristPlace",
        entityId: id,
        metadata: { name: place.name, status },
      },
    });

    revalidatePath("/tourist-places");
    revalidatePath("/");

    return { success: true, message: `Successfully updated place status to ${status}.` };
  } catch (error: any) {
    console.error("Error updating place status:", error);
    return { success: false, error: error.message || "Failed to update place status." };
  }
}
