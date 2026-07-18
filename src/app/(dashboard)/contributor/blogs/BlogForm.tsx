"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createBlog, updateBlog } from "@/actions/blogs.actions";
import RichTextEditor from "@/components/common/RichTextEditor";
import { Save, CheckCircle, AlertCircle, Loader2, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

interface BlogFormProps {
  categories: any[];
  initialData?: any;
}

export default function BlogForm({ categories, initialData }: BlogFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [alertMessage, setAlertMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const [title, setTitle] = useState(initialData?.title || "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || (categories[0]?.id || ""));
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [tags, setTags] = useState<string>(
    initialData?.tags?.map((bt: any) => bt.tag.name).join(", ") || ""
  );

  const triggerAlert = (text: string, type: "success" | "error") => {
    setAlertMessage({ text, type });
    setTimeout(() => setAlertMessage(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      triggerAlert("Title and Content are required.", "error");
      return;
    }

    startTransition(async () => {
      try {
        const tagArray = tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t !== "");

        const blogData = {
          title,
          content,
          excerpt: excerpt || undefined,
          featuredImage: featuredImage || undefined,
          categoryId: Number(categoryId),
          tags: tagArray,
        };

        const res = initialData
          ? await updateBlog(initialData.id, blogData)
          : await createBlog(blogData);

        if (res.success) {
          triggerAlert(res.message || "Story saved successfully.", "success");
          setTimeout(() => {
            router.push("/contributor/blogs");
            router.refresh();
          }, 1500);
        } else {
          triggerAlert(res.error || "Failed to save story.", "error");
        }
      } catch (err) {
        triggerAlert("An error occurred while saving the story.", "error");
      }
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Alert banner */}
      {alertMessage && (
        <div
          className={`fixed bottom-4 right-4 z-50 flex items-center space-x-2 px-4 py-3 rounded-2xl border shadow-lg text-sm font-semibold animate-slide-in-up ${
            alertMessage.type === "success"
              ? "bg-emerald-50 border-emerald-100 text-emerald-800"
              : "bg-red-50 border-red-100 text-red-800"
          }`}
        >
          {alertMessage.type === "success" ? (
            <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
          )}
          <span>{alertMessage.text}</span>
        </div>
      )}

      {/* Back button */}
      <div className="flex items-center">
        <Link
          href="/contributor/blogs"
          className="flex items-center text-xs font-serif font-bold text-kishtwar-green-900 hover:text-kishtwar-green-950 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1 shrink-0 text-kishtwar-gold" />
          Back to Stories
        </Link>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-md rounded-2xl border border-kishtwar-cream-200 p-6 shadow-sm space-y-6">
        <h2 className="text-lg font-serif font-bold text-kishtwar-green-950 border-b border-kishtwar-cream-200 pb-3">
          {initialData ? "Edit Story / Blog Post" : "Submit a New Story"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Title input */}
          <div className="md:col-span-2 flex flex-col space-y-1.5">
            <label htmlFor="title" className="text-xs font-bold text-kishtwar-green-950">
              Story Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Exploring the Meadows of Dachhan"
              className="text-sm bg-white border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-4 py-2.5 text-gray-700 focus:ring-1 focus:ring-kishtwar-green-900"
            />
          </div>

          {/* Category selection */}
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="category" className="text-xs font-bold text-kishtwar-green-950">
              Category *
            </label>
            <select
              id="category"
              value={String(categoryId)}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="text-sm bg-white border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-3 py-2.5 text-gray-700 focus:ring-1 focus:ring-kishtwar-green-900 cursor-pointer"
            >
              <option value="" disabled>Select a Category</option>
              {categories && categories.length > 0 ? (
                categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>No categories available</option>
              )}
            </select>
          </div>

          {/* Excerpt */}
          <div className="md:col-span-3 flex flex-col space-y-1.5">
            <label htmlFor="excerpt" className="text-xs font-bold text-kishtwar-green-950">
              Excerpt / Brief Description
            </label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A brief summary shown in lists and preview cards. Leaving this empty will auto-generate one from your content."
              className="text-sm bg-white border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-4 py-2.5 min-h-[70px] text-gray-700 focus:ring-1 focus:ring-kishtwar-green-900"
            />
          </div>

          {/* Featured Image */}
          <div className="md:col-span-2 flex flex-col space-y-1.5">
            <label htmlFor="featuredImage" className="text-xs font-bold text-kishtwar-green-950">
              Featured Image URL
            </label>
            <input
              id="featuredImage"
              type="text"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="Paste a link to your cover photo (Cloudinary, Unsplash, etc.)"
              className="text-sm bg-white border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-4 py-2.5 text-gray-700 focus:ring-1 focus:ring-kishtwar-green-900"
            />
          </div>

          {/* Tags */}
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="tags" className="text-xs font-bold text-kishtwar-green-950">
              Tags (Comma-separated)
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="trekking, adventure, winter"
              className="text-sm bg-white border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-4 py-2.5 text-gray-700 focus:ring-1 focus:ring-kishtwar-green-900"
            />
          </div>
        </div>

        {/* Featured Image Preview */}
        {featuredImage && (
          <div className="mt-2 rounded-xl overflow-hidden border border-kishtwar-cream-250 max-h-48 relative max-w-md bg-gray-50 flex items-center justify-center">
            <img
              src={featuredImage}
              alt="Cover preview"
              className="object-cover h-full w-full"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>
        )}

        {/* Content rich text editor */}
        <div className="flex flex-col space-y-1.5">
          <label className="text-xs font-bold text-kishtwar-green-950">
            Story Content *
          </label>
          <RichTextEditor
            content={content}
            onChange={(html) => setContent(html)}
            placeholder="Tell your story. Include formatting, links, images, or YouTube videos using the toolbar."
          />
        </div>

        {/* Action buttons */}
        <div className="flex justify-end pt-4 border-t border-kishtwar-cream-200 space-x-2">
          <Link
            href="/contributor/blogs"
            className="px-5 py-2.5 text-xs font-serif font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center space-x-1.5 px-5 py-2.5 bg-kishtwar-green-900 hover:bg-kishtwar-green-950 disabled:bg-kishtwar-green-800/80 text-white font-serif font-bold text-xs tracking-wide rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-kishtwar-gold shrink-0" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4 text-kishtwar-gold shrink-0" />
                <span>{initialData ? "Save Changes" : "Submit Story"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
