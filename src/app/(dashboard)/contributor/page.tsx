import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Link from "next/link";
import {
  BookOpen,
  MapPin,
  Image as ImageIcon,
  Video,
  Calendar,
  Sparkles,
  Plus,
  Bell,
  ArrowUpRight
} from "lucide-react";
import StatsCard from "@/components/cards/StatsCard";

export const revalidate = 0; // Dynamic rendering

export default async function ContributorDashboardPage() {
  const user = await requireRole(["CONTRIBUTOR", "SUPER_ADMIN"]);

  const [blogsCount, placesCount, photosCount, videosCount, eventsCount, notifications] = await Promise.all([
    prisma.blog.count({ where: { authorId: user.id } }),
    prisma.touristPlace.count({ where: { contributorId: user.id } }),
    prisma.photo.count({ where: { contributorId: user.id } }),
    prisma.video.count({ where: { contributorId: user.id } }),
    prisma.event.count({ where: { contributorId: user.id } }),
    prisma.notification.findMany({
      where: { userId: user.id },
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const stats = [
    { label: "My Blogs & Stories", value: blogsCount, icon: BookOpen, href: "/contributor/blogs", color: "text-kishtwar-green-900" },
    { label: "My Destinations", value: placesCount, icon: MapPin, href: "/contributor/places", color: "text-kishtwar-emerald" },
    { label: "Uploaded Photos", value: photosCount, icon: ImageIcon, href: "/contributor/photos", color: "text-amber-500" },
    { label: "Submitted Videos", value: videosCount, icon: Video, href: "/contributor/videos", color: "text-red-500" },
    { label: "My Events", value: eventsCount, icon: Calendar, href: "/contributor/events", color: "text-blue-500" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-kishtwar-green-950">
            Contributor Dashboard
          </h1>
          <p className="text-xs text-gray-500 font-light mt-1">
            Welcome back, <span className="font-bold text-kishtwar-green-900">{user.name}</span>. Share stories, discover places, and update events.
          </p>
          <Breadcrumbs className="text-kishtwar-green-600 mt-1" />
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/contributor/blogs/new"
            className="flex items-center space-x-1.5 px-4 py-2 bg-kishtwar-green-900 hover:bg-kishtwar-green-950 text-white rounded-xl text-xs font-serif font-bold tracking-wide transition-all shadow-sm"
          >
            <Plus className="h-4 w-4 text-kishtwar-gold shrink-0" />
            <span>New Blog</span>
          </Link>
          <Link
            href="/contributor/places/new"
            className="flex items-center space-x-1.5 px-4 py-2 bg-kishtwar-cream hover:bg-kishtwar-cream-200 text-kishtwar-green-950 border border-kishtwar-cream-300 rounded-xl text-xs font-serif font-bold tracking-wide transition-all shadow-sm"
          >
            <Plus className="h-4 w-4 text-kishtwar-green-900 shrink-0" />
            <span>New Destination</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white/80 backdrop-blur-md rounded-2xl border border-kishtwar-cream-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-32 group"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-gray-400 font-serif font-bold uppercase tracking-wider block">
                {stat.label}
              </span>
              <stat.icon className={`h-5 w-5 ${stat.color} group-hover:scale-110 transition-transform`} />
            </div>
            <div className="flex items-baseline justify-between mt-4">
              <span className="text-3xl font-serif font-bold text-kishtwar-green-950">
                {stat.value}
              </span>
              <span className="text-[10px] text-kishtwar-gold font-bold flex items-center group-hover:underline">
                View All <ArrowUpRight className="h-3 w-3 ml-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Notifications and Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications Column */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-md rounded-2xl border border-kishtwar-cream-200 p-6 shadow-sm flex flex-col h-[380px]">
          <div className="flex items-center justify-between pb-3 border-b border-kishtwar-cream-200 mb-4 shrink-0">
            <h3 className="font-serif font-bold text-kishtwar-green-950 flex items-center">
              <Bell className="h-4 w-4 mr-2 text-kishtwar-gold shrink-0" />
              Recent System Notifications
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {notifications.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-2">
                <Bell className="h-8 w-8 text-gray-300" />
                <span className="text-xs font-medium">No recent notifications or updates.</span>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3.5 rounded-xl border flex gap-3 transition-all ${
                    notif.isRead
                      ? "bg-white/40 border-kishtwar-cream-150"
                      : "bg-kishtwar-cream/15 border-kishtwar-cream-200"
                  }`}
                >
                  <div className="h-7 w-7 rounded-lg bg-kishtwar-cream border border-kishtwar-cream-200 flex items-center justify-center shrink-0">
                    <Sparkles className="h-3.5 w-3.5 text-kishtwar-gold" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-kishtwar-green-950 truncate">{notif.title}</p>
                    <p className="text-xs text-gray-650 mt-0.5 leading-relaxed">{notif.message}</p>
                    <span className="text-[10px] text-gray-400 font-light block mt-1">
                      {new Date(notif.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Shortcuts Column */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-kishtwar-cream-200 p-6 shadow-sm flex flex-col justify-between h-[380px]">
          <div>
            <div className="flex items-center pb-3 border-b border-kishtwar-cream-200 mb-4">
              <h3 className="font-serif font-bold text-kishtwar-green-950">
                Quick Actions
              </h3>
            </div>

            <div className="space-y-2.5">
              <Link
                href="/contributor/blogs/new"
                className="flex items-center justify-between p-3 border border-kishtwar-cream-200 hover:border-kishtwar-cream-300 rounded-xl bg-white hover:bg-kishtwar-cream/10 transition-all text-xs font-bold text-gray-750 group"
              >
                <span className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-kishtwar-green-900" /> Write Travel Blog
                </span>
                <Plus className="h-4 w-4 text-gray-400 group-hover:text-kishtwar-green-900 transition-colors" />
              </Link>

              <Link
                href="/contributor/places/new"
                className="flex items-center justify-between p-3 border border-kishtwar-cream-200 hover:border-kishtwar-cream-300 rounded-xl bg-white hover:bg-kishtwar-cream/10 transition-all text-xs font-bold text-gray-750 group"
              >
                <span className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-kishtwar-emerald" /> Submit Scenic Spot
                </span>
                <Plus className="h-4 w-4 text-gray-400 group-hover:text-kishtwar-emerald transition-colors" />
              </Link>

              <Link
                href="/contributor/photos"
                className="flex items-center justify-between p-3 border border-kishtwar-cream-200 hover:border-kishtwar-cream-300 rounded-xl bg-white hover:bg-kishtwar-cream/10 transition-all text-xs font-bold text-gray-750 group"
              >
                <span className="flex items-center">
                  <ImageIcon className="h-4 w-4 mr-2 text-amber-500" /> Upload Photo Gallery
                </span>
                <Plus className="h-4 w-4 text-gray-400 group-hover:text-amber-500 transition-colors" />
              </Link>

              <Link
                href="/contributor/events/new"
                className="flex items-center justify-between p-3 border border-kishtwar-cream-200 hover:border-kishtwar-cream-300 rounded-xl bg-white hover:bg-kishtwar-cream/10 transition-all text-xs font-bold text-gray-750 group"
              >
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-blue-500" /> Create Festival / Event
                </span>
                <Plus className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </Link>
            </div>
          </div>

          <div className="pt-4 border-t border-kishtwar-cream-200 mt-4 text-[10px] text-gray-400 leading-normal">
            Your submissions will go to the moderation queue. Once approved by the super admin, they will automatically publish live on the portal.
          </div>
        </div>
      </div>
    </div>
  );
}
