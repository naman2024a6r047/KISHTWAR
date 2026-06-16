"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import type { ApiResponse } from "@/types";
import { revalidatePath } from "next/cache";

/**
 * Fetch all site settings as a key-value record
 */
export async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    const settings = await prisma.siteSetting.findMany();
    const settingsMap: Record<string, string> = {};

    settings.forEach((set) => {
      settingsMap[set.settingKey] = set.settingValue || "";
    });

    return settingsMap;
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return {};
  }
}

/**
 * Fetch settings grouped by settingGroup for admin settings panel
 */
export async function getSettingsByGroup(): Promise<ApiResponse<Record<string, any[]>>> {
  try {
    await requireRole(["SUPER_ADMIN"]);
    const settings = await prisma.siteSetting.findMany({
      orderBy: { settingKey: "asc" },
    });

    const grouped: Record<string, any[]> = {};
    settings.forEach((set) => {
      if (!grouped[set.settingGroup]) {
        grouped[set.settingGroup] = [];
      }
      grouped[set.settingGroup].push({
        id: set.id,
        key: set.settingKey,
        value: set.settingValue || "",
        group: set.settingGroup,
        valueType: set.valueType,
      });
    });

    return { success: true, data: grouped };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch settings." };
  }
}

/**
 * Update a single setting
 */
export async function updateSetting(key: string, value: string): Promise<ApiResponse> {
  try {
    const admin = await requireRole(["SUPER_ADMIN"]);

    await prisma.siteSetting.upsert({
      where: { settingKey: key },
      update: { settingValue: value },
      create: {
        settingKey: key,
        settingValue: value,
        settingGroup: "general",
        valueType: "STRING",
      },
    });

    // Log the change
    await prisma.activityLog.create({
      data: {
        userId: admin.id,
        action: "settings.update",
        entityType: "SiteSetting",
        metadata: { key, value },
      },
    });

    revalidatePath("/");
    return { success: true, message: `Setting '${key}' updated successfully.` };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update setting." };
  }
}

/**
 * Update multiple settings in a batch
 */
export async function updateSettingsBatch(
  settings: { key: string; value: string }[]
): Promise<ApiResponse> {
  try {
    const admin = await requireRole(["SUPER_ADMIN"]);

    await prisma.$transaction(
      settings.map((set) =>
        prisma.siteSetting.upsert({
          where: { settingKey: set.key },
          update: { settingValue: set.value },
          create: {
            settingKey: set.key,
            settingValue: set.value,
            settingGroup: "general",
            valueType: "STRING",
          },
        })
      )
    );

    // Log the change
    await prisma.activityLog.create({
      data: {
        userId: admin.id,
        action: "settings.batch_update",
        entityType: "SiteSetting",
        metadata: { count: settings.length },
      },
    });

    revalidatePath("/");
    return { success: true, message: "Settings updated successfully." };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update settings batch." };
  }
}
