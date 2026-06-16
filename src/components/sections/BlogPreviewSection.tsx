import type { BlogWithAuthor } from "@/types";
import BlogCard from "../cards/BlogCard";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

interface BlogPreviewSectionProps {
  blogs: BlogWithAuthor[];
}

export default function BlogPreviewSection({ blogs }: BlogPreviewSectionProps) {
  if (!blogs || blogs.length === 0) return null;

  return (
    <section className="py-20 bg-kishtwar-cream-100 border-y border-kishtwar-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-kishtwar-green-50 text-kishtwar-green-900 border border-kishtwar-green-200/50 text-xs font-bold uppercase tracking-wider">
              <BookOpen className="h-4 w-4 text-kishtwar-gold" />
              <span>Travel Narratives</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-kishtwar-green-900">
              Stories & Guides from the Valley
            </h2>
            <p className="text-base text-gray-500 font-medium">
              Read travel guides, historical articles, and adventure diaries written by our community contributors
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-bold text-kishtwar-emerald hover:text-kishtwar-green-700 transition-colors uppercase tracking-wider gap-1.5 shrink-0"
          >
            <span>View All Stories</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.slice(0, 3).map((blog) => (
            <div key={blog.id}>
              <BlogCard blog={blog} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
