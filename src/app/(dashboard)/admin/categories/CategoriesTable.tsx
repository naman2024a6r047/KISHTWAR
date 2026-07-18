"use client";

import { useState, useTransition } from "react";
import { MoreHorizontal, Edit, Trash2, AlertCircle } from "lucide-react";
import type { CategoryType, CategoryDTO } from "@/actions/categories.actions";
import { deleteCategory } from "@/actions/categories.actions";
import { format } from "date-fns";

interface CategoriesTableProps {
  type: CategoryType;
  categories: CategoryDTO[];
  onEdit: (category: CategoryDTO) => void;
}

export default function CategoriesTable({ type, categories, onEdit }: CategoriesTableProps) {
  const [isPending, startTransition] = useTransition();
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      startTransition(async () => {
        const res = await deleteCategory(type, id);
        if (res.success) {
          // Success
        } else {
          alert(res.error || "Failed to delete category");
        }
        setOpenDropdownId(null);
      });
    }
  };

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 py-12 text-center">
        <AlertCircle className="w-8 h-8 text-gray-400" />
        <div>
          <p className="text-sm font-semibold text-gray-900">No categories found</p>
          <p className="text-xs text-gray-500 mt-1">Get started by creating a new category.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-kishtwar-green-50/50 border-b border-kishtwar-cream-200">
            <th className="py-3 px-4 text-xs font-semibold tracking-wider text-kishtwar-green-900 uppercase">Name</th>
            <th className="py-3 px-4 text-xs font-semibold tracking-wider text-kishtwar-green-900 uppercase">Slug</th>
            {(type === "blog" || type === "place") && (
              <th className="py-3 px-4 text-xs font-semibold tracking-wider text-kishtwar-green-900 uppercase hidden md:table-cell">Description</th>
            )}
            <th className="py-3 px-4 text-xs font-semibold tracking-wider text-kishtwar-green-900 uppercase">Sort Order</th>
            <th className="py-3 px-4 text-xs font-semibold tracking-wider text-kishtwar-green-900 uppercase hidden sm:table-cell">Created</th>
            <th className="py-3 px-4 text-xs font-semibold tracking-wider text-kishtwar-green-900 uppercase text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-gray-50/50 transition-colors group">
              <td className="py-3 px-4 text-sm font-medium text-gray-900">
                <div className="flex items-center gap-2">
                  {type === "place" && category.icon && (
                    <span className="text-gray-400">{category.icon}</span>
                  )}
                  {category.name}
                </div>
              </td>
              <td className="py-3 px-4 text-sm text-gray-500 font-mono">
                {category.slug}
              </td>
              {(type === "blog" || type === "place") && (
                <td className="py-3 px-4 text-sm text-gray-500 hidden md:table-cell max-w-[200px] truncate">
                  {category.description || "-"}
                </td>
              )}
              <td className="py-3 px-4 text-sm text-gray-500">
                <span className="inline-flex items-center justify-center px-2 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-600">
                  {category.sortOrder}
                </span>
              </td>
              <td className="py-3 px-4 text-sm text-gray-500 hidden sm:table-cell">
                {format(new Date(category.createdAt), "MMM d, yyyy")}
              </td>
              <td className="py-3 px-4 text-right relative">
                <button
                  onClick={() => setOpenDropdownId(openDropdownId === category.id ? null : category.id)}
                  className="p-1.5 text-gray-400 hover:text-kishtwar-green-900 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>

                {openDropdownId === category.id && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setOpenDropdownId(null)} 
                    />
                    <div className="absolute right-6 top-10 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20">
                      <button
                        onClick={() => {
                          onEdit(category);
                          setOpenDropdownId(null);
                        }}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Edit className="w-4 h-4 mr-2 text-gray-400" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        disabled={isPending}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2 text-red-400" />
                        {isPending ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
