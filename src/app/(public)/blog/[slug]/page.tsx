import { getBlogBySlug, getBlogLikeStatus, getBlogSavedStatus } from "@/actions/blogs.actions";
import { prisma } from "@/lib/prisma";
import RichTextRenderer from "@/components/common/RichTextRenderer";
import CommentSection from "@/components/common/CommentSection";
import LikeButton from "@/components/common/LikeButton";
import BookmarkButton from "@/components/common/BookmarkButton";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { notFound } from "next/navigation";
import { Clock, Eye, Calendar, User, Tag, Share2 } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const blog = await getBlogBySlug(resolvedParams.slug);

  if (!blog) {
    return {
      title: "Story Not Found | Kishtwar Tourism",
    };
  }

  return {
    title: `${blog.title} | Kishtwar Travel Stories`,
    description:
      blog.metaDescription ||
      blog.excerpt ||
      `Read the article "${blog.title}" contributed by ${blog.author.name} on Kishtwar Heritage Portal.`,
    openGraph: {
      title: `${blog.title} | Kishtwar Travel Stories`,
      description:
        blog.metaDescription ||
        blog.excerpt ||
        `Read the article "${blog.title}" contributed by ${blog.author.name} on Kishtwar Heritage Portal.`,
      images: blog.featuredImage ? [blog.featuredImage] : undefined,
      type: "article",
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const blog = await getBlogBySlug(resolvedParams.slug);

  if (!blog) {
    notFound();
  }

  // Fetch initial liked & saved state for the current user
  const [initialLiked, initialSaved] = await Promise.all([
    getBlogLikeStatus(blog.id),
    getBlogSavedStatus(blog.id),
  ]);

  // Fetch comments with nested replies structure matching CommentWithUser
  const comments = await prisma.comment.findMany({
    where: {
      blogId: blog.id,
      parentId: null, // Top-level comments
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
      replies: {
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
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Fetch author details including contributor profile info and user bio
  const authorUser = await prisma.user.findUnique({
    where: { id: blog.author.id },
    select: {
      bio: true,
      contributorProfile: {
        select: {
          specialty: true,
          website: true,
        },
      },
    },
  });

  return (
    <main className="min-h-screen bg-kishtwar-cream/20 pb-16">
      {/* Immersive Header / Cover Image */}
      {blog.featuredImage && (
        <section className="relative h-[40vh] sm:h-[50vh] w-full overflow-hidden bg-kishtwar-green-950">
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="absolute inset-0 h-full w-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-kishtwar-green-950 via-kishtwar-green-950/40 to-black/30"></div>
        </section>
      )}

      {/* Main Content Layout */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-6 space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumbs className="text-kishtwar-green-600" />

        {/* Article Wrapper Card */}
        <article className="bg-white rounded-3xl border border-kishtwar-cream-200 p-6 sm:p-10 shadow-sm space-y-6">
          {/* Category Badge & Actions */}
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-kishtwar-green-100 text-kishtwar-green-700 text-xs font-bold uppercase tracking-wider">
              {blog.category.name}
            </span>
            <div className="flex items-center space-x-2">
              <BookmarkButton
                initialSaved={initialSaved}
                itemId={blog.id}
                itemType="blog"
                size="md"
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-kishtwar-green-950 leading-tight">
            {blog.title}
          </h1>

          {/* Meta Information Bar */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pb-6 border-b border-kishtwar-cream-100">
            <div className="flex items-center space-x-1.5 font-bold text-kishtwar-green-900">
              <User className="h-4 w-4 text-kishtwar-gold" />
              <Link href={`/contributors/${blog.author.username}`} className="hover:underline">
                {blog.author.name}
              </Link>
            </div>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>
                {blog.publishedAt
                  ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : new Date(blog.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
              </span>
            </div>
            {blog.readingTime && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{blog.readingTime} min read</span>
                </div>
              </>
            )}
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{blog.viewCount} views</span>
            </div>
          </div>

          {/* Rich text post content */}
          <RichTextRenderer content={blog.content} className="pt-2" />

          {/* Tags list */}
          {blog.tags.length > 0 && (
            <div className="pt-6 border-t border-kishtwar-cream-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-kishtwar-green-800 flex items-center space-x-1">
                <Tag className="h-3.5 w-3.5" />
                <span>Tags:</span>
              </span>
              {blog.tags.map((bt) => (
                <span
                  key={bt.tag.id}
                  className="px-2.5 py-1 rounded-lg bg-kishtwar-cream/55 text-kishtwar-green-700 text-xs font-semibold border border-kishtwar-cream-200"
                >
                  {bt.tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Footer Interactions Bar */}
          <div className="pt-6 mt-6 border-t border-kishtwar-cream-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <LikeButton
                initialLiked={initialLiked}
                initialLikeCount={blog.likeCount}
                itemId={blog.id}
                itemType="blog"
                size="md"
              />
            </div>
            
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: blog.title,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }
              }}
              className="flex items-center space-x-1.5 text-xs font-semibold text-gray-500 hover:text-kishtwar-green-700 transition-colors p-2 rounded-lg hover:bg-gray-50"
            >
              <Share2 className="h-4 w-4" />
              <span>Share Story</span>
            </button>
          </div>
        </article>

        {/* Author Bio Card */}
        <div className="bg-white rounded-3xl border border-kishtwar-cream-200 p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <img
            src={blog.author.avatar || "/images/placeholders/avatar.jpg"}
            alt={blog.author.name}
            className="h-16 w-16 rounded-full border border-kishtwar-gold object-cover shrink-0"
          />
          <div className="space-y-2 text-center sm:text-left min-w-0 flex-1">
            <div>
              <span className="text-[10px] text-kishtwar-gold font-bold uppercase tracking-widest block leading-none mb-1">
                Author
              </span>
              <Link
                href={`/contributors/${blog.author.username}`}
                className="text-lg font-serif font-bold text-kishtwar-green-950 hover:underline"
              >
                {blog.author.name}
              </Link>
              {authorUser?.contributorProfile?.specialty && (
                <span className="text-xs text-gray-400 block sm:inline sm:ml-2 font-medium">
                  ({authorUser.contributorProfile.specialty})
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600 leading-relaxed font-light">
              {authorUser?.bio ||
                "Contributor to Kishtwar Tourism & Heritage Portal. Sharing authentic stories about the valleys, shrines, and communities of Kishtwar."}
            </p>
            {authorUser?.contributorProfile?.website && (
              <a
                href={authorUser.contributorProfile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs font-bold text-kishtwar-emerald hover:underline"
              >
                Visit Author Website
              </a>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-3xl border border-kishtwar-cream-200 p-6 sm:p-8 shadow-sm">
          <CommentSection
            initialComments={comments}
            itemId={blog.id}
            itemType="blog"
          />
        </div>
      </div>
    </main>
  );
}
