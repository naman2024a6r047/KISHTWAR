"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import type { UserRole, ContentStatus } from "@prisma/client";
import type { AdminDashboardStats, ActivityLogEntry, ApiResponse } from "@/types";
import { revalidatePath } from "next/cache";

/**
 * Helper to log admin actions
 */
async function logAdminAction(adminId: number, action: string, entityType?: string, entityId?: number, metadata?: any) {
  try {
    await prisma.activityLog.create({
      data: {
        userId: adminId,
        action,
        entityType: entityType || null,
        entityId: entityId || null,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : null,
      },
    });
  } catch (error) {
    console.error("Failed to log admin action:", error);
  }
}

/**
 * Fetch overview stats for the admin dashboard
 */
export async function getAdminStats(): Promise<ApiResponse<AdminDashboardStats>> {
  try {
    const admin = await requireRole(["SUPER_ADMIN"]);

    const [
      totalUsers,
      totalContributors,
      totalPlaces,
      totalBlogs,
      totalEvents,
      totalVideos,
      totalPhotos,
      totalComments,
      pendingPlaces,
      pendingBlogs,
      pendingEvents,
      pendingPhotos,
      pendingVideos,
      pendingReports,
      totalPageViews,
      recentLogs,
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      // Total contributors
      prisma.user.count({ where: { role: "CONTRIBUTOR" } }),
      // Total places
      prisma.touristPlace.count(),
      // Total blogs
      prisma.blog.count(),
      // Total events
      prisma.event.count(),
      // Total videos
      prisma.video.count(),
      // Total photos
      prisma.photo.count(),
      // Total comments
      prisma.comment.count(),
      // Pending content approvals
      prisma.touristPlace.count({ where: { status: "SUBMITTED" } }),
      prisma.blog.count({ where: { status: "SUBMITTED" } }),
      prisma.event.count({ where: { status: "SUBMITTED" } }),
      prisma.photo.count({ where: { status: "SUBMITTED" } }),
      prisma.video.count({ where: { status: "SUBMITTED" } }),
      // Pending reports
      prisma.report.count({ where: { status: "PENDING" } }),
      // Total page views
      prisma.pageView.count(),
      // Recent activity logs
      prisma.activityLog.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              name: true,
              avatar: true,
            },
          },
        },
      }),
    ]);

    const pendingApprovals = pendingPlaces + pendingBlogs + pendingEvents + pendingPhotos + pendingVideos;

    const recentActivity: ActivityLogEntry[] = recentLogs.map((log) => ({
      id: log.id,
      action: log.action,
      entityType: log.entityType,
      entityId: log.entityId,
      metadata: log.metadata ? (log.metadata as Record<string, unknown>) : null,
      createdAt: log.createdAt,
      user: log.user ? { name: log.user.name, avatar: log.user.avatar } : null,
    }));

    return {
      success: true,
      data: {
        totalUsers,
        totalContributors,
        totalPlaces,
        totalBlogs,
        totalEvents,
        totalVideos,
        totalPhotos,
        totalComments,
        pendingApprovals,
        totalPageViews,
        recentActivity,
      },
    };
  } catch (error: any) {
    console.error("Error fetching admin stats:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch admin stats.",
    };
  }
}

/**
 * Fetch analytics data for charts (last 30 days)
 */
export async function getAnalyticsData(): Promise<ApiResponse<{
  viewsOverTime: { date: string; views: number }[];
  contentDistribution: { name: string; value: number }[];
}>> {
  try {
    await requireRole(["SUPER_ADMIN"]);

    // Calculate dates for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [views, placesCount, blogsCount, eventsCount, photosCount, videosCount] = await Promise.all([
      prisma.pageView.findMany({
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
        select: {
          createdAt: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),
      prisma.touristPlace.count(),
      prisma.blog.count(),
      prisma.event.count(),
      prisma.photo.count(),
      prisma.video.count(),
    ]);

    // Group views by date string (YYYY-MM-DD)
    const viewsMap: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      viewsMap[key] = 0;
    }

    views.forEach((view) => {
      const key = view.createdAt.toISOString().split("T")[0];
      if (viewsMap[key] !== undefined) {
        viewsMap[key] += 1;
      }
    });

    const viewsOverTime = Object.entries(viewsMap).map(([date, count]) => ({
      date: date.substring(5), // MM-DD format for chart labels
      views: count,
    }));

    const contentDistribution = [
      { name: "Places", value: placesCount },
      { name: "Blogs", value: blogsCount },
      { name: "Events", value: eventsCount },
      { name: "Photos", value: photosCount },
      { name: "Videos", value: videosCount },
    ];

    return {
      success: true,
      data: {
        viewsOverTime,
        contentDistribution,
      },
    };
  } catch (error: any) {
    console.error("Error fetching analytics data:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch analytics data.",
    };
  }
}

/**
 * Update a user's role
 */
export async function updateUserRole(targetUserId: number, newRole: UserRole): Promise<ApiResponse> {
  try {
    const admin = await requireRole(["SUPER_ADMIN"]);

    if (admin.id === targetUserId) {
      return { success: false, error: "You cannot change your own role." };
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
      select: { name: true, email: true },
    });

    // If changing role to CONTRIBUTOR, ensure they have a profile
    if (newRole === "CONTRIBUTOR") {
      await prisma.contributorProfile.upsert({
        where: { userId: targetUserId },
        update: {},
        create: {
          userId: targetUserId,
          specialty: "Contributor",
          verified: true,
          approvedAt: new Date(),
        },
      });
    }

    await logAdminAction(admin.id, "user.role_update", "User", targetUserId, {
      newRole,
      userEmail: updatedUser.email,
    });

    revalidatePath("/admin/users");
    return { success: true, message: `Successfully updated ${updatedUser.name}'s role to ${newRole}.` };
  } catch (error: any) {
    console.error("Error updating user role:", error);
    return { success: false, error: error.message || "Failed to update user role." };
  }
}

/**
 * Verify a user's email manually
 */
export async function verifyUserEmail(targetUserId: number): Promise<ApiResponse> {
  try {
    const admin = await requireRole(["SUPER_ADMIN"]);

    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { name: true, email: true, emailVerified: true },
    });

    if (!user) {
      return { success: false, error: "User not found." };
    }

    if (user.emailVerified) {
      return { success: false, error: "User email is already verified." };
    }

    await prisma.user.update({
      where: { id: targetUserId },
      data: { emailVerified: true },
    });

    await logAdminAction(admin.id, "user.email_verify", "User", targetUserId, {
      userEmail: user.email,
    });

    revalidatePath("/admin/users");
    return {
      success: true,
      message: `Successfully verified email for user ${user.name}.`,
    };
  } catch (error: any) {
    console.error("Error verifying user email:", error);
    return { success: false, error: error.message || "Failed to verify user email." };
  }
}

/**
 * Toggle a user's active status (ban/unban)
 */
export async function toggleUserActive(targetUserId: number): Promise<ApiResponse> {
  try {
    const admin = await requireRole(["SUPER_ADMIN"]);

    if (admin.id === targetUserId) {
      return { success: false, error: "You cannot ban/deactivate yourself." };
    }

    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { isActive: true, name: true, email: true },
    });

    if (!user) {
      return { success: false, error: "User not found." };
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { isActive: !user.isActive },
    });

    await logAdminAction(admin.id, updatedUser.isActive ? "user.unban" : "user.ban", "User", targetUserId, {
      userEmail: user.email,
    });

    revalidatePath("/admin/users");
    return {
      success: true,
      message: `Successfully ${updatedUser.isActive ? "activated" : "deactivated"} user ${user.name}.`,
    };
  } catch (error: any) {
    console.error("Error toggling user active status:", error);
    return { success: false, error: error.message || "Failed to toggle user status." };
  }
}

/**
 * Approve contributor verification request
 */
export async function approveContributor(targetUserId: number): Promise<ApiResponse> {
  try {
    const admin = await requireRole(["SUPER_ADMIN"]);

    const profile = await prisma.contributorProfile.update({
      where: { userId: targetUserId },
      data: {
        verified: true,
        approvedAt: new Date(),
        user: {
          update: {
            role: "CONTRIBUTOR",
          },
        },
      },
      include: {
        user: {
          select: { name: true },
        },
      },
    });

    // Create system notification for user
    await prisma.notification.create({
      data: {
        userId: targetUserId,
        type: "APPROVAL",
        title: "Contributor Profile Verified",
        message: "Congratulations! Your contributor profile has been verified and approved by the admin team.",
      },
    });

    await logAdminAction(admin.id, "contributor.approve", "ContributorProfile", profile.id, {
      userName: profile.user.name,
    });

    revalidatePath("/admin/contributors");
    return { success: true, message: `Successfully approved ${profile.user.name} as a verified contributor.` };
  } catch (error: any) {
    console.error("Error approving contributor:", error);
    return { success: false, error: error.message || "Failed to approve contributor." };
  }
}

/**
 * Delete a user account completely
 */
export async function deleteUser(targetUserId: number): Promise<ApiResponse> {
  try {
    const admin = await requireRole(["SUPER_ADMIN"]);

    if (admin.id === targetUserId) {
      return { success: false, error: "You cannot delete your own account." };
    }

    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { name: true, email: true },
    });

    if (!user) {
      return { success: false, error: "User not found." };
    }

    await prisma.user.delete({
      where: { id: targetUserId },
    });

    await logAdminAction(admin.id, "user.delete", "User", targetUserId, {
      userName: user.name,
      userEmail: user.email,
    });

    revalidatePath("/admin/users");
    return { success: true, message: `Successfully deleted user ${user.name}.` };
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return { success: false, error: error.message || "Failed to delete user." };
  }
}

/**
 * Get users list for admin management with filters
 */
export async function getAdminUsers(options: {
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  page?: number;
  limit?: number;
} = {}): Promise<ApiResponse<{
  users: any[];
  total: number;
}>> {
  try {
    await requireRole(["SUPER_ADMIN"]);

    const { search, role, isActive, page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (role) {
      where.role = role;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { username: { contains: search } },
      ];
    }

    const [total, items] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
          avatar: true,
          role: true,
          isActive: true,
          emailVerified: true,
          createdAt: true,
          _count: {
            select: {
              blogs: true,
              touristPlaces: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    return {
      success: true,
      data: {
        users: items,
        total,
      },
    };
  } catch (error: any) {
    console.error("Error fetching admin users:", error);
    return { success: false, error: error.message || "Failed to fetch users." };
  }
}
