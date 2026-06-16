"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { approveContributor } from "@/actions/admin.actions";
import {
  CheckCircle,
  Clock,
  Globe,
  Search,
  Eye,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

interface ContributorsListProps {
  initialContributors: any[];
}

export default function ContributorsList({ initialContributors }: ContributorsListProps) {
  const router = useRouter();
  const [contributors, setContributors] = useState(initialContributors);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [actionUserId, setActionUserId] = useState<number | null>(null);
  const [alertMessage, setAlertMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const triggerAlert = (text: string, type: "success" | "error") => {
    setAlertMessage({ text, type });
    setTimeout(() => setAlertMessage(null), 4000);
  };

  const handleApprove = async (userId: number, name: string) => {
    setActionUserId(userId);
    startTransition(async () => {
      try {
        const res = await approveContributor(userId);
        if (res.success) {
          setContributors((prev) =>
            prev.map((c) =>
              c.userId === userId ? { ...c, verified: true, approvedAt: new Date() } : c
            )
          );
          triggerAlert(res.message || `Approved ${name} successfully.`, "success");
          router.refresh();
        } else {
          triggerAlert(res.error || "Failed to approve contributor.", "error");
        }
      } catch (err) {
        triggerAlert("An error occurred during verification.", "error");
      } finally {
        setActionUserId(null);
      }
    });
  };

  // Filter contributors
  const filteredContributors = contributors.filter((c) => {
    const search = searchQuery.toLowerCase();
    const nameMatch = c.user.name.toLowerCase().includes(search);
    const specialtyMatch = c.specialty?.toLowerCase().includes(search) || false;
    return nameMatch || specialtyMatch;
  });

  return (
    <div className="space-y-6">
      {/* Alert banner */}
      {alertMessage && (
        <div
          className={`fixed bottom-4 right-4 z-50 flex items-center space-x-2 px-4 py-3 rounded-2xl border shadow-lg text-sm font-semibold animate-slide-in-up ${
            alertMessage.type === "success"
              ? "bg-emerald-50 border-emerald-100 text-emerald-800"
              : "bg-red-50 border-red-100 text-red-800"
          }`}
        >
          {alertMessage.type === "success" ? (
            <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
          )}
          <span>{alertMessage.text}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search contributors by name or specialty..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-4 py-2.5 w-full rounded-xl border border-kishtwar-cream-200 bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-kishtwar-green-500 focus:border-transparent transition-all placeholder:text-gray-400"
        />
      </div>

      {/* Grid of Contributors */}
      {filteredContributors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContributors.map((c) => (
            <div
              key={c.id}
              className="bg-white border border-kishtwar-cream-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-kishtwar-cream-300 transition-all duration-300"
            >
              <div>
                {/* Header: User Info */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {c.user.avatar ? (
                      <img
                        src={c.user.avatar}
                        alt={c.user.name}
                        className="h-12 w-12 rounded-full object-cover border border-kishtwar-cream-200 shrink-0"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-kishtwar-cream text-kishtwar-green-900 border border-kishtwar-cream-200 flex items-center justify-center font-bold text-lg shrink-0">
                        {c.user.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-serif font-bold text-kishtwar-green-950 truncate block">
                          {c.user.name}
                        </span>
                        {c.verified && (
                          <span title="Verified Contributor">
                            <Sparkles className="h-4 w-4 text-kishtwar-gold shrink-0" />
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold block">
                        @{c.user.username}
                      </span>
                    </div>
                  </div>

                  {/* Verification status badge */}
                  {c.verified ? (
                    <span className="inline-flex items-center text-[9px] text-emerald-700 bg-emerald-50 border border-emerald-100 font-bold px-2 py-0.5 rounded-full shrink-0">
                      <CheckCircle className="h-2.5 w-2.5 mr-0.5" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-[9px] text-amber-700 bg-amber-50 border border-amber-100 font-bold px-2 py-0.5 rounded-full shrink-0">
                      <Clock className="h-2.5 w-2.5 mr-0.5" /> Pending
                    </span>
                  )}
                </div>

                {/* Specialty / Bio */}
                <div className="mt-4 space-y-2">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">
                      Specialty & Field
                    </span>
                    <span className="text-xs font-bold text-kishtwar-green-900 block truncate">
                      {c.specialty || "General Content Writer"}
                    </span>
                  </div>
                  {c.website && (
                    <a
                      href={c.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs text-kishtwar-emerald hover:text-kishtwar-green-700 font-semibold"
                    >
                      <Globe className="h-3.5 w-3.5 mr-1" />
                      Visit Portfolio
                    </a>
                  )}
                </div>

                {/* Social links row */}
                <div className="flex items-center space-x-3 mt-4 pt-3 border-t border-kishtwar-cream-100/50">
                  {c.socialFacebook && (
                    <a
                      href={c.socialFacebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors"
                      title="Facebook"
                    >
                      <svg className="h-4 w-4 fill-current text-gray-400 hover:text-[#1877f2]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                      </svg>
                    </a>
                  )}
                  {c.socialTwitter && (
                    <a
                      href={c.socialTwitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors"
                      title="Twitter / X"
                    >
                      <svg className="h-4 w-4 fill-current text-gray-400 hover:text-black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </a>
                  )}
                  {c.socialInstagram && (
                    <a
                      href={c.socialInstagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors"
                      title="Instagram"
                    >
                      <svg className="h-4 w-4 text-gray-400 hover:text-[#e1306c]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                      </svg>
                    </a>
                  )}
                  {c.socialYoutube && (
                    <a
                      href={c.socialYoutube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors"
                      title="YouTube"
                    >
                      <svg className="h-4 w-4 fill-current text-gray-400 hover:text-[#ff0000]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.518 3.5 12 3.5 12 3.5s-7.518 0-9.388.555A3.002 3.002 0 0 0 .502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.482 20.5 12 20.5 12 20.5s7.518 0 9.388-.555a3.002 3.002 0 0 0 2.11-2.108C24 15.93 24 12 24 12s0-3.93-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </a>
                  )}
                  {!c.socialFacebook && !c.socialTwitter && !c.socialInstagram && !c.socialYoutube && (
                    <span className="text-[10px] text-gray-400 font-medium">No social links attached</span>
                  )}
                </div>
              </div>

              {/* Action Button / Stats */}
              <div className="mt-6 pt-4 border-t border-kishtwar-cream-100 flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-500 font-light">
                  <Eye className="h-4 w-4 mr-1 text-gray-400" />
                  <span className="font-semibold text-gray-700 mr-1">{c.totalViews}</span> total views
                </div>

                {!c.verified && (
                  <button
                    onClick={() => handleApprove(c.userId, c.user.name)}
                    disabled={isPending && actionUserId === c.userId}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-kishtwar-green-900 hover:bg-kishtwar-green-950 text-white rounded-xl text-xs font-serif font-bold tracking-wide transition-all shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {isPending && actionUserId === c.userId ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin text-kishtwar-gold" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-3.5 w-3.5 text-kishtwar-gold" />
                        <span>Verify Profile</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-kishtwar-cream-200 rounded-3xl p-12 text-center text-gray-400 font-light text-sm shadow-xs">
          No contributors match your search criteria.
        </div>
      )}
    </div>
  );
}
