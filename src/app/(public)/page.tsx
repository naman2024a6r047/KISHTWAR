import { prisma } from "@/lib/prisma";
import type { HeroSlideData } from "@/types";

// Import sections
import HeroSection from "@/components/sections/HeroSection";
import QuickNavSection from "@/components/sections/QuickNavSection";
import ExploreSection from "@/components/sections/ExploreSection";
import StatsSection from "@/components/sections/StatsSection";
import GalleryPreviewSection from "@/components/sections/GalleryPreviewSection";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  let dbSlides: any[] = [];
  try {
    dbSlides = await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.warn("Failed to fetch hero slides at build/render time (this is normal if database is unreachable in the build container):", error);
  }
  
  const slides: HeroSlideData[] = dbSlides.map(slide => ({
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
    isActive: slide.isActive
  }));

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with slide backgrounds, left statistics overlay and right SVG map */}
      <HeroSection slides={slides} />
      
      {/* Quick Navigation Strip (6 cream columns) */}
      <QuickNavSection />
      
      {/* Combined 3-Column main content grid */}
      <ExploreSection />
      
      {/* Dark green metrics ribbon */}
      <StatsSection />
      
      {/* Horizontal visual gallery */}
      <GalleryPreviewSection />
    </div>
  );
}
