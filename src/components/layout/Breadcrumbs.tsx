"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbsProps {
  className?: string;
  customLabels?: Record<string, string>;
}

export default function Breadcrumbs({ className, customLabels = {} }: BreadcrumbsProps) {
  const pathname = usePathname();
  
  if (pathname === "/") return null;

  const paths = pathname.split("/").filter(Boolean);

  const getLabel = (path: string) => {
    if (customLabels[path]) return customLabels[path];
    
    // Convert slug/kebab-case to title case
    return path
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <nav aria-label="Breadcrumb" className={cn("py-3 flex items-center text-xs sm:text-sm font-medium", className)}>
      <ol className="flex items-center space-x-1 sm:space-x-2 flex-wrap">
        <li className="flex items-center">
          <Link
            href="/"
            className="text-kishtwar-green-600 hover:text-kishtwar-green-800 transition-colors flex items-center"
          >
            <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {paths.map((path, index) => {
          const href = `/${paths.slice(0, index + 1).join("/")}`;
          const isLast = index === paths.length - 1;
          const label = getLabel(path);

          return (
            <li key={href} className="flex items-center">
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-kishtwar-green-300 mx-1 shrink-0" />
              {isLast ? (
                <span className="text-kishtwar-green-900 font-semibold truncate max-w-[150px] sm:max-w-[300px]" aria-current="page">
                  {label}
                </span>
              ) : (
                <Link
                  href={href}
                  className="text-kishtwar-green-600 hover:text-kishtwar-green-800 transition-colors truncate max-w-[150px] sm:max-w-[300px]"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
