import { z } from "zod";

// ─────────────────────────────────────────────
// Auth Validations
// ─────────────────────────────────────────────

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50)
    .regex(
      /^[a-z0-9_-]+$/,
      "Username can only contain lowercase letters, numbers, hyphens, and underscores"
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase, one lowercase, and one number"
    ),
  role: z.enum(["USER", "CONTRIBUTOR"]).default("USER"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase, one lowercase, and one number"
    ),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().max(20).optional(),
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase, one lowercase, and one number"
    ),
});

// ─────────────────────────────────────────────
// Tourist Place Validations
// ─────────────────────────────────────────────

export const createPlaceSchema = z.object({
  name: z.string().min(2, "Name is required").max(200),
  description: z.string().min(50, "Description must be at least 50 characters"),
  shortDescription: z.string().max(500).optional(),
  history: z.string().optional(),
  featuredImage: z.string().min(1, "Featured image is required"),
  gpsLat: z.number().min(-90).max(90).optional(),
  gpsLng: z.number().min(-180).max(180).optional(),
  altitude: z.string().max(50).optional(),
  visitingTime: z.string().max(200).optional(),
  entryFee: z.string().max(200).optional(),
  bestSeason: z.string().max(200).optional(),
  travelTips: z.string().optional(),
  howToReach: z.string().optional(),
  nearbyHotels: z.string().optional(),
  categoryId: z.number().int().positive("Category is required"),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
});

export const placeReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().max(200).optional(),
  content: z.string().max(2000).optional(),
});

// ─────────────────────────────────────────────
// Blog Validations
// ─────────────────────────────────────────────

export const createBlogSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(300),
  content: z.string().min(100, "Content must be at least 100 characters"),
  excerpt: z.string().max(500).optional(),
  featuredImage: z.string().optional(),
  categoryId: z.number().int().positive("Category is required"),
  tags: z.array(z.string()).max(10).optional(),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
});

export const updateBlogSchema = createBlogSchema.partial();

export const autoSaveBlogSchema = z.object({
  content: z.string(),
});

// ─────────────────────────────────────────────
// Comment Validations
// ─────────────────────────────────────────────

export const createCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(2000),
  parentId: z.number().int().positive().optional(),
  blogId: z.number().int().positive().optional(),
  placeId: z.number().int().positive().optional(),
  photoId: z.number().int().positive().optional(),
});

// ─────────────────────────────────────────────
// Event Validations
// ─────────────────────────────────────────────

export const createEventSchema = z.object({
  name: z.string().min(3, "Name is required").max(300),
  description: z.string().min(20, "Description must be at least 20 characters"),
  shortDescription: z.string().max(500).optional(),
  banner: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  startTime: z.string().max(10).optional(),
  location: z.string().max(300).optional(),
  gpsLat: z.number().min(-90).max(90).optional(),
  gpsLng: z.number().min(-180).max(180).optional(),
  registrationLink: z.string().url().optional(),
  categoryId: z.number().int().positive("Category is required"),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
});

// ─────────────────────────────────────────────
// Photo / Gallery Validations
// ─────────────────────────────────────────────

export const uploadPhotoSchema = z.object({
  title: z.string().min(2, "Title is required").max(200),
  caption: z.string().max(1000).optional(),
  categoryId: z.number().int().positive("Category is required"),
});

export const createGallerySchema = z.object({
  name: z.string().min(2, "Name is required").max(200),
  description: z.string().max(1000).optional(),
  photoIds: z.array(z.number().int().positive()),
});

// ─────────────────────────────────────────────
// Video Validations
// ─────────────────────────────────────────────

export const submitVideoSchema = z.object({
  youtubeUrl: z
    .string()
    .url("Invalid URL")
    .regex(
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/,
      "Must be a valid YouTube URL"
    ),
  title: z.string().min(3, "Title is required").max(300),
  description: z.string().max(2000).optional(),
  categoryId: z.number().int().positive("Category is required"),
});

// ─────────────────────────────────────────────
// Contact Validations
// ─────────────────────────────────────────────

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().max(20).optional(),
  subject: z.string().max(300).optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
  recipientId: z.number().int().positive().optional(),
  recipientType: z.enum(["ADMIN", "CONTRIBUTOR"]).default("ADMIN"),
});

// ─────────────────────────────────────────────
// Newsletter Validations
// ─────────────────────────────────────────────

export const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().max(100).optional(),
});

// ─────────────────────────────────────────────
// Report Validations
// ─────────────────────────────────────────────

export const reportSchema = z.object({
  reason: z.enum(["SPAM", "INAPPROPRIATE", "MISLEADING", "COPYRIGHT", "OTHER"]),
  description: z.string().max(1000).optional(),
  referenceId: z.number().int().positive(),
  referenceType: z.enum(["BLOG", "PLACE", "PHOTO", "COMMENT", "VIDEO"]),
});

// ─────────────────────────────────────────────
// Search Validations
// ─────────────────────────────────────────────

export const searchSchema = z.object({
  q: z.string().min(1, "Search query is required").max(200),
  type: z
    .enum(["all", "places", "blogs", "events", "videos", "contributors"])
    .default("all"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
});

// ─────────────────────────────────────────────
// Settings Validations
// ─────────────────────────────────────────────

export const updateSettingSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
});

// ─────────────────────────────────────────────
// Type Exports
// ─────────────────────────────────────────────

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreatePlaceInput = z.infer<typeof createPlaceSchema>;
export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
