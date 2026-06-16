import { getAdminStats, getAnalyticsData } from "@/actions/admin.actions";
import StatsCard from "@/components/cards/StatsCard";
import { ViewsChart, ContentChart } from "@/components/common/ChartWrapper";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import {
  Users,
  Sparkles,
  MapPin,
  BookOpen,
  Eye,
  ShieldAlert,
  Clock,
  ArrowRight,
  Settings,
  Home,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export const revalidate = 0; // Dynamic rendering for dashboards

export default async function AdminOverviewPage() {
  const [statsRes, analyticsRes] = await Promise.all([
    getAdminStats(),
    getAnalyticsData(),
  ]);

  if (!statsRes.success || !statsRes.data) {
    return (
      <div className="p-6 text-center bg-red-50 rounded-2xl border border-red-200">
        <h2 className="text-lg font-bold text-red-800">Failed to load stats</h2>
        <p className="text-sm text-red-650 mt-1">{statsRes.error || "Please try again later."}</p>
      </div>
    );
  }

  const stats = statsRes.data;
  const analytics = analyticsRes.data || { viewsOverTime: [], contentDistribution: [] };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header and Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-kishtwar-green-950">
            Admin Overview
          </h1>
          <Breadcrumbs className="text-kishtwar-green-600 mt-1" />
        </div>
        <div className="flex space-x-2 text-xs">
          <Link
            href="/admin/settings"
            className="flex items-center space-x-1 px-4 py-2 bg-white border border-kishtwar-cream-200 hover:border-kishtwar-cream-300 text-gray-700 rounded-xl font-medium transition-all"
          >
            <Settings className="h-3.5 w-3.5" />
            <span>Site Settings</span>
          </Link>
          <Link
            href="/admin/homepage"
            className="flex items-center space-x-1 px-4 py-2 bg-kishtwar-green-900 hover:bg-kishtwar-green-950 text-white rounded-xl font-medium transition-all"
          >
            <Home className="h-3.5 w-3.5 text-kishtwar-gold" />
            <span>Customize Home</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Total Platform Users"
          value={stats.totalUsers}
          description="Registered visitors & authors"
          icon={Users}
          iconClassName="text-blue-600 bg-blue-50 border-blue-100"
        />
        <StatsCard
          title="Verified Contributors"
          value={stats.totalContributors}
          description="Approved content writers"
          icon={Sparkles}
          iconClassName="text-amber-500 bg-amber-50 border-amber-100"
        />
        <StatsCard
          title="Total Page Views"
          value={stats.totalPageViews}
          description="Accumulated platform hits"
          icon={Eye}
          iconClassName="text-emerald-600 bg-emerald-50 border-emerald-100"
        />
        <StatsCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          description="Blogs & destinations waiting"
          icon={ShieldAlert}
          iconClassName="text-red-500 bg-red-50 border-red-100"
        />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-kishtwar-cream-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-serif font-bold text-kishtwar-green-950">
              Page Views (Last 30 Days)
            </h2>
            <p className="text-[10px] sm:text-xs text-gray-400 font-medium">
              Daily traffic activity across all public routes
            </p>
          </div>
          <ViewsChart data={analytics.viewsOverTime} />
        </div>

        <div className="bg-white border border-kishtwar-cream-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-serif font-bold text-kishtwar-green-950">
              Content Distribution
            </h2>
            <p className="text-[10px] sm:text-xs text-gray-400 font-medium">
              Ratio of categories in our database
            </p>
          </div>
          <ContentChart data={analytics.contentDistribution} />
        </div>
      </div>

      {/* Logs and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white border border-kishtwar-cream-200 rounded-3xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-base font-serif font-bold text-kishtwar-green-950">
                  Recent Activities
                </h2>
                <p className="text-[10px] sm:text-xs text-gray-400 font-medium">
                  Real-time action logs across the platform
                </p>
              </div>
              <span className="text-[10px] font-bold text-kishtwar-emerald bg-kishtwar-emerald/15 px-2.5 py-1 rounded-full border border-kishtwar-emerald/20 flex items-center gap-1.5 uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-kishtwar-emerald animate-pulse" /> Live
              </span>
            </div>

            <div className="space-y-4">
              {stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start space-x-3 text-xs sm:text-sm border-b border-kishtwar-cream-100/50 pb-3 last:border-b-0 last:pb-0"
                  >
                    {log.user?.avatar ? (
                      <img
                        src={log.user.avatar}
                        alt={log.user.name}
                        className="h-8 w-8 rounded-full object-cover border border-kishtwar-cream-200"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-kishtwar-green-800 text-kishtwar-gold flex items-center justify-center font-bold text-[10px] border border-kishtwar-green-700">
                        {log.user?.name ? log.user.name.charAt(0) : "S"}
                      </div>
                    )}
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-kishtwar-green-950 truncate">
                          {log.user?.name || "System Process"}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium flex items-center shrink-0 ml-2">
                          <Clock className="h-3 w-3 mr-0.5 text-gray-300" />
                          {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs font-light">
                        Action: <span className="font-semibold text-gray-700">{log.action}</span>
                        {log.entityType && (
                          <>
                            {" "}
                            on {log.entityType} (ID: {log.entityId})
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-6 text-gray-400 text-xs font-light">
                  No recent activities recorded.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Admin Shortcuts Panel */}
        <div className="bg-white border border-kishtwar-cream-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-serif font-bold text-kishtwar-green-950">
              Moderation & Quick Actions
            </h2>
            <p className="text-[10px] sm:text-xs text-gray-400 font-medium">
              Expedited links for high priority actions
            </p>
          </div>

          <div className="space-y-2 text-xs sm:text-sm font-medium">
            <Link
              href="/admin/places?status=SUBMITTED"
              className="flex items-center justify-between p-3.5 bg-kishtwar-cream/20 hover:bg-kishtwar-cream/40 border border-kishtwar-cream-200/60 hover:border-kishtwar-cream-300 rounded-2xl transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-50 rounded-xl border border-amber-100 text-amber-600">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-kishtwar-green-950 font-bold block">Approve Destinations</span>
                  <span className="text-[10px] text-gray-400 font-medium">Review submitted place edits</span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/admin/blogs?status=SUBMITTED"
              className="flex items-center justify-between p-3.5 bg-kishtwar-cream/20 hover:bg-kishtwar-cream/40 border border-kishtwar-cream-200/60 hover:border-kishtwar-cream-300 rounded-2xl transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-xl border border-blue-100 text-blue-600">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-kishtwar-green-950 font-bold block">Moderate Stories</span>
                  <span className="text-[10px] text-gray-400 font-medium">Review contributor blog drafts</span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/admin/comments"
              className="flex items-center justify-between p-3.5 bg-kishtwar-cream/20 hover:bg-kishtwar-cream/40 border border-kishtwar-cream-200/60 hover:border-kishtwar-cream-300 rounded-2xl transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-600">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-kishtwar-green-950 font-bold block">Moderate Comments</span>
                  <span className="text-[10px] text-gray-400 font-medium">Manage user remarks</span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/admin/reports"
              className="flex items-center justify-between p-3.5 bg-kishtwar-cream/20 hover:bg-kishtwar-cream/40 border border-kishtwar-cream-200/60 hover:border-kishtwar-cream-300 rounded-2xl transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-50 rounded-xl border border-red-100 text-red-500">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-kishtwar-green-950 font-bold block">Reported Issues</span>
                  <span className="text-[10px] text-gray-400 font-medium">Review spam flag complaints</span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
