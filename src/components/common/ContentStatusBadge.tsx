import { ContentStatus, MediaStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

interface ContentStatusBadgeProps {
  status: ContentStatus | MediaStatus;
  className?: string;
}

export default function ContentStatusBadge({ status, className }: ContentStatusBadgeProps) {
  const badgeStyles = {
    DRAFT: "bg-gray-100 text-gray-700 border-gray-200",
    SUBMITTED: "bg-blue-50 text-blue-700 border-blue-200",
    APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    PUBLISHED: "bg-kishtwar-green-50 text-kishtwar-green-700 border-kishtwar-green-200",
    REJECTED: "bg-red-50 text-red-700 border-red-200",
  };

  const statusLabel = {
    DRAFT: "Draft",
    SUBMITTED: "Pending Approval",
    APPROVED: "Approved",
    PUBLISHED: "Published",
    REJECTED: "Rejected",
  };

  const currentStyle = badgeStyles[status as keyof typeof badgeStyles] || badgeStyles.DRAFT;
  const currentLabel = statusLabel[status as keyof typeof statusLabel] || status;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors duration-150 capitalize",
        currentStyle,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current mr-1.5 shrink-0" />
      {currentLabel}
    </span>
  );
}
