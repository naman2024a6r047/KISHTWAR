"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import type { FeaturedSection } from "@prisma/client";
import type { ApiResponse, HomepageSectionData, HeroSlideData } from "@/types";
import { revalidatePath } from "next/cache";

/**
 * Fetch all homepage sections for public page (only visible ones)
 */
export async function getHomepageSections(): Promise<HomepageSectionData[]> {
  try {
    const sections = await prisma.homepageSection.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: "asc" },
    });

    return sections.map((sec) => ({
      id: sec.id,
      sectionKey: sec.sectionKey,
      title: sec.title,
      subtitle: sec.subtitle,
      isVisible: sec.isVisible,
      sortOrder: sec.sortOrder,
      config: sec.config ? (sec.config as Record<string, unknown>) : null,
    }));
  } catch (error) {
    console.error("Error fetching homepage sections:", error);
    return [];
  }
}

/**
 * Fetch all homepage sections (visible or hidden) for admin management
 */
export async function getAllHomepageSections(): Promise<ApiResponse<HomepageSectionData[]>> {
  try {
    await requireRole(["SUPER_ADMIN"]);
    const sections = await prisma.homepageSection.findMany({
      orderBy: { sortOrder: "asc" },
    });

    const data = sections.map((sec) => ({
      id: sec.id,
      sectionKey: sec.sectionKey,
      title: sec.title,
      subtitle: sec.subtitle,
      isVisible: sec.isVisible,
      sortOrder: sec.sortOrder,
      config: sec.config ? (sec.config as Record<string, unknown>) : null,
    }));

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch all sections." };
  }
}

/**
 * Update a homepage section's visibility and details
 */
export async function updateHomepageSection(
  id: number,
  data: { title?: string | null; subtitle?: string | null; isVisible?: boolean; config?: any }
): Promise<ApiResponse> {
  try {
    await requireRole(["SUPER_ADMIN"]);

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.subtitle !== undefined) updateData.subtitle = data.subtitle;
    if (data.isVisible !== undefined) updateData.isVisible = data.isVisible;
    if (data.config !== undefined) {
      updateData.config = data.config ? JSON.parse(JSON.stringify(data.config)) : null;
    }

    await prisma.homepageSection.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/");
    return { success: true, message: "Homepage section updated successfully." };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update homepage section." };
  }
}

/**
 * Update the order of homepage sections
 */
export async function reorderHomepageSections(orderedIds: number[]): Promise<ApiResponse> {
  try {
    await requireRole(["SUPER_ADMIN"]);

    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.homepageSection.update({
          where: { id },
          data: { sortOrder: index },
        })
      )
    );

    revalidatePath("/");
    return { success: true, message: "Sections reordered successfully." };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to reorder sections." };
  }
}

/**
 * Fetch active hero slides for homepage slider
 */
export async function getActiveHeroSlides(): Promise<HeroSlideData[]> {
  try {
    const slides = await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    return slides.map((slide) => ({
      id: slide.id,
      title: slide.title,
      subtitle: slide.subtitle,
      backgroundImage: slide.backgroundImage,
      backgroundVideoUrl: slide.backgroundVideoUrl,
      ctaText: slide.ctaText,
      ctaLink: slide.ctaLink,
      ctaSecondaryText: slide.ctaSecondaryText,
      ctaSecondaryLink: slide.ctaSecondaryLink,
      sortOrder: slide.sortOrder,
      isActive: slide.isActive,
    }));
  } catch (error) {
    console.error("Error fetching hero slides:", error);
    return [];
  }
}

/**
 * Fetch all hero slides for admin management
 */
export async function getAllHeroSlides(): Promise<ApiResponse<HeroSlideData[]>> {
  try {
    await requireRole(["SUPER_ADMIN"]);
    const slides = await prisma.heroSlide.findMany({
      orderBy: { sortOrder: "asc" },
    });

    const data = slides.map((slide) => ({
      id: slide.id,
      title: slide.title,
      subtitle: slide.subtitle,
      backgroundImage: slide.backgroundImage,
      backgroundVideoUrl: slide.backgroundVideoUrl,
      ctaText: slide.ctaText,
      ctaLink: slide.ctaLink,
      ctaSecondaryText: slide.ctaSecondaryText,
      ctaSecondaryLink: slide.ctaSecondaryLink,
      sortOrder: slide.sortOrder,
      isActive: slide.isActive,
    }));

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch all hero slides." };
  }
}

/**
 * Create a new hero slide
 */
export async function createHeroSlide(data: Omit<HeroSlideData, "id">): Promise<ApiResponse> {
  try {
    await requireRole(["SUPER_ADMIN"]);

    await prisma.heroSlide.create({
      data: {
        title: data.title,
        subtitle: data.subtitle || null,
        backgroundImage: data.backgroundImage,
        backgroundVideoUrl: data.backgroundVideoUrl || null,
        ctaText: data.ctaText || null,
        ctaLink: data.ctaLink || null,
        ctaSecondaryText: data.ctaSecondaryText || null,
        ctaSecondaryLink: data.ctaSecondaryLink || null,
        sortOrder: data.sortOrder || 0,
        isActive: data.isActive ?? true,
      },
    });

    revalidatePath("/");
    return { success: true, message: "Hero slide created successfully." };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create hero slide." };
  }
}

/**
 * Update an existing hero slide
 */
export async function updateHeroSlide(id: number, data: Partial<HeroSlideData>): Promise<ApiResponse> {
  try {
    await requireRole(["SUPER_ADMIN"]);

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.subtitle !== undefined) updateData.subtitle = data.subtitle;
    if (data.backgroundImage !== undefined) updateData.backgroundImage = data.backgroundImage;
    if (data.backgroundVideoUrl !== undefined) updateData.backgroundVideoUrl = data.backgroundVideoUrl;
    if (data.ctaText !== undefined) updateData.ctaText = data.ctaText;
    if (data.ctaLink !== undefined) updateData.ctaLink = data.ctaLink;
    if (data.ctaSecondaryText !== undefined) updateData.ctaSecondaryText = data.ctaSecondaryText;
    if (data.ctaSecondaryLink !== undefined) updateData.ctaSecondaryLink = data.ctaSecondaryLink;
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    await prisma.heroSlide.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/");
    return { success: true, message: "Hero slide updated successfully." };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update hero slide." };
  }
}

/**
 * Delete a hero slide
 */
export async function deleteHeroSlide(id: number): Promise<ApiResponse> {
  try {
    await requireRole(["SUPER_ADMIN"]);

    await prisma.heroSlide.delete({
      where: { id },
    });

    revalidatePath("/");
    return { success: true, message: "Hero slide deleted successfully." };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete hero slide." };
  }
}

/**
 * Fetch featured items for a home page section (e.g. PLACES, BLOGS)
 */
export async function getFeaturedContent(section: FeaturedSection): Promise<any[]> {
  try {
    const featuredList = await prisma.featuredContent.findMany({
      where: { section, isActive: true },
      orderBy: { sortOrder: "asc" },
      select: { referenceId: true },
    });

    const ids = featuredList.map((item) => item.referenceId);
    if (ids.length === 0) return [];

    if (section === "PLACES") {
      return prisma.touristPlace.findMany({
        where: { id: { in: ids }, status: "PUBLISHED" },
        include: { category: true },
      });
    }

    if (section === "BLOGS") {
      return prisma.blog.findMany({
        where: { id: { in: ids }, status: "PUBLISHED" },
        include: {
          category: true,
          author: {
            select: { name: true, username: true, avatar: true },
          },
        },
      });
    }

    if (section === "VIDEOS") {
      return prisma.video.findMany({
        where: { id: { in: ids }, status: "PUBLISHED" },
      });
    }

    if (section === "EVENTS") {
      return prisma.event.findMany({
        where: { id: { in: ids }, status: "PUBLISHED" },
        include: { category: true },
      });
    }

    if (section === "GALLERY") {
      return prisma.photo.findMany({
        where: { id: { in: ids } },
      });
    }

    return [];
  } catch (error) {
    console.error(`Error fetching featured content for ${section}:`, error);
    return [];
  }
}

/**
 * Set featured content for a section
 */
export async function updateFeaturedContent(section: FeaturedSection, referenceIds: number[]): Promise<ApiResponse> {
  try {
    await requireRole(["SUPER_ADMIN"]);

    // Delete existing featured content for this section
    await prisma.featuredContent.deleteMany({
      where: { section },
    });

    // Create new ones
    if (referenceIds.length > 0) {
      await prisma.featuredContent.createMany({
        data: referenceIds.map((refId, idx) => ({
          section,
          referenceId: refId,
          sortOrder: idx,
          isActive: true,
        })),
      });
    }

    revalidatePath("/");
    return { success: true, message: `Successfully updated featured content for ${section}.` };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update featured content." };
  }
}
