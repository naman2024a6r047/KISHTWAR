import { getAllHeroSlides, getAllHomepageSections } from "@/actions/homepage.actions";
import HomepageManager from "./HomepageManager";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export const revalidate = 0; // Dynamic rendering

export default async function AdminHomepageCustomizationPage() {
  const [slidesRes, sectionsRes] = await Promise.all([
    getAllHeroSlides(),
    getAllHomepageSections(),
  ]);

  const initialSlides = slidesRes.success ? slidesRes.data || [] : [];
  const initialSections = sectionsRes.success ? sectionsRes.data || [] : [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-kishtwar-green-950">
            Homepage Layout & Customization
          </h1>
          <Breadcrumbs className="text-kishtwar-green-600 mt-1" />
        </div>
      </div>

      {/* Homepage Customization Manager */}
      <HomepageManager
        initialSlides={initialSlides}
        initialSections={initialSections}
      />
    </div>
  );
}
