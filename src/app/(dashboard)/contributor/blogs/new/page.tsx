import { getBlogCategories } from "@/actions/blogs.actions";
import { requireRole } from "@/lib/auth";
import BlogForm from "../BlogForm";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export const revalidate = 0; // Dynamic rendering

export default async function ContributorCreateBlogPage() {
  await requireRole(["CONTRIBUTOR", "SUPER_ADMIN"]);
  const categories = await getBlogCategories();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-kishtwar-green-950">
          Submit Travel Story
        </h1>
        <Breadcrumbs className="text-kishtwar-green-600 mt-1" />
      </div>

      {/* Blog Form */}
      <BlogForm categories={categories} />
    </div>
  );
}
