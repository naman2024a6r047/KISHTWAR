"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { 
  Menu, 
  X, 
  Search, 
  User as UserIcon, 
  LogOut, 
  LayoutDashboard, 
  ChevronDown,
  Home,
  Info,
  Compass,
  Globe,
  Sparkles,
  Image as ImageIcon,
  BookOpen,
  MapPin,
  Phone
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "About Kishtwar", href: "/about", icon: Info },
  { name: "Tourism", href: "/tourist-places", icon: Compass, hasDropdown: true },
  { name: "Culture & Heritage", href: "/culture-heritage", icon: Globe },
  { name: "Saffron & Sapphire", href: "/saffron-sapphire", icon: Sparkles },
  { name: "Gallery", href: "/gallery", icon: ImageIcon },
  { name: "Blog", href: "/blog", icon: BookOpen },
  { name: "Directory", href: "/about", icon: MapPin },
  { name: "Contact", href: "/contact", icon: Phone },
];

export default function Header() {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    Promise.resolve().then(() => {
      setMobileMenuOpen(false);
      setUserDropdownOpen(false);
    });
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full",
        isScrolled
          ? "bg-kishtwar-green-900/95 backdrop-blur-md border-b border-white/10 py-3 shadow-lg"
          : "bg-gradient-to-b from-black/60 to-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left area: Hamburger + Logo */}
          <div className="flex items-center space-x-2">
            {/* Mobile Menu Button (Hamburger) on the far left */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-kishtwar-cream-100 hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 text-white group-hover:text-kishtwar-gold transition-colors">
                <svg viewBox="0 0 100 100" className="w-full h-full stroke-current fill-none stroke-[2]">
                  <circle cx="50" cy="50" r="42" />
                  <path d="M22 68 L44 32 L58 52 L72 32 L80 43" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M18 68 L82 68" strokeLinecap="round" />
                  <line x1="38" y1="41" x2="44" y2="32" strokeDasharray="3,3" />
                  <line x1="66" y1="41" x2="72" y2="32" strokeDasharray="3,3" />
                  <circle cx="65" cy="24" r="3" fill="currentColor" className="text-white" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-lg font-serif font-bold tracking-wider text-white group-hover:text-kishtwar-gold transition-colors leading-tight">
                  KISHTWAR
                </span>
                <span className="text-[6.5px] sm:text-[7.5px] tracking-[0.08em] font-medium text-kishtwar-gold-light uppercase -mt-0.5">
                  Land of Sapphire, Saffron & Shrines
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation (hidden on mobile/tablet) */}
          <nav className="hidden lg:flex items-center space-x-4">
            {navItems.map((item) => {
              const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-[11px] font-sans font-bold tracking-wider transition-all relative py-2 uppercase flex items-center gap-1",
                    isActive
                      ? "text-kishtwar-gold font-bold"
                      : "text-kishtwar-cream-100 hover:text-white"
                  )}
                >
                  <span>{item.name}</span>
                  {item.hasDropdown && <ChevronDown className="h-3 w-3 opacity-70" />}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-kishtwar-gold rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Area: Search + User Actions */}
          <div className="flex items-center space-x-3.5">
            {/* Search Trigger */}
            <button 
              className="p-2 text-kishtwar-cream-100 hover:text-white transition-colors"
              title="Search"
            >
              <Search className="h-4.5 w-4.5" />
            </button>

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-1 rounded-full hover:bg-white/10 transition-all border border-white/10"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-7 w-7 rounded-full object-cover border border-kishtwar-gold"
                    />
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-kishtwar-green-600 border border-kishtwar-gold flex items-center justify-center text-white text-xs font-bold">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <span className="hidden sm:inline text-xs text-kishtwar-cream-100 font-bold">
                    {user.name.split(" ")[0]}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-kishtwar-green-900 border border-white/10 shadow-2xl py-2 z-50 text-white">
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="text-xs text-kishtwar-cream-200 truncate">{user.email}</p>
                    </div>

                    <Link
                      href={
                        user.role === "SUPER_ADMIN"
                          ? "/admin"
                          : user.role === "CONTRIBUTOR"
                          ? "/contributor"
                          : "/profile"
                      }
                      className="flex items-center space-x-2 px-4 py-2.5 text-sm hover:bg-white/10 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4 text-kishtwar-gold" />
                      <span>Dashboard</span>
                    </Link>

                    <Link
                      href="/profile"
                      className="flex items-center space-x-2 px-4 py-2.5 text-sm hover:bg-white/10 transition-colors"
                    >
                      <UserIcon className="h-4 w-4 text-kishtwar-gold" />
                      <span>My Profile</span>
                    </Link>

                    <hr className="border-white/10 my-1" />

                    <button
                      onClick={logout}
                      className="flex items-center space-x-2 w-full text-left px-4 py-2.5 text-sm hover:bg-red-500/20 text-red-400 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-4 py-1.5 sm:px-5 sm:py-2 border border-white/30 text-[10px] sm:text-xs font-bold rounded-full text-white bg-[#032013]/60 hover:bg-[#032013]/90 hover:border-white transition-all shadow-md font-sans"
              >
                Login / Register
              </Link>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[#042013] border-b border-white/10 py-4 shadow-xl z-50 text-white animate-fade-in">
          <nav className="flex flex-col space-y-2 px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-kishtwar-cream-100 hover:text-white text-sm"
                >
                  <Icon className="h-4 w-4 text-kishtwar-gold" />
                  <span className="font-semibold">{item.name}</span>
                </Link>
              );
            })}
            
            <hr className="border-white/10 my-2" />
            
            {isAuthenticated && user ? (
              <>
                <Link
                  href={
                    user.role === "SUPER_ADMIN"
                      ? "/admin"
                      : user.role === "CONTRIBUTOR"
                      ? "/contributor"
                      : "/profile"
                  }
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-sm"
                >
                  <LayoutDashboard className="h-4 w-4 text-kishtwar-gold" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-3 w-full text-left px-3 py-2.5 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors text-sm"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center justify-center w-full px-4 py-2.5 border border-white/20 text-sm font-bold rounded-full text-white bg-[#032013]/60 hover:bg-[#032013]/90 transition-colors text-center font-sans"
              >
                Login / Register
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
