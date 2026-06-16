import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  iconClassName?: string;
  className?: string;
}

export default function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  iconClassName,
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "bg-white backdrop-blur-md border border-kishtwar-cream-200 rounded-2xl p-6 shadow-xs flex items-center space-x-4 transition-all duration-300 hover:shadow-md hover:border-kishtwar-cream-300",
        className
      )}
    >
      <div
        className={cn(
          "p-3 rounded-xl text-kishtwar-green-900 bg-kishtwar-cream-200/50 border border-kishtwar-cream-200 shrink-0",
          iconClassName
        )}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-[10px] sm:text-xs text-gray-400 font-bold block uppercase tracking-wider truncate">
          {title}
        </span>
        <span className="text-xl sm:text-2xl font-serif font-bold text-kishtwar-green-950 block tracking-tight">
          {value}
        </span>
        {description && (
          <span className="text-[10px] text-gray-400 font-medium block mt-0.5 truncate">
            {description}
          </span>
        )}
      </div>
    </div>
  );
}
