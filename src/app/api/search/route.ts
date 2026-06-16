import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ContentStatus } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type") || "all";

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        success: true,
        places: [],
        blogs: [],
        events: [],
      });
    }

    const searchQuery = query.trim();

    // Query tourist places matching keyword
    const placesPromise = type === "all" || type === "places"
      ? prisma.touristPlace.findMany({
          where: {
            status: ContentStatus.PUBLISHED,
            OR: [
              { name: { contains: searchQuery } },
              { description: { contains: searchQuery } },
              { shortDescription: { contains: searchQuery } },
            ],
          },
          include: {
            category: { select: { name: true } },
          },
          take: 5,
        })
      : Promise.resolve([]);

    // Query blogs matching keyword
    const blogsPromise = type === "all" || type === "blogs"
      ? prisma.blog.findMany({
          where: {
            status: ContentStatus.PUBLISHED,
            OR: [
              { title: { contains: searchQuery } },
              { content: { contains: searchQuery } },
              { excerpt: { contains: searchQuery } },
            ],
          },
          include: {
            category: { select: { name: true } },
          },
          take: 5,
        })
      : Promise.resolve([]);

    // Query events matching keyword
    const eventsPromise = type === "all" || type === "events"
      ? prisma.event.findMany({
          where: {
            status: ContentStatus.PUBLISHED,
            OR: [
              { name: { contains: searchQuery } },
              { description: { contains: searchQuery } },
              { shortDescription: { contains: searchQuery } },
            ],
          },
          include: {
            category: { select: { name: true } },
          },
          take: 5,
        })
      : Promise.resolve([]);

    const [places, blogs, events] = await Promise.all([
      placesPromise,
      blogsPromise,
      eventsPromise,
    ]);

    // Format output
    const formattedPlaces = places.map((p) => ({
      id: p.id,
      title: p.name,
      slug: p.slug,
      type: "place",
      category: p.category.name,
      description: p.shortDescription || "Discover tourist place details...",
      image: p.featuredImage,
    }));

    const formattedBlogs = blogs.map((b) => ({
      id: b.id,
      title: b.title,
      slug: b.slug,
      type: "blog",
      category: b.category.name,
      description: b.excerpt || "Read travel chronicle post...",
      image: b.featuredImage || undefined,
    }));

    const formattedEvents = events.map((e) => ({
      id: e.id,
      title: e.name,
      slug: e.slug,
      type: "event",
      category: e.category.name,
      description: e.shortDescription || "Join upcoming local activities...",
      image: e.banner || undefined,
    }));

    return NextResponse.json({
      success: true,
      results: [...formattedPlaces, ...formattedBlogs, ...formattedEvents],
    });
  } catch (error) {
    console.error("Global search API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
