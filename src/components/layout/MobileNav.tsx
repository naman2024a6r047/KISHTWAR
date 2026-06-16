"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { 
  Home, 
  Compass, 
  Map, 
  User, 
  Calendar,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function MobileNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  const tabs = [
    { label: "Home", href: "/", icon: Home },
    { label: "Explore", href: "/tourist-places", icon: Compass },
    { label: "Map", href: "/map", icon: Map },
    { label: "Saffron", href: "/saffron-sapphire", icon: Sparkles },
    { 
      label: isAuthenticated ? "Profile" : "Login", 
      href: isAuthenticated ? "/profile" : "/login", 
      icon: User 
    },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-kishtwar-green-900/95 backdrop-blur-md border-t border-kishtwar-green-800/80 px-2 py-1 shadow-2xl">
      <div className="flex justify-around items-center h-14">
        {tabs.map((tab) => {
          const isActive = tab.href === "/" 
            ? pathname === "/" 
            : pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center justify-center flex-1 py-1 px-2 text-center"
            >
              <div
                className={cn(
                  "p-1 rounded-full transition-all duration-200",
                  isActive 
                    ? "bg-kishtwar-gold text-kishtwar-green-900 scale-110 shadow-lg" 
                    : "text-kishtwar-cream-200 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span
                className={cn(
                  "text-[10px] mt-0.5 font-medium transition-colors duration-200",
                  isActive ? "text-kishtwar-gold font-bold" : "text-kishtwar-cream-300"
                )}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
