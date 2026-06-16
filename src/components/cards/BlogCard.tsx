import Link from "next/link";
import { Clock, Heart, MessageSquare, Eye } from "lucide-react";
import type { BlogWithAuthor } from "@/types";
import { formatDistanceToNow } from "date-fns";
import BookmarkButton from "../common/BookmarkButton";

interface BlogCardProps {
  blog: BlogWithAuthor;
  saved?: boolean;
}

export default function BlogCard({ blog, saved = false }: BlogCardProps) {
  const timeAgo = blog.publishedAt 
    ? formatDistanceToNow(new Date(blog.publishedAt), { addSuffix: true }) 
    : formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true });

  return (
    <div className="group rounded-2xl overflow-hidden border border-kishtwar-cream-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full card-hover">
      {/* Image Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        <img
          src={blog.featuredImage || "/images/placeholders/blog.jpg"}
          alt={blog.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Category Badge */}
        <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full bg-kishtwar-green-900/80 backdrop-blur-sm text-kishtwar-gold border border-kishtwar-green-800/40 uppercase tracking-wider">
          {blog.category.name}
        </span>

        {/* Bookmark Action */}
        <div className="absolute top-3 right-3">
          <BookmarkButton
            initialSaved={saved}
            itemId={blog.id}
            itemType="blog"
            size="sm"
          />
        </div>

        {/* Reading Time */}
        {blog.readingTime && (
          <div className="absolute bottom-3 left-3 flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white border border-white/10 text-xs">
            <Clock className="h-3.5 w-3.5 text-kishtwar-gold shrink-0" />
            <span>{blog.readingTime} min read</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          <Link href={`/blog/${blog.slug}`}>
            <h3 className="text-lg font-serif font-bold text-kishtwar-green-900 hover:text-kishtwar-gold transition-colors line-clamp-2 leading-snug">
              {blog.title}
            </h3>
          </Link>
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {blog.excerpt || "Read this interesting story shared by a traveler about their experiences in Kishtwar."}
          </p>
        </div>

        {/* Author Details and Stats */}
        <div className="mt-5 pt-4 border-t border-kishtwar-cream-100 space-y-4">
          <div className="flex items-center gap-3">
            {blog.author.avatar ? (
              <img
                src={blog.author.avatar}
                alt={blog.author.name}
                className="h-8 w-8 rounded-full object-cover border border-kishtwar-gold"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-kishtwar-green-600 border border-kishtwar-gold flex items-center justify-center text-white text-xs font-bold shrink-0">
                {blog.author.name.charAt(0)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <Link href={`/contributors/${blog.author.username}`} className="text-xs font-bold text-kishtwar-green-900 hover:text-kishtwar-gold truncate block">
                {blog.author.name}
              </Link>
              <span className="text-[10px] text-gray-400 block">{timeAgo}</span>
            </div>
          </div>

          {/* Social Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1" title="Likes">
                <Heart className="h-4 w-4 text-red-500 fill-red-500/20 shrink-0" />
                <span className="font-semibold">{blog.likeCount}</span>
              </span>
              <span className="flex items-center space-x-1" title="Comments">
                <MessageSquare className="h-4 w-4 text-kishtwar-emerald shrink-0" />
                <span className="font-semibold">{blog.commentCount}</span>
              </span>
            </div>

            <span className="flex items-center space-x-1 text-gray-400" title="Views">
              <Eye className="h-4 w-4 shrink-0" />
              <span>{blog.viewCount}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
