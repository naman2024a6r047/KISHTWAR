"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type CategoryType = "blog" | "place" | "photo" | "video" | "event";

// Common category shape returned to the frontend
export interface CategoryDTO {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  sortOrder: number;
  createdAt: Date;
}

function getPrismaModel(type: CategoryType) {
  switch (type) {
    case "blog": return prisma.blogCategory;
    case "place": return prisma.placeCategory;
    case "photo": return prisma.photoCategory;
    case "video": return prisma.videoCategory;
    case "event": return prisma.eventCategory;
    default: throw new Error("Invalid category type");
  }
}

export async function getCategories(type: CategoryType): Promise<{ success: boolean; data?: CategoryDTO[]; error?: string }> {
  try {
    await requireRole(["SUPER_ADMIN"]);
    const model = getPrismaModel(type);
    
    // @ts-ignore - Prisma dynamic model methods are hard to type perfectly
    const categories = await model.findMany({
      orderBy: { sortOrder: "asc" },
    });
    
    return { success: true, data: categories as CategoryDTO[] };
  } catch (error: any) {
    console.error(`Error fetching ${type} categories:`, error);
    return { success: false, error: error.message || "Failed to fetch categories" };
  }
}

export async function createCategory(type: CategoryType, data: { name: string; slug: string; description?: string; icon?: string; sortOrder?: number }) {
  try {
    await requireRole(["SUPER_ADMIN"]);
    const model = getPrismaModel(type);
    
    const payload: any = {
      name: data.name,
      slug: data.slug,
      sortOrder: data.sortOrder || 0,
    };
    
    if (type === "blog" || type === "place") {
      payload.description = data.description || null;
    }
    if (type === "place") {
      payload.icon = data.icon || null;
    }

    // @ts-ignore
    await model.create({ data: payload });
    
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error: any) {
    console.error(`Error creating ${type} category:`, error);
    if (error.code === 'P2002') return { success: false, error: "A category with this slug already exists." };
    return { success: false, error: error.message || "Failed to create category" };
  }
}

export async function updateCategory(type: CategoryType, id: number, data: { name: string; slug: string; description?: string; icon?: string; sortOrder?: number }) {
  try {
    await requireRole(["SUPER_ADMIN"]);
    const model = getPrismaModel(type);
    
    const payload: any = {
      name: data.name,
      slug: data.slug,
      sortOrder: data.sortOrder || 0,
    };
    
    if (type === "blog" || type === "place") {
      payload.description = data.description || null;
    }
    if (type === "place") {
      payload.icon = data.icon || null;
    }

    // @ts-ignore
    await model.update({
      where: { id },
      data: payload,
    });
    
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error: any) {
    console.error(`Error updating ${type} category:`, error);
    if (error.code === 'P2002') return { success: false, error: "A category with this slug already exists." };
    return { success: false, error: error.message || "Failed to update category" };
  }
}

export async function deleteCategory(type: CategoryType, id: number) {
  try {
    const admin = await requireRole(["SUPER_ADMIN"]);
    const model = getPrismaModel(type);
    
    // First, let's make sure it exists
    // @ts-ignore
    const existing = await model.findUnique({ where: { id } });
    if (!existing) return { success: false, error: "Category not found" };

    // Prevent deletion if it's currently associated with items?
    // We should probably check, but for now we'll attempt deletion and catch the constraint error
    try {
      // @ts-ignore
      await model.delete({ where: { id } });
    } catch (e: any) {
      if (e.code === 'P2003') { // Foreign key constraint failed
        return { success: false, error: "Cannot delete category because it is being used by existing content." };
      }
      throw e;
    }
    
    await prisma.activityLog.create({
      data: {
        userId: admin.id,
        action: "DELETED_CATEGORY",
        entityType: `${type.toUpperCase()}_CATEGORY`,
        entityId: id,
        metadata: { name: existing.name },
      },
    });
    
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error: any) {
    console.error(`Error deleting ${type} category:`, error);
    return { success: false, error: error.message || "Failed to delete category" };
  }
}
