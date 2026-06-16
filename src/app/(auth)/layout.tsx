import Link from "next/link";
import { Compass } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-4 bg-kishtwar-green-950 overflow-hidden font-sans">
      {/* Mountain-like background overlay/gradients */}
      <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-10 blur-xs"></div>
      
      {/* Decorative gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-kishtwar-green-500/20 blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-kishtwar-gold/10 blur-3xl"></div>

      {/* Main Content Area */}
      <div className="relative w-full max-w-md z-10 flex flex-col items-center">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2.5 mb-8 group select-none">
          <div className="p-2.5 rounded-2xl bg-kishtwar-gold/10 border border-kishtwar-gold/20 backdrop-blur-md group-hover:bg-kishtwar-gold/20 transition-all duration-300">
            <Compass className="h-6 w-6 text-kishtwar-gold-light" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-serif font-bold tracking-wider text-white leading-none">
              KISHTWAR
            </span>
            <span className="text-[9px] uppercase tracking-widest text-kishtwar-cream-200 mt-1">
              Sapphire, Saffron & Shrines
            </span>
          </div>
        </Link>

        {/* Auth Glass Card */}
        <div className="w-full bg-white/95 rounded-3xl border border-kishtwar-cream-200/20 shadow-2xl p-6 sm:p-8 backdrop-blur-md">
          {children}
        </div>

        {/* Small footer */}
        <p className="text-[10px] text-gray-500 font-light mt-8 tracking-wide">
          &copy; {new Date().getFullYear()} Kishtwar Tourism Board. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}
