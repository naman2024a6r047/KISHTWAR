"use client";

import { useState } from "react";
import { FolderTree, MapPin, BookOpen, Image as ImageIcon, Video, Calendar, Plus } from "lucide-react";
import CategoriesTable from "./CategoriesTable";
import CategoryModal from "./CategoryModal";
import type { CategoryType, CategoryDTO } from "@/actions/categories.actions";
import { cn } from "@/lib/utils";

interface CategoriesClientProps {
  initialData: Record<CategoryType, CategoryDTO[]>;
}

const TABS: { id: CategoryType; label: string; icon: React.ElementType }[] = [
  { id: "place", label: "Places", icon: MapPin },
  { id: "blog", label: "Blogs", icon: BookOpen },
  { id: "photo", label: "Photos", icon: ImageIcon },
  { id: "video", label: "Videos", icon: Video },
  { id: "event", label: "Events", icon: Calendar },
];

export default function CategoriesClient({ initialData }: CategoriesClientProps) {
  const [activeTab, setActiveTab] = useState<CategoryType>("place");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryDTO | null>(null);

  const handleCreate = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: CategoryDTO) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const currentCategories = initialData[activeTab] || [];

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex bg-white/50 backdrop-blur border border-kishtwar-cream-200 p-1 rounded-xl w-full sm:w-auto overflow-x-auto hide-scrollbar">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                  isActive
                    ? "bg-white text-kishtwar-green-900 shadow-sm border border-kishtwar-cream-200"
                    : "text-gray-500 hover:text-kishtwar-green-900 hover:bg-white/30"
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
        
        <button
          onClick={handleCreate}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-kishtwar-green-900 hover:bg-kishtwar-green-950 text-white font-serif font-bold text-xs tracking-wide rounded-xl shadow-sm hover:shadow transition-all shrink-0"
        >
          <Plus className="h-4 w-4 text-kishtwar-gold shrink-0" />
          <span>Add {TABS.find(t => t.id === activeTab)?.label.slice(0, -1)} Category</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-kishtwar-cream-200 shadow-sm overflow-hidden">
        <CategoriesTable 
          type={activeTab} 
          categories={currentCategories} 
          onEdit={handleEdit} 
        />
      </div>

      {/* Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={activeTab}
        category={editingCategory}
      />
    </div>
  );
}
