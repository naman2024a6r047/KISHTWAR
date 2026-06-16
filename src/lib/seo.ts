import { Metadata } from "next";

// ─────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Kishtwar Tourism";
const DEFAULT_DESCRIPTION =
  "Discover Kishtwar – Land of Sapphire, Saffron & Shrines. Explore breathtaking valleys, ancient temples, adventure trails, and rich cultural heritage in the crown of Jammu & Kashmir.";
const DEFAULT_OG_IMAGE = `${APP_URL}/images/og-default.jpg`;

// ─────────────────────────────────────────────
// Metadata Builder
// ─────────────────────────────────────────────

interface SEOProps {
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  canonicalUrl?: string;
  noIndex?: boolean;
  keywords?: string[];
  publishedAt?: string;
  updatedAt?: string;
  author?: string;
}

export function buildMetadata({
  title,
  description,
  ogImage,
  ogType = "website",
  canonicalUrl,
  noIndex = false,
  keywords,
  publishedAt,
  updatedAt,
  author,
}: SEOProps): Metadata {
  const fullTitle = title ? `${title} | ${APP_NAME}` : `${APP_NAME} – Land of Sapphire, Saffron & Shrines`;
  const desc = description || DEFAULT_DESCRIPTION;
  const image = ogImage || DEFAULT_OG_IMAGE;
  const canonical = canonicalUrl || APP_URL;

  const metadata: Metadata = {
    title: fullTitle,
    description: desc,
    keywords: keywords || [
      "Kishtwar",
      "tourism",
      "Jammu Kashmir",
      "Sapphire",
      "Saffron",
      "Warwan Valley",
      "Machail Yatra",
      "travel",
      "trekking",
      "adventure",
      "heritage",
    ],
    authors: author ? [{ name: author }] : [{ name: APP_NAME }],
    creator: APP_NAME,
    publisher: APP_NAME,
    openGraph: {
      title: fullTitle,
      description: desc,
      url: canonical,
      siteName: APP_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title || APP_NAME,
        },
      ],
      type: ogType,
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [image],
    },
    alternates: {
      canonical,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };

  // Add article-specific OpenGraph properties
  if (ogType === "article" && metadata.openGraph) {
    const og = metadata.openGraph as Record<string, unknown>;
    if (publishedAt) og.publishedTime = publishedAt;
    if (updatedAt) og.modifiedTime = updatedAt;
    if (author) og.authors = [author];
  }

  return metadata;
}

// ─────────────────────────────────────────────
// JSON-LD Structured Data Builders
// ─────────────────────────────────────────────

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: APP_NAME,
    url: APP_URL,
    description: DEFAULT_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: `${APP_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: APP_NAME,
    url: APP_URL,
    logo: `${APP_URL}/images/logo.svg`,
    description: DEFAULT_DESCRIPTION,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kishtwar",
      addressRegion: "Jammu & Kashmir",
      addressCountry: "IN",
    },
    sameAs: [],
  };
}

export function buildTouristAttractionJsonLd(place: {
  name: string;
  description: string;
  slug: string;
  featuredImage: string;
  gpsLat?: number | null;
  gpsLng?: number | null;
  averageRating?: number;
  reviewCount?: number;
}) {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: place.name,
    description: place.description.replace(/<[^>]*>/g, "").slice(0, 300),
    url: `${APP_URL}/tourist-places/${place.slug}`,
    image: place.featuredImage,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kishtwar",
      addressRegion: "Jammu & Kashmir",
      addressCountry: "IN",
    },
  };

  if (place.gpsLat && place.gpsLng) {
    jsonLd.geo = {
      "@type": "GeoCoordinates",
      latitude: place.gpsLat,
      longitude: place.gpsLng,
    };
  }

  if (place.averageRating && place.reviewCount && place.reviewCount > 0) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: place.averageRating,
      reviewCount: place.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return jsonLd;
}

export function buildArticleJsonLd(blog: {
  title: string;
  excerpt?: string | null;
  slug: string;
  featuredImage?: string | null;
  authorName: string;
  publishedAt?: string | null;
  updatedAt?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description: blog.excerpt || "",
    url: `${APP_URL}/blog/${blog.slug}`,
    image: blog.featuredImage || DEFAULT_OG_IMAGE,
    author: {
      "@type": "Person",
      name: blog.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: APP_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${APP_URL}/images/logo.svg`,
      },
    },
    datePublished: blog.publishedAt,
    dateModified: blog.updatedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${APP_URL}/blog/${blog.slug}`,
    },
  };
}

export function buildEventJsonLd(event: {
  name: string;
  description: string;
  slug: string;
  banner?: string | null;
  startDate: string;
  endDate?: string | null;
  location?: string | null;
  registrationLink?: string | null;
}) {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description: event.description.replace(/<[^>]*>/g, "").slice(0, 300),
    url: `${APP_URL}/events/${event.slug}`,
    image: event.banner || DEFAULT_OG_IMAGE,
    startDate: event.startDate,
    endDate: event.endDate || event.startDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.location || "Kishtwar",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kishtwar",
        addressRegion: "Jammu & Kashmir",
        addressCountry: "IN",
      },
    },
    organizer: {
      "@type": "Organization",
      name: APP_NAME,
      url: APP_URL,
    },
  };

  if (event.registrationLink) {
    jsonLd.offers = {
      "@type": "Offer",
      url: event.registrationLink,
      availability: "https://schema.org/InStock",
    };
  }

  return jsonLd;
}

export function buildBreadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${APP_URL}${item.url}`,
    })),
  };
}
