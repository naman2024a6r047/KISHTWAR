import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { content, parentId, blogId, placeId, photoId } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, error: "Comment content cannot be empty" },
        { status: 400 }
      );
    }

    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        userId: user.id,
        parentId: parentId || null,
        blogId: blogId || null,
        placeId: placeId || null,
        photoId: photoId || null,
      },
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
    });

    // If blogId, placeId, or photoId is set, we increment the commentCount denormalized field on that entity
    if (blogId) {
      await prisma.blog.update({
        where: { id: blogId },
        data: {
          commentCount: {
            increment: 1,
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      comment: {
        ...comment,
        replies: [],
      },
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
