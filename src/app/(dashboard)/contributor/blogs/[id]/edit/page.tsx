import { prisma } from "@/lib/prisma";
import { getBlogCategories } from "@/actions/blogs.actions";
import { requireRole } from "@/lib/auth";
import BlogForm from "../../BlogForm";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { notFound } from "next/navigation";

export const revalidate = 0; // Dynamic rendering

interface EditBlogPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ContributorEditBlogPage({ params }: EditBlogPageProps) {
  const user = await requireRole(["CONTRIBUTOR", "SUPER_ADMIN"]);
  
  const { id } = await params;
  const blogId = parseInt(id, 10);

  if (isNaN(blogId)) {
    return notFound();
  }

  const blog = await prisma.blog.findUnique({
    where: { id: blogId },
    include: {
      tags: {
        include: {
          tag: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!blog) {
    return notFound();
  }

  // Enforce ownership: only author or super admin can edit
  if (blog.authorId !== user.id && user.role !== "SUPER_ADMIN") {
    return notFound();
  }

  const categories = await getBlogCategories();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-kishtwar-green-950">
          Edit Story / Blog Post
        </h1>
        <Breadcrumbs className="text-kishtwar-green-600 mt-1" />
      </div>

      {/* Blog Form */}
      <BlogForm categories={categories} initialData={blog} />
    </div>
  );
}
