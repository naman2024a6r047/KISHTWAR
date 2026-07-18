"use client";

import { useState, useEffect, useTransition } from "react";
import { X } from "lucide-react";
import type { CategoryType, CategoryDTO } from "@/actions/categories.actions";
import { createCategory, updateCategory } from "@/actions/categories.actions";
import { cn } from "@/lib/utils";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: CategoryType;
  category: CategoryDTO | null; // null means create mode
}

export default function CategoryModal({ isOpen, onClose, type, category }: CategoryModalProps) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
    sortOrder: 0,
  });

  // Reset form when modal opens/closes or category changes
  useEffect(() => {
    if (isOpen) {
      if (category) {
        setFormData({
          name: category.name || "",
          slug: category.slug || "",
          description: category.description || "",
          icon: category.icon || "",
          sortOrder: category.sortOrder || 0,
        });
      } else {
        setFormData({
          name: "",
          slug: "",
          description: "",
          icon: "",
          sortOrder: 0,
        });
      }
    }
  }, [isOpen, category]);

  // Auto-generate slug from name if in create mode and user hasn't typed in slug manually
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    if (!category && (!formData.slug || formData.slug === generateSlug(formData.name))) {
      setFormData({ ...formData, name: newName, slug: generateSlug(newName) });
    } else {
      setFormData({ ...formData, name: newName });
    }
  };

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      let res;
      if (category) {
        res = await updateCategory(type, category.id, formData);
      } else {
        res = await createCategory(type, formData);
      }

      if (res.success) {
        onClose();
      } else {
        alert(res.error || "Something went wrong");
      }
    });
  };

  if (!isOpen) return null;

  const showDescription = type === "blog" || type === "place";
  const showIcon = type === "place";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-serif font-bold text-kishtwar-green-950">
            {category ? "Edit Category" : `Add ${type.charAt(0).toUpperCase() + type.slice(1)} Category`}
          </h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-kishtwar-green-900 mb-1.5">
                Category Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={handleNameChange}
                placeholder="e.g. Adventure, Heritage"
                className="w-full px-4 py-2.5 rounded-xl border border-kishtwar-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-kishtwar-green-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-kishtwar-green-900 mb-1.5">
                Slug (URL-friendly)
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. adventure"
                className="w-full px-4 py-2.5 rounded-xl border border-kishtwar-cream-200 text-sm font-mono text-gray-600 focus:outline-none focus:ring-2 focus:ring-kishtwar-green-500"
              />
            </div>

            {showDescription && (
              <div>
                <label className="block text-xs font-semibold text-kishtwar-green-900 mb-1.5">
                  Description <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description about this category..."
                  className="w-full px-4 py-2.5 rounded-xl border border-kishtwar-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-kishtwar-green-500 resize-none"
                />
              </div>
            )}

            {showIcon && (
              <div>
                <label className="block text-xs font-semibold text-kishtwar-green-900 mb-1.5">
                  Icon <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="e.g. MapPin (Lucide icon name)"
                  className="w-full px-4 py-2.5 rounded-xl border border-kishtwar-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-kishtwar-green-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-kishtwar-green-900 mb-1.5">
                Sort Order
              </label>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                className="w-full md:w-1/3 px-4 py-2.5 rounded-xl border border-kishtwar-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-kishtwar-green-500"
              />
              <p className="text-[11px] text-gray-500 mt-1">Lower numbers appear first (e.g. 0, 1, 2)</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className={cn(
                "px-6 py-2.5 text-sm font-bold font-serif tracking-wide text-white bg-kishtwar-green-900 hover:bg-kishtwar-green-950 rounded-xl shadow-sm transition-all",
                isPending && "opacity-70 cursor-not-allowed"
              )}
            >
              {isPending ? "Saving..." : category ? "Save Changes" : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
