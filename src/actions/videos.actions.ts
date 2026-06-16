"use server";

import { prisma } from "@/lib/prisma";
import type { MediaStatus } from "@prisma/client";
import type { VideoWithCategory, PaginatedResponse, ApiResponse } from "@/types";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getVideoCategories() {
  try {
    const categories = await prisma.videoCategory.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return categories;
  } catch (error) {
    console.error("Error fetching video categories:", error);
    return [];
  }
}

interface GetVideosOptions {
  categoryId?: number;
  categorySlug?: string;
  status?: MediaStatus;
  featured?: boolean;
  page?: number;
  limit?: number;
}

export async function getVideos(
  options: GetVideosOptions = {}
): Promise<PaginatedResponse<VideoWithCategory>> {
  const {
    categoryId,
    categorySlug,
    status = "PUBLISHED",
    featured,
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

  try {
    const [total, items] = await Promise.all([
      prisma.video.count({ where }),
      prisma.video.findMany({
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

    const formattedData: VideoWithCategory[] = items.map((video) => ({
      id: video.id,
      youtubeUrl: video.youtubeUrl,
      youtubeId: video.youtubeId,
      thumbnail: video.thumbnail,
      title: video.title,
      description: video.description,
      category: video.category,
      contributor: video.contributor,
      featured: video.featured,
      viewCount: video.viewCount,
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
    console.error("Error fetching videos:", error);
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

function extractYoutubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

interface VideoInputData {
  youtubeUrl: string;
  title: string;
  description?: string;
  categoryId: number;
  featured?: boolean;
}

/**
 * Submit and create a new video entry
 */
export async function createVideo(data: VideoInputData): Promise<ApiResponse> {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "SUPER_ADMIN" && user.role !== "CONTRIBUTOR")) {
      return { success: false, error: "Unauthorized. Admin or Contributor role required." };
    }

    const youtubeId = extractYoutubeId(data.youtubeUrl);
    if (!youtubeId) {
      return { success: false, error: "Invalid YouTube URL format." };
    }

    const thumbnail = `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;

    const video = await prisma.video.create({
      data: {
        youtubeUrl: data.youtubeUrl,
        youtubeId,
        thumbnail,
        title: data.title,
        description: data.description || null,
        categoryId: data.categoryId,
        contributorId: user.id,
        featured: data.featured || false,
        status: user.role === "SUPER_ADMIN" ? "PUBLISHED" : "SUBMITTED",
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "video.create",
        entityType: "Video",
        entityId: video.id,
        metadata: { title: video.title, youtubeId },
      },
    });

    revalidatePath("/videos");
    revalidatePath("/");

    return { success: true, message: "Video submitted successfully." };
  } catch (error: any) {
    console.error("Error creating video:", error);
    return { success: false, error: error.message || "Failed to submit video." };
  }
}

/**
 * Delete a video entry
 */
export async function deleteVideo(id: number): Promise<ApiResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const video = await prisma.video.findUnique({ where: { id } });
    if (!video) return { success: false, error: "Video entry not found." };

    if (user.role !== "SUPER_ADMIN" && video.contributorId !== user.id) {
      return { success: false, error: "Unauthorized to delete this video." };
    }

    await prisma.video.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "video.delete",
        entityType: "Video",
        entityId: id,
        metadata: { title: video.title },
      },
    });

    revalidatePath("/videos");
    revalidatePath("/");

    return { success: true, message: "Video entry deleted successfully." };
  } catch (error: any) {
    console.error("Error deleting video:", error);
    return { success: false, error: error.message || "Failed to delete video entry." };
  }
}

/**
 * Update video moderation status
 */
export async function updateVideoStatus(id: number, status: MediaStatus): Promise<ApiResponse> {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "SUPER_ADMIN") {
      return { success: false, error: "Unauthorized. Admin privileges required." };
    }

    const video = await prisma.video.findUnique({
      where: { id },
      select: { title: true, contributorId: true },
    });
    if (!video) return { success: false, error: "Video entry not found." };

    await prisma.video.update({
      where: { id },
      data: { status },
    });

    // Notify contributor
    await prisma.notification.create({
      data: {
        userId: video.contributorId,
        type: "APPROVAL",
        title: `Video Review: ${status}`,
        message: `Your submitted video "${video.title}" has been ${status.toLowerCase()} by the admin.`,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: `video.status_${status.toLowerCase()}`,
        entityType: "Video",
        entityId: id,
        metadata: { title: video.title, status },
      },
    });

    revalidatePath("/videos");
    revalidatePath("/");

    return { success: true, message: `Successfully updated video status to ${status}.` };
  } catch (error: any) {
    console.error("Error updating video status:", error);
    return { success: false, error: error.message || "Failed to update video status." };
  }
}

/**
 * Toggle featured flag of a video
 */
export async function toggleVideoFeatured(id: number): Promise<ApiResponse> {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "SUPER_ADMIN") {
      return { success: false, error: "Unauthorized. Admin privileges required." };
    }

    const video = await prisma.video.findUnique({ where: { id } });
    if (!video) return { success: false, error: "Video entry not found." };

    const updated = await prisma.video.update({
      where: { id },
      data: { featured: !video.featured },
    });

    revalidatePath("/videos");
    revalidatePath("/");

    return { success: true, message: `Successfully ${updated.featured ? "featured" : "unfeatured"} video.` };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to toggle featured status." };
  }
}
