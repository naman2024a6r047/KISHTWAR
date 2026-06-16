"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  updateHomepageSection,
  reorderHomepageSections,
} from "@/actions/homepage.actions";
import {
  Sparkles,
  CheckCircle,
  AlertCircle,
  Loader2,
  Layers,
  Image as ImageIcon,
  Plus,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Trash2,
  Edit,
  Save,
  Film,
  Link as LinkIcon
} from "lucide-react";

interface HeroSlide {
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

interface HomepageSection {
  id: number;
  sectionKey: string;
  title: string | null;
  subtitle: string | null;
  isVisible: boolean;
  sortOrder: number;
  config: any;
}

interface HomepageManagerProps {
  initialSlides: HeroSlide[];
  initialSections: HomepageSection[];
}

export default function HomepageManager({ initialSlides, initialSections }: HomepageManagerProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"slides" | "sections">("slides");
  const [isPending, startTransition] = useTransition();
  const [alertMessage, setAlertMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Slides State
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides);
  const [showSlideForm, setShowSlideForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  
  // Slide Form Fields
  const [slideTitle, setSlideTitle] = useState("");
  const [slideSubtitle, setSlideSubtitle] = useState("");
  const [slideBgImage, setSlideBgImage] = useState("");
  const [slideBgVideo, setSlideBgVideo] = useState("");
  const [slideCtaText, setSlideCtaText] = useState("");
  const [slideCtaLink, setSlideCtaLink] = useState("");
  const [slideCtaSecText, setSlideCtaSecText] = useState("");
  const [slideCtaSecLink, setSlideCtaSecLink] = useState("");
  const [slideActive, setSlideActive] = useState(true);

  // Sections State
  const [sections, setSections] = useState<HomepageSection[]>(initialSections);

  const triggerAlert = (text: string, type: "success" | "error") => {
    setAlertMessage({ text, type });
    setTimeout(() => setAlertMessage(null), 4000);
  };

  const resetSlideForm = () => {
    setSlideTitle("");
    setSlideSubtitle("");
    setSlideBgImage("");
    setSlideBgVideo("");
    setSlideCtaText("");
    setSlideCtaLink("");
    setSlideCtaSecText("");
    setSlideCtaSecLink("");
    setSlideActive(true);
    setEditingSlide(null);
    setShowSlideForm(false);
  };

  const handleEditSlideClick = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setSlideTitle(slide.title);
    setSlideSubtitle(slide.subtitle || "");
    setSlideBgImage(slide.backgroundImage);
    setSlideBgVideo(slide.backgroundVideoUrl || "");
    setSlideCtaText(slide.ctaText || "");
    setSlideCtaLink(slide.ctaLink || "");
    setSlideCtaSecText(slide.ctaSecondaryText || "");
    setSlideCtaSecLink(slide.ctaSecondaryLink || "");
    setSlideActive(slide.isActive);
    setShowSlideForm(true);
  };

  // ──── SLIDES ACTIONS ────

  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideTitle || !slideBgImage) {
      triggerAlert("Title and Background Image URL are required.", "error");
      return;
    }

    startTransition(async () => {
      try {
        const slideData = {
          title: slideTitle,
          subtitle: slideSubtitle || null,
          backgroundImage: slideBgImage,
          backgroundVideoUrl: slideBgVideo || null,
          ctaText: slideCtaText || null,
          ctaLink: slideCtaLink || null,
          ctaSecondaryText: slideCtaSecText || null,
          ctaSecondaryLink: slideCtaSecLink || null,
          isActive: slideActive,
          sortOrder: editingSlide ? editingSlide.sortOrder : slides.length + 1,
        };

        let res;
        if (editingSlide) {
          res = await updateHeroSlide(editingSlide.id, slideData);
        } else {
          res = await createHeroSlide(slideData);
        }

        if (res.success) {
          triggerAlert(res.message || "Hero slide saved successfully.", "success");
          resetSlideForm();
          // Fetch updated slides
          router.refresh();
          // Locally update state (trigger router refresh usually handles this, but a manual reload of data is safer)
          window.location.reload();
        } else {
          triggerAlert(res.error || "Failed to save slide.", "error");
        }
      } catch (err) {
        triggerAlert("An error occurred while saving the slide.", "error");
      }
    });
  };

  const handleToggleSlideActive = async (slideId: number, currentActive: boolean) => {
    startTransition(async () => {
      try {
        const res = await updateHeroSlide(slideId, { isActive: !currentActive });
        if (res.success) {
          setSlides((prev) =>
            prev.map((s) => (s.id === slideId ? { ...s, isActive: !currentActive } : s))
          );
          triggerAlert("Slide status updated.", "success");
          router.refresh();
        } else {
          triggerAlert(res.error || "Failed to update status.", "error");
        }
      } catch (err) {
        triggerAlert("An error occurred.", "error");
      }
    });
  };

  const handleDeleteSlide = async (slideId: number, title: string) => {
    if (!confirm(`Are you sure you want to delete slide "${title}"?`)) return;

    startTransition(async () => {
      try {
        const res = await deleteHeroSlide(slideId);
        if (res.success) {
          setSlides((prev) => prev.filter((s) => s.id !== slideId));
          triggerAlert("Slide deleted successfully.", "success");
          router.refresh();
        } else {
          triggerAlert(res.error || "Failed to delete slide.", "error");
        }
      } catch (err) {
        triggerAlert("An error occurred.", "error");
      }
    });
  };

  // ──── SECTIONS ACTIONS ────

  const handleToggleSectionVisible = async (sectionId: number, currentVisible: boolean) => {
    startTransition(async () => {
      try {
        const res = await updateHomepageSection(sectionId, { isVisible: !currentVisible });
        if (res.success) {
          setSections((prev) =>
            prev.map((s) => (s.id === sectionId ? { ...s, isVisible: !currentVisible } : s))
          );
          triggerAlert("Section visibility updated.", "success");
          router.refresh();
        } else {
          triggerAlert(res.error || "Failed to update section.", "error");
        }
      } catch (err) {
        triggerAlert("An error occurred.", "error");
      }
    });
  };

  const handleMoveSection = async (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;

    // Set local state
    setSections(updated);

    startTransition(async () => {
      try {
        const orderedIds = updated.map((s) => s.id);
        const res = await reorderHomepageSections(orderedIds);
        if (res.success) {
          triggerAlert("Section order saved successfully.", "success");
          router.refresh();
        } else {
          triggerAlert(res.error || "Failed to save layout order.", "error");
        }
      } catch (err) {
        triggerAlert("An error occurred while saving reorder.", "error");
      }
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
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

      {/* Tabs headers */}
      <div className="flex justify-between items-center border-b border-kishtwar-cream-200 pb-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab("slides")}
            className={`flex items-center px-4 py-2 text-xs sm:text-sm font-serif font-bold tracking-wide rounded-xl border transition-all cursor-pointer ${
              activeTab === "slides"
                ? "bg-kishtwar-green-900 text-white border-kishtwar-green-950 shadow-sm"
                : "bg-white text-kishtwar-green-900 border-kishtwar-cream-250 hover:bg-kishtwar-cream/30"
            }`}
          >
            <ImageIcon className="h-4 w-4 mr-1.5" />
            <span>Hero Carousel Slides</span>
          </button>
          <button
            onClick={() => setActiveTab("sections")}
            className={`flex items-center px-4 py-2 text-xs sm:text-sm font-serif font-bold tracking-wide rounded-xl border transition-all cursor-pointer ${
              activeTab === "sections"
                ? "bg-kishtwar-green-900 text-white border-kishtwar-green-950 shadow-sm"
                : "bg-white text-kishtwar-green-900 border-kishtwar-cream-250 hover:bg-kishtwar-cream/30"
            }`}
          >
            <Layers className="h-4 w-4 mr-1.5" />
            <span>Homepage Layout</span>
          </button>
        </div>

        {activeTab === "slides" && !showSlideForm && (
          <button
            onClick={() => setShowSlideForm(true)}
            className="flex items-center space-x-1 px-4 py-2.5 bg-kishtwar-green-900 hover:bg-kishtwar-green-950 text-white rounded-xl text-xs font-serif font-bold tracking-wide transition-all shadow-sm cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 text-kishtwar-gold shrink-0" />
            <span>Add Slide</span>
          </button>
        )}
      </div>

      {/* ──── TAB 1: HERO SLIDES ──── */}
      {activeTab === "slides" && (
        <div className="space-y-6">
          {showSlideForm ? (
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-kishtwar-cream-200 p-6 shadow-sm">
              <h2 className="text-lg font-serif font-bold text-kishtwar-green-950 border-b border-kishtwar-cream-200 pb-3 mb-4">
                {editingSlide ? "Edit Carousel Slide" : "Create New Carousel Slide"}
              </h2>

              <form onSubmit={handleSaveSlide} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-bold text-kishtwar-green-900">Slide Title *</label>
                  <input
                    type="text"
                    value={slideTitle}
                    onChange={(e) => setSlideTitle(e.target.value)}
                    required
                    placeholder="e.g. Welcome to Kishtwar Town"
                    className="text-sm bg-white border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-4 py-2 text-gray-750 focus:ring-1 focus:ring-kishtwar-green-900"
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-bold text-kishtwar-green-900">Subtitle</label>
                  <input
                    type="text"
                    value={slideSubtitle}
                    onChange={(e) => setSlideSubtitle(e.target.value)}
                    placeholder="e.g. Discover valleys, shrines and saffron gardens"
                    className="text-sm bg-white border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-4 py-2 text-gray-750 focus:ring-1 focus:ring-kishtwar-green-900"
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-bold text-kishtwar-green-900">Background Image URL *</label>
                  <input
                    type="text"
                    value={slideBgImage}
                    onChange={(e) => setSlideBgImage(e.target.value)}
                    required
                    placeholder="Cloudinary or Unsplash image URL"
                    className="text-sm bg-white border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-4 py-2 text-gray-750 focus:ring-1 focus:ring-kishtwar-green-900"
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-bold text-kishtwar-green-900">Background Video URL (Optional)</label>
                  <input
                    type="text"
                    value={slideBgVideo}
                    onChange={(e) => setSlideBgVideo(e.target.value)}
                    placeholder="Link to background loop video (.mp4)"
                    className="text-sm bg-white border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-4 py-2 text-gray-750 focus:ring-1 focus:ring-kishtwar-green-900"
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-bold text-kishtwar-green-900">Primary CTA Button Text</label>
                  <input
                    type="text"
                    value={slideCtaText}
                    onChange={(e) => setSlideCtaText(e.target.value)}
                    placeholder="e.g. Explore Now"
                    className="text-sm bg-white border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-4 py-2 text-gray-750 focus:ring-1 focus:ring-kishtwar-green-900"
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-bold text-kishtwar-green-900">Primary CTA Target Link</label>
                  <input
                    type="text"
                    value={slideCtaLink}
                    onChange={(e) => setSlideCtaLink(e.target.value)}
                    placeholder="e.g. /tourist-places"
                    className="text-sm bg-white border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-4 py-2 text-gray-750 focus:ring-1 focus:ring-kishtwar-green-900"
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-bold text-kishtwar-green-900">Secondary CTA Button Text</label>
                  <input
                    type="text"
                    value={slideCtaSecText}
                    onChange={(e) => setSlideCtaSecText(e.target.value)}
                    placeholder="e.g. Tour Guide"
                    className="text-sm bg-white border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-4 py-2 text-gray-750 focus:ring-1 focus:ring-kishtwar-green-900"
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-bold text-kishtwar-green-900">Secondary CTA Target Link</label>
                  <input
                    type="text"
                    value={slideCtaSecLink}
                    onChange={(e) => setSlideCtaSecLink(e.target.value)}
                    placeholder="e.g. /about"
                    className="text-sm bg-white border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-4 py-2 text-gray-750 focus:ring-1 focus:ring-kishtwar-green-900"
                  />
                </div>

                <div className="flex items-center space-x-2 py-2">
                  <input
                    id="slideActive"
                    type="checkbox"
                    checked={slideActive}
                    onChange={(e) => setSlideActive(e.target.checked)}
                    className="h-4 w-4 rounded border-kishtwar-cream-300 text-kishtwar-green-900 focus:ring-kishtwar-green-500 cursor-pointer"
                  />
                  <label htmlFor="slideActive" className="text-xs font-bold text-kishtwar-green-900 cursor-pointer">
                    Enable and make this slide visible
                  </label>
                </div>

                <div className="flex justify-end space-x-2 md:col-span-2 pt-4 border-t border-kishtwar-cream-200">
                  <button
                    type="button"
                    onClick={resetSlideForm}
                    className="px-4 py-2 text-xs font-serif font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center space-x-1.5 px-5 py-2.5 bg-kishtwar-green-900 hover:bg-kishtwar-green-950 disabled:bg-kishtwar-green-800 text-white font-serif font-bold text-xs tracking-wide rounded-xl transition-all cursor-pointer"
                  >
                    {isPending ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Save className="h-3.5 w-3.5 text-kishtwar-gold shrink-0" />
                    )}
                    <span>Save Slide</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {slides.map((slide) => (
                <div
                  key={slide.id}
                  className="bg-white/80 backdrop-blur-md rounded-2xl border border-kishtwar-cream-200 overflow-hidden shadow-sm flex flex-col"
                >
                  <div className="h-44 relative bg-gray-100">
                    <img
                      src={slide.backgroundImage}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                      <span className="text-[10px] text-kishtwar-gold font-bold uppercase tracking-wider block">
                        Slide Order #{slide.sortOrder}
                      </span>
                      <h3 className="text-white font-serif font-bold text-sm sm:text-base line-clamp-1">
                        {slide.title}
                      </h3>
                      {slide.subtitle && (
                        <p className="text-gray-200 text-xs line-clamp-1">{slide.subtitle}</p>
                      )}
                    </div>
                    {slide.backgroundVideoUrl && (
                      <div className="absolute top-2 right-2 bg-black/60 text-white rounded-lg p-1.5 text-[10px] flex items-center font-semibold">
                        <Film className="h-3 w-3 mr-1" /> Video Loop
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    <div className="text-xs space-y-1.5 text-gray-500">
                      {slide.ctaLink && (
                        <div className="flex items-center">
                          <LinkIcon className="h-3 w-3 text-gray-400 mr-1.5 shrink-0" />
                          <span className="font-semibold text-gray-700">{slide.ctaText || "Button"}:</span>
                          <span className="truncate ml-1">{slide.ctaLink}</span>
                        </div>
                      )}
                      {slide.ctaSecondaryLink && (
                        <div className="flex items-center">
                          <LinkIcon className="h-3 w-3 text-gray-400 mr-1.5 shrink-0" />
                          <span className="font-semibold text-gray-700">{slide.ctaSecondaryText || "Button"}:</span>
                          <span className="truncate ml-1">{slide.ctaSecondaryLink}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between border-t border-kishtwar-cream-100 pt-3">
                      <button
                        onClick={() => handleToggleSlideActive(slide.id, slide.isActive)}
                        disabled={isPending}
                        className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border flex items-center space-x-1 transition-all cursor-pointer ${
                          slide.isActive
                            ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                            : "bg-gray-50 border-gray-150 text-gray-400"
                        }`}
                      >
                        {slide.isActive ? <Eye className="h-3.5 w-3.5 mr-0.5" /> : <EyeOff className="h-3.5 w-3.5 mr-0.5" />}
                        <span>{slide.isActive ? "Active" : "Inactive"}</span>
                      </button>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditSlideClick(slide)}
                          className="p-2 bg-kishtwar-cream/30 hover:bg-kishtwar-cream/55 text-kishtwar-green-900 border border-kishtwar-cream-200 rounded-xl transition-all cursor-pointer"
                          title="Edit Slide"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSlide(slide.id, slide.title)}
                          disabled={isPending}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl border border-red-100 transition-all cursor-pointer"
                          title="Delete Slide"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ──── TAB 2: SECTIONS LAYOUT ──── */}
      {activeTab === "sections" && (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-kishtwar-cream-200 overflow-hidden shadow-sm">
          <div className="p-4 bg-kishtwar-cream/35 border-b border-kishtwar-cream-200">
            <h2 className="text-sm font-serif font-bold text-kishtwar-green-950">
              Arrange Sections Visibility & Order
            </h2>
            <p className="text-xs text-gray-500 mt-0.5 font-light">
              Use arrows to change the vertical layout order on the homepage. Toggle visibility to hide sections.
            </p>
          </div>

          <div className="divide-y divide-kishtwar-cream-200">
            {sections.map((section, idx) => (
              <div
                key={section.id}
                className="p-4 flex items-center justify-between hover:bg-kishtwar-cream/10 transition-all"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-kishtwar-cream border border-kishtwar-cream-200 flex items-center justify-center font-bold text-xs text-kishtwar-green-900 shrink-0">
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <span className="font-serif font-bold text-kishtwar-green-950 text-xs sm:text-sm block">
                      {section.title || section.sectionKey}
                    </span>
                    <span className="text-[10px] text-gray-400 block font-mono">
                      section_key: {section.sectionKey}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  {/* Visibility Button */}
                  <button
                    onClick={() => handleToggleSectionVisible(section.id, section.isVisible)}
                    disabled={isPending}
                    className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border flex items-center space-x-1.5 transition-all cursor-pointer ${
                      section.isVisible
                        ? "bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100"
                        : "bg-gray-50 border-gray-150 text-gray-400 hover:bg-gray-100"
                    }`}
                  >
                    {section.isVisible ? (
                      <>
                        <Eye className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span className="hidden sm:inline">Visible</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        <span className="hidden sm:inline">Hidden</span>
                      </>
                    )}
                  </button>

                  {/* Ordering arrows */}
                  <div className="flex items-center space-x-1.5 border-l border-kishtwar-cream-200 pl-3">
                    <button
                      onClick={() => handleMoveSection(idx, "up")}
                      disabled={idx === 0 || isPending}
                      className="p-1.5 hover:bg-kishtwar-cream/35 border border-kishtwar-cream-200 hover:border-kishtwar-cream-300 disabled:opacity-40 disabled:hover:bg-transparent rounded-lg text-kishtwar-green-900 transition-all cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveSection(idx, "down")}
                      disabled={idx === sections.length - 1 || isPending}
                      className="p-1.5 hover:bg-kishtwar-cream/35 border border-kishtwar-cream-200 hover:border-kishtwar-cream-300 disabled:opacity-40 disabled:hover:bg-transparent rounded-lg text-kishtwar-green-900 transition-all cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
