import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { itemId, itemType } = body;

    if (!itemId || !itemType) {
      return NextResponse.json({ success: false, error: "itemId and itemType are required" }, { status: 400 });
    }

    // Determine the unique constraint select parameters based on itemType
    const uniqueKeys: any = {
      userId: user.id,
    };

    if (itemType === "blog") {
      uniqueKeys.blogId = itemId;
    } else if (itemType === "place") {
      uniqueKeys.placeId = itemId;
    } else if (itemType === "photo") {
      uniqueKeys.photoId = itemId;
    } else if (itemType === "comment") {
      uniqueKeys.commentId = itemId;
    } else {
      return NextResponse.json({ success: false, error: "Invalid itemType" }, { status: 400 });
    }

    // Determine unique name for Prisma delete/findUnique query
    let uniqueConstraint: any;
    if (itemType === "blog") {
      uniqueConstraint = { userId_blogId: { userId: user.id, blogId: itemId } };
    } else if (itemType === "place") {
      uniqueConstraint = { userId_placeId: { userId: user.id, placeId: itemId } };
    } else if (itemType === "photo") {
      uniqueConstraint = { userId_photoId: { userId: user.id, photoId: itemId } };
    } else if (itemType === "comment") {
      uniqueConstraint = { userId_commentId: { userId: user.id, commentId: itemId } };
    }

    // Check if like exists
    const existing = await prisma.like.findUnique({
      where: uniqueConstraint,
    });

    let liked = false;

    if (existing) {
      // Unlike (delete record)
      await prisma.like.delete({
        where: { id: existing.id },
      });
      liked = false;
    } else {
      // Like (create record)
      await prisma.like.create({
        data: {
          userId: user.id,
          ...(itemType === "blog" && { blogId: itemId }),
          ...(itemType === "place" && { placeId: itemId }),
          ...(itemType === "photo" && { photoId: itemId }),
          ...(itemType === "comment" && { commentId: itemId }),
        },
      });
      liked = true;
    }

    // Update the like count denormalized in target table
    if (itemType === "blog") {
      const count = await prisma.like.count({ where: { blogId: itemId } });
      await prisma.blog.update({
        where: { id: itemId },
        data: { likeCount: count },
      });
    } else if (itemType === "photo") {
      const count = await prisma.like.count({ where: { photoId: itemId } });
      await prisma.photo.update({
        where: { id: itemId },
        data: { likeCount: count },
      });
    } else if (itemType === "comment") {
      const count = await prisma.like.count({ where: { commentId: itemId } });
      await prisma.comment.update({
        where: { id: itemId },
        data: { likeCount: count },
      });
    }

    return NextResponse.json({ success: true, liked });
  } catch (error) {
    console.error("Error in likes API route:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
