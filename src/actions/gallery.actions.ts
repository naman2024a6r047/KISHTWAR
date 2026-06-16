"use server";

import { prisma } from "@/lib/prisma";
import type { MediaStatus } from "@prisma/client";
import type { PhotoWithCategory, PaginatedResponse, ApiResponse } from "@/types";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getPhotoCategories() {
  try {
    const categories = await prisma.photoCategory.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return categories;
  } catch (error) {
    console.error("Error fetching photo categories:", error);
    return [];
  }
}

interface GetPhotosOptions {
  categoryId?: number;
  categorySlug?: string;
  status?: MediaStatus;
  featured?: boolean;
  page?: number;
  limit?: number;
}

export async function getPhotos(
  options: GetPhotosOptions = {}
): Promise<PaginatedResponse<PhotoWithCategory>> {
  const {
    categoryId,
    categorySlug,
    status = "PUBLISHED",
    featured,
    page = 1,
    limit = 12,
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

  try {
    const [total, items] = await Promise.all([
      prisma.photo.count({ where }),
      prisma.photo.findMany({
        where,
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
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
    ]);

    const formattedData: PhotoWithCategory[] = items.map((photo) => ({
      id: photo.id,
      url: photo.url,
      thumbnailUrl: photo.thumbnailUrl,
      title: photo.title,
      caption: photo.caption,
      category: photo.category,
      contributor: photo.contributor,
      likeCount: photo.likeCount,
      downloadCount: photo.downloadCount,
      featured: photo.featured,
      width: photo.width,
      height: photo.height,
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
    console.error("Error fetching photos:", error);
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

interface PhotoInputData {
  url: string;
  publicId: string;
  thumbnailUrl?: string;
  title: string;
  caption?: string;
  categoryId: number;
  featured?: boolean;
  width?: number;
  height?: number;
}

/**
 * Upload and create a new photo
 */
export async function createPhoto(data: PhotoInputData): Promise<ApiResponse> {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "SUPER_ADMIN" && user.role !== "CONTRIBUTOR")) {
      return { success: false, error: "Unauthorized. Admin or Contributor role required." };
    }

    const photo = await prisma.photo.create({
      data: {
        url: data.url,
        publicId: data.publicId,
        thumbnailUrl: data.thumbnailUrl || null,
        title: data.title,
        caption: data.caption || null,
        categoryId: data.categoryId,
        contributorId: user.id,
        featured: data.featured || false,
        width: data.width || null,
        height: data.height || null,
        status: user.role === "SUPER_ADMIN" ? "PUBLISHED" : "SUBMITTED",
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "photo.upload",
        entityType: "Photo",
        entityId: photo.id,
        metadata: { title: photo.title },
      },
    });

    revalidatePath("/gallery");
    revalidatePath("/");

    return { success: true, message: "Photo uploaded successfully." };
  } catch (error: any) {
    console.error("Error uploading photo:", error);
    return { success: false, error: error.message || "Failed to upload photo." };
  }
}

/**
 * Delete a photo from database
 */
export async function deletePhoto(id: number): Promise<ApiResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const photo = await prisma.photo.findUnique({ where: { id } });
    if (!photo) return { success: false, error: "Photo not found." };

    if (user.role !== "SUPER_ADMIN" && photo.contributorId !== user.id) {
      return { success: false, error: "Unauthorized to delete this photo." };
    }

    await prisma.photo.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "photo.delete",
        entityType: "Photo",
        entityId: id,
        metadata: { title: photo.title },
      },
    });

    revalidatePath("/gallery");
    revalidatePath("/");

    return { success: true, message: "Photo deleted successfully." };
  } catch (error: any) {
    console.error("Error deleting photo:", error);
    return { success: false, error: error.message || "Failed to delete photo." };
  }
}

/**
 * Approve or decline a submitted photo
 */
export async function updatePhotoStatus(id: number, status: MediaStatus): Promise<ApiResponse> {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "SUPER_ADMIN") {
      return { success: false, error: "Unauthorized. Admin privileges required." };
    }

    const photo = await prisma.photo.findUnique({
      where: { id },
      select: { title: true, contributorId: true },
    });
    if (!photo) return { success: false, error: "Photo not found." };

    await prisma.photo.update({
      where: { id },
      data: { status },
    });

    // Notify contributor
    await prisma.notification.create({
      data: {
        userId: photo.contributorId,
        type: "APPROVAL",
        title: `Photo Review: ${status}`,
        message: `Your submitted photo "${photo.title}" has been ${status.toLowerCase()} by the admin.`,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: `photo.status_${status.toLowerCase()}`,
        entityType: "Photo",
        entityId: id,
        metadata: { title: photo.title, status },
      },
    });

    revalidatePath("/gallery");
    revalidatePath("/");

    return { success: true, message: `Successfully updated photo status to ${status}.` };
  } catch (error: any) {
    console.error("Error updating photo status:", error);
    return { success: false, error: error.message || "Failed to update photo status." };
  }
}

/**
 * Toggle featured flag of a photo
 */
export async function togglePhotoFeatured(id: number): Promise<ApiResponse> {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "SUPER_ADMIN") {
      return { success: false, error: "Unauthorized. Admin privileges required." };
    }

    const photo = await prisma.photo.findUnique({ where: { id } });
    if (!photo) return { success: false, error: "Photo not found." };

    const updated = await prisma.photo.update({
      where: { id },
      data: { featured: !photo.featured },
    });

    revalidatePath("/gallery");
    revalidatePath("/");

    return { success: true, message: `Successfully ${updated.featured ? "featured" : "unfeatured"} photo.` };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to toggle featured status." };
  }
}
