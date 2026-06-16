"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import type { ReportStatus } from "@prisma/client";
import type { ApiResponse } from "@/types";
import { revalidatePath } from "next/cache";

/**
 * Fetch all reports for admin review
 */
export async function getAdminReports(): Promise<ApiResponse<any[]>> {
  try {
    await requireRole(["SUPER_ADMIN"]);

    const reports = await prisma.report.findMany({
      include: {
        user: {
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
    });

    // Populate details of the referenced items
    const populatedReports = await Promise.all(
      reports.map(async (report) => {
        let reportedItem: any = null;

        try {
          if (report.referenceType === "Blog") {
            reportedItem = await prisma.blog.findUnique({
              where: { id: report.referenceId },
              select: { id: true, title: true, slug: true },
            });
          } else if (report.referenceType === "Place" || report.referenceType === "TouristPlace") {
            reportedItem = await prisma.touristPlace.findUnique({
              where: { id: report.referenceId },
              select: { id: true, name: true, slug: true },
            });
          } else if (report.referenceType === "Comment") {
            reportedItem = await prisma.comment.findUnique({
              where: { id: report.referenceId },
              select: { id: true, content: true, userId: true },
            });
          } else if (report.referenceType === "Photo") {
            reportedItem = await prisma.photo.findUnique({
              where: { id: report.referenceId },
              select: { id: true, title: true, url: true },
            });
          } else if (report.referenceType === "Video") {
            reportedItem = await prisma.video.findUnique({
              where: { id: report.referenceId },
              select: { id: true, title: true, youtubeUrl: true },
            });
          }
        } catch (err) {
          console.error(`Error resolving report reference ${report.referenceType} #${report.referenceId}:`, err);
        }

        return {
          ...report,
          reportedItem,
        };
      })
    );

    return {
      success: true,
      data: populatedReports,
    };
  } catch (error: any) {
    console.error("Error fetching reports for admin:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch reports.",
      data: [],
    };
  }
}

/**
 * Update the status of a report (PENDING, REVIEWED, RESOLVED, DISMISSED)
 */
export async function updateReportStatus(
  reportId: number,
  status: ReportStatus,
  adminNotes?: string
): Promise<ApiResponse> {
  try {
    const admin = await requireRole(["SUPER_ADMIN"]);

    const report = await prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      return { success: false, error: "Report not found." };
    }

    const isFinished = status === "RESOLVED" || status === "DISMISSED";

    await prisma.report.update({
      where: { id: reportId },
      data: {
        status,
        adminNotes: adminNotes !== undefined ? adminNotes : undefined,
        resolvedAt: isFinished ? new Date() : null,
      },
    });

    // Notify the user who reported (optional, good UX)
    await prisma.notification.create({
      data: {
        userId: report.userId,
        type: "SYSTEM",
        title: `Report Update: ${status}`,
        message: `Your report regarding a ${report.referenceType.toLowerCase()} has been marked as ${status.toLowerCase()}.`,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: admin.id,
        action: `report.status_${status.toLowerCase()}`,
        entityType: "Report",
        entityId: reportId,
        metadata: { status, prevStatus: report.status },
      },
    });

    revalidatePath("/admin/reports");
    return { success: true, message: `Successfully updated report status to ${status}.` };
  } catch (error: any) {
    console.error("Error updating report status:", error);
    return { success: false, error: error.message || "Failed to update report status." };
  }
}
