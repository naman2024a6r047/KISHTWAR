"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import type { ApiResponse } from "@/types";
import { revalidatePath } from "next/cache";

/**
 * Fetch all comments for admin moderation
 */
export async function getAdminComments(): Promise<ApiResponse<any[]>> {
  try {
    await requireRole(["SUPER_ADMIN"]);

    const comments = await prisma.comment.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        blog: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        place: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        photo: {
          select: {
            id: true,
            title: true,
            url: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: comments,
    };
  } catch (error: any) {
    console.error("Error fetching comments for admin:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch comments.",
      data: [],
    };
  }
}

/**
 * Delete a comment from admin dashboard
 */
export async function deleteAdminComment(commentId: number): Promise<ApiResponse> {
  try {
    const admin = await requireRole(["SUPER_ADMIN"]);

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return { success: false, error: "Comment not found." };
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    // If blogId is set, decrement commentCount on Blog
    if (comment.blogId) {
      await prisma.blog.update({
        where: { id: comment.blogId },
        data: {
          commentCount: {
            decrement: 1,
          },
        },
      });
    }

    // Log the admin action
    await prisma.activityLog.create({
      data: {
        userId: admin.id,
        action: "comment.delete_admin",
        entityType: "Comment",
        entityId: commentId,
        metadata: { deletedCommentText: comment.content.slice(0, 100) },
      },
    });

    revalidatePath("/admin/comments");
    return { success: true, message: "Comment deleted successfully." };
  } catch (error: any) {
    console.error("Error deleting comment by admin:", error);
    return { success: false, error: error.message || "Failed to delete comment." };
  }
}
