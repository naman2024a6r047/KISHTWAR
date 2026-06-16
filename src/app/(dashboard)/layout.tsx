"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter, usePathname } from "next/navigation";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";
import { Loader2, X, Compass, LogOut } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  // Close mobile sidebar on route change
  useEffect(() => {
    Promise.resolve().then(() => {
      setMobileOpen(false);
    });
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-kishtwar-cream/30 text-kishtwar-green-800">
        <Loader2 className="h-10 w-10 animate-spin text-kishtwar-emerald mb-2" />
        <span className="text-sm font-semibold tracking-wide">Loading portal dashboard...</span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect in useEffect
  }

  // Get links based on user role to render in the mobile sidebar
  const getRoleLabel = () => {
    return user.role.replace("_", " ").toLowerCase();
  };

  return (
    <div className="min-h-screen bg-kishtwar-cream/10 font-sans flex text-gray-800">
      {/* Desktop Sidebar (visible on md+) */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-h-screen transition-all duration-300">
        {/* Dashboard Header */}
        <DashboardHeader onMenuClick={() => setMobileOpen(true)} />

        {/* Dynamic Page content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay / Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          ></div>

          {/* Drawer Content */}
          <div className="relative flex flex-col w-full max-w-xs bg-kishtwar-green-900 text-white h-full shadow-2xl p-4 animate-slide-in-left">
            <div className="flex items-center justify-between pb-4 border-b border-kishtwar-green-800/80 mb-4">
              <Link href="/" className="flex flex-col">
                <span className="text-base font-serif font-bold tracking-wide text-white">
                  KISHTWAR
                </span>
                <span className="text-[8px] tracking-wider text-kishtwar-gold uppercase -mt-0.5">
                  {getRoleLabel()} portal
                </span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-kishtwar-cream-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Profile widget */}
            <div className="flex items-center gap-3 pb-4 border-b border-kishtwar-green-800/50 mb-4">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-10 w-10 rounded-full object-cover border border-kishtwar-gold"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-kishtwar-green-600 border border-kishtwar-gold flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {user.name.charAt(0)}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate text-white">{user.name}</p>
                <p className="text-xs text-kishtwar-gold capitalize font-medium">{getRoleLabel()}</p>
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <div className="flex-1 overflow-y-auto space-y-1 py-2">
              <p className="text-[10px] text-kishtwar-gold uppercase tracking-widest font-semibold px-3 mb-2">
                Navigation
              </p>
              {/* Use mobile view shortcuts or close drawer links */}
              {user.role === "SUPER_ADMIN" && (
                <div className="space-y-1">
                  <Link href="/admin" className="block px-3 py-2 rounded-lg text-sm hover:bg-white/5 text-kishtwar-cream-200">Overview</Link>
                  <Link href="/admin/users" className="block px-3 py-2 rounded-lg text-sm hover:bg-white/5 text-kishtwar-cream-200">Users & Roles</Link>
                  <Link href="/admin/places" className="block px-3 py-2 rounded-lg text-sm hover:bg-white/5 text-kishtwar-cream-200">Tourist Places</Link>
                  <Link href="/admin/blogs" className="block px-3 py-2 rounded-lg text-sm hover:bg-white/5 text-kishtwar-cream-200">Blogs & Stories</Link>
                  <Link href="/admin/gallery" className="block px-3 py-2 rounded-lg text-sm hover:bg-white/5 text-kishtwar-cream-200">Photo Gallery</Link>
                  <Link href="/admin/events" className="block px-3 py-2 rounded-lg text-sm hover:bg-white/5 text-kishtwar-cream-200">Events</Link>
                </div>
              )}
              {user.role === "CONTRIBUTOR" && (
                <div className="space-y-1">
                  <Link href="/contributor" className="block px-3 py-2 rounded-lg text-sm hover:bg-white/5 text-kishtwar-cream-200">Overview</Link>
                  <Link href="/contributor/blogs" className="block px-3 py-2 rounded-lg text-sm hover:bg-white/5 text-kishtwar-cream-200">My Blogs</Link>
                  <Link href="/contributor/places" className="block px-3 py-2 rounded-lg text-sm hover:bg-white/5 text-kishtwar-cream-200">My Places</Link>
                  <Link href="/contributor/photos" className="block px-3 py-2 rounded-lg text-sm hover:bg-white/5 text-kishtwar-cream-200">My Photos</Link>
                  <Link href="/contributor/events" className="block px-3 py-2 rounded-lg text-sm hover:bg-white/5 text-kishtwar-cream-200">My Events</Link>
                </div>
              )}
              {user.role === "USER" && (
                <div className="space-y-1">
                  <Link href="/profile" className="block px-3 py-2 rounded-lg text-sm hover:bg-white/5 text-kishtwar-cream-200">My Profile</Link>
                  <Link href="/profile/saved" className="block px-3 py-2 rounded-lg text-sm hover:bg-white/5 text-kishtwar-cream-200">Saved Items</Link>
                  <Link href="/profile/wishlist" className="block px-3 py-2 rounded-lg text-sm hover:bg-white/5 text-kishtwar-cream-200">Travel Wishlist</Link>
                </div>
              )}
            </div>

            {/* Logout button */}
            <div className="pt-4 border-t border-kishtwar-green-800/80 space-y-2">
              <Link
                href="/"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-kishtwar-cream-200 hover:bg-white/5"
              >
                <Compass className="h-4 w-4 text-kishtwar-gold" />
                <span>Go to Home</span>
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 text-left"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
