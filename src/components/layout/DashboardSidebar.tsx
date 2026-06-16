"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  BookOpen, 
  Image as ImageIcon, 
  Video, 
  Calendar, 
  MessageSquare, 
  AlertTriangle, 
  FolderTree, 
  Mail, 
  Home as HomeIcon, 
  Settings, 
  FileText, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Heart,
  Bookmark,
  History,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Sidebar Links for Admins
const adminLinks = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Users & Roles", href: "/admin/users", icon: Users },
  { label: "Contributors", href: "/admin/contributors", icon: Sparkles },
  { label: "Tourist Places", href: "/admin/places", icon: MapPin },
  { label: "Blogs & Stories", href: "/admin/blogs", icon: BookOpen },
  { label: "Photo Gallery", href: "/admin/gallery", icon: ImageIcon },
  { label: "Videos", href: "/admin/videos", icon: Video },
  { label: "Events", href: "/admin/events", icon: Calendar },
  { label: "Comments Moderation", href: "/admin/comments", icon: MessageSquare },
  { label: "Reported Content", href: "/admin/reports", icon: AlertTriangle },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Contact Inbox", href: "/admin/contact", icon: Mail },
  { label: "Homepage Settings", href: "/admin/homepage", icon: FileText },
  { label: "Site Settings", href: "/admin/settings", icon: Settings },
];

// Sidebar Links for Contributors
const contributorLinks = [
  { label: "Overview", href: "/contributor", icon: LayoutDashboard },
  { label: "My Blogs", href: "/contributor/blogs", icon: BookOpen },
  { label: "My Places", href: "/contributor/places", icon: MapPin },
  { label: "My Photos", href: "/contributor/photos", icon: ImageIcon },
  { label: "My Videos", href: "/contributor/videos", icon: Video },
  { label: "My Events", href: "/contributor/events", icon: Calendar },
];

// Sidebar Links for regular users (Profile area)
const userLinks = [
  { label: "My Profile", href: "/profile", icon: User },
  { label: "Saved Items", href: "/profile/saved", icon: Bookmark },
  { label: "Travel Wishlist", href: "/profile/wishlist", icon: Heart },
  { label: "Activity History", href: "/profile/activity", icon: History },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;

  let links = userLinks;
  if (user.role === "SUPER_ADMIN") {
    links = adminLinks;
  } else if (user.role === "CONTRIBUTOR") {
    links = contributorLinks;
  }

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-screen fixed left-0 top-0 z-30 transition-all duration-300 bg-kishtwar-green-900 border-r border-kishtwar-green-800 text-white shadow-xl",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-kishtwar-green-800/80">
        {!collapsed && (
          <Link href="/" className="flex flex-col">
            <span className="text-lg font-serif font-bold tracking-wide text-white">
              KISHTWAR
            </span>
            <span className="text-[9px] tracking-wider text-kishtwar-gold uppercase -mt-1">
              Dashboard
            </span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "p-1.5 rounded-lg hover:bg-white/10 text-kishtwar-cream-200 hover:text-white transition-colors",
            collapsed && "mx-auto"
          )}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* User Info Preview */}
      <div className={cn("p-4 border-b border-kishtwar-green-800/50 flex items-center gap-3", collapsed && "justify-center")}>
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
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate text-white">{user.name}</p>
            <p className="text-xs text-kishtwar-gold capitalize font-medium">{user.role.replace("_", " ").toLowerCase()}</p>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 hide-scrollbar">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                isActive
                  ? "bg-kishtwar-gold text-kishtwar-green-900 font-semibold"
                  : "text-kishtwar-cream-200 hover:bg-white/5 hover:text-white"
              )}
              title={collapsed ? link.label : undefined}
            >
              <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-kishtwar-green-900" : "text-kishtwar-gold group-hover:scale-110 transition-transform")} />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-kishtwar-green-800/80">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-kishtwar-cream-200 hover:bg-white/5 hover:text-white transition-all mb-1",
            collapsed && "justify-center"
          )}
          title={collapsed ? "Go to Homepage" : undefined}
        >
          <HomeIcon className="h-5 w-5 text-kishtwar-gold" />
          {!collapsed && <span>Go to Homepage</span>}
        </Link>

        <button
          onClick={logout}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all",
            collapsed && "justify-center"
          )}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
