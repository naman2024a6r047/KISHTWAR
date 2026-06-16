import type { UserRole, ContentStatus, MediaStatus } from "@prisma/client";

// ─────────────────────────────────────────────
// User Types
// ─────────────────────────────────────────────

export interface SafeUser {
  id: number;
  email: string;
  name: string;
  username: string;
  avatar: string | null;
  role: UserRole;
  emailVerified: boolean;
  phone: string | null;
  bio: string | null;
  createdAt: Date;
}

export interface ContributorWithProfile extends SafeUser {
  contributorProfile: {
    id: number;
    specialty: string | null;
    website: string | null;
    socialFacebook: string | null;
    socialTwitter: string | null;
    socialInstagram: string | null;
    socialYoutube: string | null;
    verified: boolean;
    totalViews: number;
  } | null;
  _count?: {
    blogs: number;
    photos: number;
    videos: number;
    followers: number;
  };
}

// ─────────────────────────────────────────────
// Tourist Place Types
// ─────────────────────────────────────────────

export interface PlaceWithCategory {
  id: number;
  name: string;
  slug: string;
  shortDescription: string | null;
  featuredImage: string;
  category: { id: number; name: string; slug: string };
  averageRating: number;
  reviewCount: number;
  viewCount: number;
  gpsLat: number | null;
  gpsLng: number | null;
  featured: boolean;
  status: ContentStatus;
}

export interface PlaceDetail extends PlaceWithCategory {
  description: string;
  history: string | null;
  altitude: string | null;
  visitingTime: string | null;
  entryFee: string | null;
  bestSeason: string | null;
  travelTips: string | null;
  howToReach: string | null;
  nearbyHotels: string | null;
  images: {
    id: number;
    url: string;
    publicId: string;
    caption: string | null;
    sortOrder: number;
  }[];
  contributor: {
    id: number;
    name: string;
    username: string;
    avatar: string | null;
  };
  reviews: PlaceReviewWithUser[];
  metaTitle: string | null;
  metaDescription: string | null;
  publishedAt: Date | null;
  createdAt: Date;
}

export interface PlaceReviewWithUser {
  id: number;
  rating: number;
  title: string | null;
  content: string | null;
  createdAt: Date;
  user: {
    id: number;
    name: string;
    avatar: string | null;
  };
}

// ─────────────────────────────────────────────
// Blog Types
// ─────────────────────────────────────────────

export interface BlogWithAuthor {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage: string | null;
  readingTime: number | null;
  category: { id: number; name: string; slug: string };
  author: {
    id: number;
    name: string;
    username: string;
    avatar: string | null;
  };
  viewCount: number;
  likeCount: number;
  commentCount: number;
  featured: boolean;
  status: ContentStatus;
  publishedAt: Date | null;
  createdAt: Date;
}

export interface BlogDetail extends BlogWithAuthor {
  content: string;
  tags: { tag: { id: number; name: string; slug: string } }[];
  metaTitle: string | null;
  metaDescription: string | null;
  autoSaveContent: string | null;
  autoSaveAt: Date | null;
}

// ─────────────────────────────────────────────
// Media Types
// ─────────────────────────────────────────────

export interface PhotoWithCategory {
  id: number;
  url: string;
  thumbnailUrl: string | null;
  title: string;
  caption: string | null;
  category: { id: number; name: string; slug: string };
  contributor: { id: number; name: string; username: string; avatar: string | null };
  likeCount: number;
  downloadCount: number;
  featured: boolean;
  width: number | null;
  height: number | null;
}

export interface VideoWithCategory {
  id: number;
  youtubeUrl: string;
  youtubeId: string;
  thumbnail: string | null;
  title: string;
  description: string | null;
  category: { id: number; name: string; slug: string };
  contributor: { id: number; name: string; username: string; avatar: string | null };
  featured: boolean;
  viewCount: number;
}

// ─────────────────────────────────────────────
// Event Types
// ─────────────────────────────────────────────

export interface EventWithCategory {
  id: number;
  name: string;
  slug: string;
  banner: string | null;
  shortDescription: string | null;
  startDate: Date;
  endDate: Date | null;
  location: string | null;
  category: { id: number; name: string; slug: string };
  featured: boolean;
  status: ContentStatus;
}

export interface EventDetail extends EventWithCategory {
  description: string;
  startTime: string | null;
  gpsLat: number | null;
  gpsLng: number | null;
  registrationLink: string | null;
  contributor: { id: number; name: string; username: string; avatar: string | null };
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: Date;
}

// ─────────────────────────────────────────────
// Comment Types
// ─────────────────────────────────────────────

export interface CommentWithUser {
  id: number;
  content: string;
  userId: number;
  parentId: number | null;
  likeCount: number;
  isEdited: boolean;
  createdAt: Date;
  user: {
    id: number;
    name: string;
    username: string;
    avatar: string | null;
  };
  replies?: CommentWithUser[];
  _count?: { replies: number };
}

// ─────────────────────────────────────────────
// Homepage Types
// ─────────────────────────────────────────────

export interface HomepageSectionData {
  id: number;
  sectionKey: string;
  title: string | null;
  subtitle: string | null;
  isVisible: boolean;
  sortOrder: number;
  config: Record<string, unknown> | null;
}

export interface HeroSlideData {
  id: number;
  title: string;
  subtitle: string | null;
  backgroundImage: string;
  backgroundVideoUrl: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  ctaSecondaryText: string | null;
  ctaSecondaryLink: string | null;
  sortOrder: number;
  isActive: boolean;
}

// ─────────────────────────────────────────────
// API Response Types
// ─────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// ─────────────────────────────────────────────
// Dashboard Stats Types
// ─────────────────────────────────────────────

export interface AdminDashboardStats {
  totalUsers: number;
  totalContributors: number;
  totalPlaces: number;
  totalBlogs: number;
  totalEvents: number;
  totalVideos: number;
  totalPhotos: number;
  totalComments: number;
  pendingApprovals: number;
  totalPageViews: number;
  recentActivity: ActivityLogEntry[];
}

export interface ContributorDashboardStats {
  totalBlogs: number;
  totalPlaces: number;
  totalPhotos: number;
  totalVideos: number;
  totalViews: number;
  totalLikes: number;
  totalFollowers: number;
  recentActivity: ActivityLogEntry[];
}

export interface ActivityLogEntry {
  id: number;
  action: string;
  entityType: string | null;
  entityId: number | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  user?: { name: string; avatar: string | null } | null;
}

// ─────────────────────────────────────────────
// Map Types
// ─────────────────────────────────────────────

export interface MapMarker {
  id: number;
  name: string;
  slug: string;
  type: "place" | "hotel" | "hospital" | "restaurant" | "petrol" | "police" | "atm";
  lat: number;
  lng: number;
  description?: string;
  image?: string;
}

// ─────────────────────────────────────────────
// Re-export Prisma enums for client-side use
// ─────────────────────────────────────────────

export type { UserRole, ContentStatus, MediaStatus };
