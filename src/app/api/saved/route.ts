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

    // Build the query where clause
    const whereClause: any = {
      userId: user.id,
    };

    if (itemType === "blog") {
      whereClause.blogId = itemId;
    } else if (itemType === "place") {
      whereClause.placeId = itemId;
    } else if (itemType === "event") {
      whereClause.eventId = itemId;
    } else {
      return NextResponse.json({ success: false, error: "Invalid itemType" }, { status: 400 });
    }

    // Check if bookmark exists
    const existing = await prisma.savedItem.findFirst({
      where: whereClause,
    });

    if (existing) {
      // Toggle off (remove bookmark)
      await prisma.savedItem.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ success: true, saved: false });
    } else {
      // Toggle on (create bookmark)
      await prisma.savedItem.create({
        data: {
          userId: user.id,
          type: "BOOKMARK",
          ...(itemType === "blog" && { blogId: itemId }),
          ...(itemType === "place" && { placeId: itemId }),
          ...(itemType === "event" && { eventId: itemId }),
        },
      });
      return NextResponse.json({ success: true, saved: true });
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
