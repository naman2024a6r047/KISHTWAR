"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await login(email, password);
      if (res.success) {
        router.push(redirect);
        router.refresh();
      } else {
        setError(res.error || "Invalid email or password.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-serif font-bold text-kishtwar-green-950">
          Welcome Back
        </h2>
        <p className="text-xs text-gray-500 font-light">
          Log in to write stories, reviews, and bookmarks.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-kishtwar-green-900 block">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-kishtwar-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-kishtwar-green-500 bg-white text-kishtwar-green-900 placeholder:text-gray-400"
              required
            />
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-kishtwar-green-900">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-kishtwar-emerald hover:text-kishtwar-green-700 font-semibold"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-kishtwar-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-kishtwar-green-500 bg-white text-kishtwar-green-900 placeholder:text-gray-400"
              required
            />
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-650 cursor-pointer"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 font-medium leading-relaxed">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-xl bg-kishtwar-green-500 hover:bg-kishtwar-green-600 text-white font-serif font-bold text-sm shadow-md transition-all disabled:opacity-50"
        >
          {isSubmitting ? "Logging in..." : "Log In"}
        </button>
      </form>

      {/* Footer link */}
      <div className="text-center text-xs text-gray-500 font-light">
        Don&apos;t have an account?{" "}
        <Link
          href={`/register${redirect !== "/" ? `?redirect=${redirect}` : ""}`}
          className="text-kishtwar-emerald hover:text-kishtwar-green-700 font-bold font-serif"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
