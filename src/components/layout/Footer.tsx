"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowRight,
  MapPin,
  Compass,
  Home,
  Shield,
  Users,
  Briefcase,
  BookOpen,
  Cloud,
  Phone,
  FileText,
  ClipboardList,
  Mountain
} from "lucide-react";

// Social SVG Icons
function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <polygon points="10 15 15 12 10 9" fill="currentColor" />
    </svg>
  );
}

// Mobile-specific 5x2 grid items
const mobileFooterLinks = [
  { label: "Plan Your Trip", href: "/tourist-places", icon: ClipboardList },
  { label: "Stay & Eat", href: "/tourist-places?category=hotels", icon: Home },
  { label: "Adventure", href: "/tourist-places?category=adventure-spots", icon: Mountain },
  { label: "Essential Info", href: "/about", icon: Shield },
  { label: "Community", href: "/contributor", icon: Users },
  { label: "For Locals", href: "/about", icon: Briefcase },
  { label: "Travel Guide", href: "/blog", icon: BookOpen },
  { label: "Weather", href: "/about", icon: Cloud },
  { label: "Emergency", href: "/contact", icon: Phone },
  { label: "Blogs", href: "/blog", icon: FileText }
];

// Desktop multi-column directory items
const desktopFooterLinks = [
  {
    title: "Plan Your Trip",
    links: [
      { label: "How to Reach", href: "/tourist-places" },
      { label: "Best Time to Visit", href: "/about" },
      { label: "Travel Guide", href: "/blog" },
      { label: "Itinerary Planner", href: "/about" }
    ]
  },
  {
    title: "Stay & Eat",
    links: [
      { label: "Hotels", href: "/tourist-places?category=hotels" },
      { label: "Homestays", href: "/tourist-places?category=homestays" },
      { label: "Restaurants", href: "/tourist-places?category=restaurants" },
      { label: "Local Food", href: "/culture-heritage" }
    ]
  },
  {
    title: "Adventure",
    links: [
      { label: "Trekking", href: "/tourist-places?category=adventure-spots" },
      { label: "Camping", href: "/tourist-places?category=adventure-spots" },
      { label: "Wildlife Tourism", href: "/tourist-places/kishtwar-national-park" },
      { label: "Winter Tourism", href: "/tourist-places" }
    ]
  },
  {
    title: "Essential Info",
    links: [
      { label: "Weather", href: "/about" },
      { label: "Emergency Contacts", href: "/contact" },
      { label: "Hospitals", href: "/about" },
      { label: "Transport", href: "/about" }
    ]
  },
  {
    title: "Community",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Upload Photos", href: "/contributor" },
      { label: "Write a Review", href: "/tourist-places" },
      { label: "Ask a Question", href: "/contact" }
    ]
  },
  {
    title: "For Locals",
    links: [
      { label: "Business Directory", href: "/about" },
      { label: "Education", href: "/about" },
      { label: "Government Services", href: "/about" },
      { label: "Job Opportunities", href: "/about" }
    ]
  }
];

export default function Footer() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleAISearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <footer className="bg-[#042013] text-white pt-8 pb-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title: Quick Access */}
        <div className="mb-4">
          <h3 className="text-sm font-sans font-bold text-white uppercase tracking-wider">
            Quick Access
          </h3>
        </div>

        {/* --- MOBILE/TABLET LAYOUT: 5x2 Directory Grid --- */}
        <div className="lg:hidden grid grid-cols-5 gap-y-4 gap-x-2 pb-6 border-b border-white/10">
          {mobileFooterLinks.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={item.href}
                className="flex flex-col items-center justify-center text-center group"
              >
                <div className="p-1 mb-1 text-kishtwar-gold shrink-0">
                  <Icon className="h-4.5 w-4.5 stroke-[1.5] group-hover:scale-105 transition-transform" />
                </div>
                <span className="text-[8px] font-sans text-gray-300 group-hover:text-white transition-colors leading-none font-semibold">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* --- DESKTOP LAYOUT: Multi-Column + AI Widget (hidden on mobile/tablet) --- */}
        <div className="hidden lg:grid grid-cols-12 gap-8 pb-10 border-b border-white/10">
          {/* 6 columns of links */}
          <div className="lg:col-span-9 grid lg:grid-cols-6 gap-6">
            {desktopFooterLinks.map((col, idx) => (
              <div key={idx} className="space-y-3">
                <h4 className="text-xs font-sans font-bold text-white uppercase tracking-wider">
                  {col.title}
                </h4>
                <ul className="space-y-1.5">
                  {col.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <Link 
                        href={link.href}
                        className="text-[11px] font-sans text-gray-400 hover:text-kishtwar-gold transition-colors font-medium"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* AI travel guide widget */}
          <div className="lg:col-span-3 space-y-3.5 bg-black/20 p-5 rounded-2xl border border-white/5">
            <div className="space-y-0.5">
              <h4 className="text-sm font-serif font-bold text-[#c9a84c]">
                Ask About Kishtwar
              </h4>
              <span className="text-[10px] text-white/60 font-sans font-bold uppercase tracking-wider block">
                Your AI Travel Guide
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
              Ask anything about places, culture, history, or travel in Kishtwar.
            </p>
            <form onSubmit={handleAISearchSubmit} className="flex items-center bg-white rounded-lg px-3 py-1.5 shadow-md">
              <input
                type="text"
                placeholder="Type your question..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-[11px] text-gray-900 placeholder-gray-400 focus:outline-none w-full font-medium"
              />
              <button 
                type="submit"
                className="p-1 text-[#0b331f] hover:text-kishtwar-gold transition-colors ml-1"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright & socials bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-6 text-[9px] sm:text-[10px] text-gray-400 font-sans font-medium">
          
          {/* Left: Socials and copyright */}
          <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-6">
            <div className="flex space-x-3.5">
              <a href="#" className="hover:text-white transition-colors" title="Facebook">
                <FacebookIcon className="h-3.5 w-3.5" />
              </a>
              <a href="#" className="hover:text-white transition-colors" title="Twitter">
                <TwitterIcon className="h-3.5 w-3.5" />
              </a>
              <a href="#" className="hover:text-white transition-colors" title="YouTube">
                <YoutubeIcon className="h-3.5 w-3.5" />
              </a>
              <a href="#" className="hover:text-white transition-colors" title="Instagram">
                <InstagramIcon className="h-3.5 w-3.5" />
              </a>
            </div>
            <span className="text-center md:text-left">
              © {new Date().getFullYear()} Kishtwar – Official Tourism & Information Portal | All Rights Reserved
            </span>
          </div>

          {/* Center: Made with love */}
          <div className="my-3 md:my-0 flex items-center space-x-1 hover:text-white cursor-pointer select-none">
            <span>Made with ❤️ for Kishtwar</span>
            <span className="text-[8px] opacity-75">▼</span>
          </div>

          {/* Right: Legal */}
          <div className="flex items-center space-x-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link href="/about" className="hover:text-white transition-colors">Sitemap</Link>
          </div>

        </div>

      </div>
    </footer>
  );
}
