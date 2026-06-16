"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { 
  Bell, 
  Menu, 
  User, 
  LogOut, 
  LayoutDashboard,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";
import Breadcrumbs from "./Breadcrumbs";

interface DashboardHeaderProps {
  onMenuClick?: () => void;
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  if (!user) return null;

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 md:px-8 z-20 w-full">
      {/* Left section: mobile menu trigger & page breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-lg hover:bg-gray-100 text-gray-500 md:hidden transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:block">
          <Breadcrumbs />
        </div>
        <div className="sm:hidden text-sm font-semibold text-kishtwar-green-900 capitalize">
          {user.role.replace("_", " ").toLowerCase()} Portal
        </div>
      </div>

      {/* Right section: notifications & user menu */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-kishtwar-green-900 transition-colors relative"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-kishtwar-gold rounded-full ring-2 ring-white" />
          </button>

          {/* Notifications Dropdown (Basic setup) */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white border border-gray-200 shadow-2xl py-2 z-50 animate-scale-in text-gray-800">
              <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                <span className="font-semibold text-sm">Notifications</span>
                <button className="text-xs text-kishtwar-emerald hover:underline font-medium">
                  Mark all as read
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto py-1">
                <div className="px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50">
                  <p className="text-xs font-semibold text-gray-900">Welcome to Kishtwar Portal!</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Explore places, write stories, and discover Kishtwar.</p>
                  <span className="text-[9px] text-gray-400 mt-1 block">Just now</span>
                </div>
              </div>
              <div className="px-4 py-1.5 border-t border-gray-100 text-center">
                <Link
                  href="/profile/activity"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-xs text-kishtwar-green-600 hover:text-kishtwar-green-800 font-semibold"
                >
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-8 w-8 rounded-full object-cover border border-kishtwar-gold"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-kishtwar-green-600 border border-kishtwar-gold flex items-center justify-center text-white text-sm font-bold">
                {user.name.charAt(0)}
              </div>
            )}
            <span className="hidden sm:inline text-sm font-medium text-gray-700">
              {user.name}
            </span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-gray-200 shadow-2xl py-2 z-50 animate-scale-in text-gray-800">
              <div className="px-4 py-2 border-b border-gray-100 sm:hidden">
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>

              <Link
                href="/"
                className="flex items-center space-x-2 px-4 py-2.5 text-sm hover:bg-gray-50 text-gray-700 transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                <Home className="h-4 w-4 text-kishtwar-gold" />
                <span>Go to Homepage</span>
              </Link>

              <Link
                href="/profile"
                className="flex items-center space-x-2 px-4 py-2.5 text-sm hover:bg-gray-50 text-gray-700 transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                <User className="h-4 w-4 text-kishtwar-gold" />
                <span>My Profile</span>
              </Link>

              <hr className="border-gray-100 my-1" />

              <button
                onClick={logout}
                className="flex items-center space-x-2 w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 text-red-500 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
