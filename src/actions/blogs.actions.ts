"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import type { ContentStatus } from "@prisma/client";
import type { BlogWithAuthor, BlogDetail, ApiResponse, PaginatedResponse } from "@/types";
import { revalidatePath } from "next/cache";

/**
 * Fetch all blog categories.
 */
export async function getBlogCategories() {
  try {
    const categories = await prisma.blogCategory.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return categories;
  } catch (error) {
    console.error("Error fetching blog categories:", error);
    return [];
  }
}

interface GetBlogsOptions {
  search?: string;
  categoryId?: number;
  categorySlug?: string;
  authorId?: number;
  status?: ContentStatus;
  featured?: boolean;
  page?: number;
  limit?: number;
}

/**
 * Fetch blogs based on filters and pagination.
 */
export async function getBlogs(
  options: GetBlogsOptions = {}
): Promise<PaginatedResponse<BlogWithAuthor>> {
  const {
    search,
    categoryId,
    categorySlug,
    authorId,
    status = "PUBLISHED",
    featured,
    page = 1,
    limit = 9,
  } = options;

  const skip = (page - 1) * limit;

  // Build where query
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

  if (authorId) {
    where.authorId = authorId;
  }

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { content: { contains: search } },
      { excerpt: { contains: search } },
    ];
  }

  try {
    const [total, items] = await Promise.all([
      prisma.blog.count({ where }),
      prisma.blog.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          publishedAt: "desc",
        },
        skip,
        take: limit,
      }),
    ]);

    const formattedData: BlogWithAuthor[] = items.map((blog) => ({
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      featuredImage: blog.featuredImage,
      readingTime: blog.readingTime,
      category: blog.category,
      author: blog.author,
      viewCount: blog.viewCount,
      likeCount: blog.likeCount,
      commentCount: blog.commentCount,
      featured: blog.featured,
      status: blog.status,
      publishedAt: blog.publishedAt,
      createdAt: blog.createdAt,
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
    console.error("Error fetching blogs:", error);
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
 * Fetch a single blog by slug and increment view count.
 */
export async function getBlogBySlug(slug: string): Promise<BlogDetail | null> {
  try {
    const updatedBlog = await prisma.blog.update({
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
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!updatedBlog || updatedBlog.status !== "PUBLISHED") {
      return null;
    }

    const blogDetail: BlogDetail = {
      id: updatedBlog.id,
      title: updatedBlog.title,
      slug: updatedBlog.slug,
      content: updatedBlog.content,
      excerpt: updatedBlog.excerpt,
      featuredImage: updatedBlog.featuredImage,
      readingTime: updatedBlog.readingTime,
      category: updatedBlog.category,
      author: updatedBlog.author,
      tags: updatedBlog.tags,
      viewCount: updatedBlog.viewCount,
      likeCount: updatedBlog.likeCount,
      commentCount: updatedBlog.commentCount,
      featured: updatedBlog.featured,
      status: updatedBlog.status,
      publishedAt: updatedBlog.publishedAt,
      createdAt: updatedBlog.createdAt,
      metaTitle: updatedBlog.metaTitle,
      metaDescription: updatedBlog.metaDescription,
      autoSaveContent: updatedBlog.autoSaveContent,
      autoSaveAt: updatedBlog.autoSaveAt,
    };

    return blogDetail;
  } catch (error) {
    console.error(`Error fetching blog by slug ${slug}:`, error);
    return null;
  }
}
export async function likeBlog(blogId: number): Promise<ApiResponse<{ likeCount: number; isLiked: boolean }>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "You must be logged in to like a blog post." };
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_blogId: {
          userId: user.id,
          blogId,
        },
      },
    });

    let isLiked = false;

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      isLiked = false;
    } else {
      // Like
      await prisma.like.create({
        data: {
          userId: user.id,
          blogId,
        },
      });
      isLiked = true;
    }

    // Recalculate like count
    const likeCount = await prisma.like.count({
      where: { blogId },
    });

    await prisma.blog.update({
      where: { id: blogId },
      data: { likeCount },
    });

    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      select: { slug: true },
    });

    if (blog) {
      revalidatePath(`/blog/${blog.slug}`);
      revalidatePath(`/blog`);
      revalidatePath(`/`);
    }

    return {
      success: true,
      data: {
        likeCount,
        isLiked,
      },
    };
  } catch (error) {
    console.error("Error liking blog:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

/**
 * Check if the current user has liked a specific blog.
 */
export async function getBlogLikeStatus(blogId: number): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    if (!user) return false;

    const like = await prisma.like.findUnique({
      where: {
        userId_blogId: {
          userId: user.id,
          blogId,
        },
      },
    });

    return !!like;
  } catch {
    return false;
  }
}
export async function getBlogSavedStatus(blogId: number): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    if (!user) return false;

    const saved = await prisma.savedItem.findFirst({
      where: {
        userId: user.id,
        blogId,
      },
    });

    return !!saved;
  } catch {
    return false;
  }
}

interface BlogInputData {
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  categoryId: number;
  tags?: string[];
}

/**
 * Create a new blog post
 */
export async function createBlog(data: BlogInputData): Promise<ApiResponse> {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "SUPER_ADMIN" && user.role !== "CONTRIBUTOR")) {
      return { success: false, error: "Unauthorized. Admin or Contributor role required." };
    }

    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check slug uniqueness
    const existing = await prisma.blog.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now().toString().slice(-4)}` : slug;

    // Calculate reading time
    const wordCount = data.content.split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    // Resolve tag IDs
    const tagIds: number[] = [];
    if (data.tags && data.tags.length > 0) {
      for (const tagName of data.tags) {
        const tagSlug = tagName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        if (!tagSlug) continue;

        const tag = await prisma.tag.upsert({
          where: { slug: tagSlug },
          update: {},
          create: { name: tagName, slug: tagSlug },
        });
        tagIds.push(tag.id);
      }
    }

    const blog = await prisma.blog.create({
      data: {
        title: data.title,
        slug: finalSlug,
        content: data.content,
        excerpt: data.excerpt || data.content.replace(/<[^>]*>/g, "").slice(0, 160) + "...",
        featuredImage: data.featuredImage || null,
        readingTime,
        categoryId: data.categoryId,
        authorId: user.id,
        status: user.role === "SUPER_ADMIN" ? "PUBLISHED" : "SUBMITTED",
        publishedAt: user.role === "SUPER_ADMIN" ? new Date() : null,
        tags: {
          create: tagIds.map((tagId) => ({
            tagId,
          })),
        },
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "blog.create",
        entityType: "Blog",
        entityId: blog.id,
        metadata: { title: blog.title, slug: blog.slug },
      },
    });

    revalidatePath("/blog");
    revalidatePath("/");

    return { success: true, message: "Blog post submitted successfully." };
  } catch (error: any) {
    console.error("Error creating blog:", error);
    return { success: false, error: error.message || "Failed to create blog." };
  }
}

/**
 * Update an existing blog post
 */
export async function updateBlog(id: number, data: Partial<BlogInputData>): Promise<ApiResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) return { success: false, error: "Blog post not found." };

    if (user.role !== "SUPER_ADMIN" && blog.authorId !== user.id) {
      return { success: false, error: "Unauthorized to edit this blog." };
    }

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.content !== undefined) {
      updateData.content = data.content;
      const wordCount = data.content.split(/\s+/).length;
      updateData.readingTime = Math.max(1, Math.ceil(wordCount / 200));
      if (!data.excerpt) {
        updateData.excerpt = data.content.replace(/<[^>]*>/g, "").slice(0, 160) + "...";
      }
    }
    if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
    if (data.featuredImage !== undefined) updateData.featuredImage = data.featuredImage;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;

    // Reset status to SUBMITTED if edited by contributor
    if (user.role === "CONTRIBUTOR") {
      updateData.status = "SUBMITTED";
    }

    await prisma.blog.update({
      where: { id },
      data: updateData,
    });

    // Handle tags update if provided
    if (data.tags) {
      const tagIds: number[] = [];
      for (const tagName of data.tags) {
        const tagSlug = tagName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        if (!tagSlug) continue;

        const tag = await prisma.tag.upsert({
          where: { slug: tagSlug },
          update: {},
          create: { name: tagName, slug: tagSlug },
        });
        tagIds.push(tag.id);
      }

      await prisma.blogTag.deleteMany({ where: { blogId: id } });
      if (tagIds.length > 0) {
        await prisma.blogTag.createMany({
          data: tagIds.map((tagId) => ({
            blogId: id,
            tagId,
          })),
        });
      }
    }

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "blog.update",
        entityType: "Blog",
        entityId: id,
        metadata: { title: blog.title },
      },
    });

    revalidatePath(`/blog/${blog.slug}`);
    revalidatePath("/blog");
    revalidatePath("/");

    return { success: true, message: "Blog post updated successfully." };
  } catch (error: any) {
    console.error("Error updating blog:", error);
    return { success: false, error: error.message || "Failed to update blog." };
  }
}

/**
 * Delete a blog post
 */
export async function deleteBlog(id: number): Promise<ApiResponse> {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "SUPER_ADMIN") {
      return { success: false, error: "Unauthorized. Admin privileges required." };
    }

    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) return { success: false, error: "Blog post not found." };

    await prisma.blog.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "blog.delete",
        entityType: "Blog",
        entityId: id,
        metadata: { title: blog.title },
      },
    });

    revalidatePath("/blog");
    revalidatePath("/");

    return { success: true, message: "Blog post deleted successfully." };
  } catch (error: any) {
    console.error("Error deleting blog:", error);
    return { success: false, error: error.message || "Failed to delete blog post." };
  }
}

/**
 * Update blog moderation status (Approve/Reject/Publish)
 */
export async function updateBlogStatus(id: number, status: ContentStatus): Promise<ApiResponse> {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "SUPER_ADMIN") {
      return { success: false, error: "Unauthorized. Admin privileges required." };
    }

    const blog = await prisma.blog.findUnique({
      where: { id },
      select: { title: true, authorId: true },
    });

    if (!blog) return { success: false, error: "Blog post not found." };

    const updateData: any = { status };
    if (status === "PUBLISHED") {
      updateData.publishedAt = new Date();
    }

    await prisma.blog.update({
      where: { id },
      data: updateData,
    });

    // Notify contributor
    await prisma.notification.create({
      data: {
        userId: blog.authorId,
        type: "APPROVAL",
        title: `Story Review: ${status}`,
        message: `Your submitted story/blog "${blog.title}" has been ${status.toLowerCase()} by the admin.`,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: `blog.status_${status.toLowerCase()}`,
        entityType: "Blog",
        entityId: id,
        metadata: { title: blog.title, status },
      },
    });

    revalidatePath("/blog");
    revalidatePath("/");

    return { success: true, message: `Successfully updated blog status to ${status}.` };
  } catch (error: any) {
    console.error("Error updating blog status:", error);
    return { success: false, error: error.message || "Failed to update blog status." };
  }
}
