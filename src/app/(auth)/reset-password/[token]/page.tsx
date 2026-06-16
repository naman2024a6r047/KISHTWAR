"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff, Sparkles, ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{
    token: string;
  }>;
}

export default function ResetPasswordPage({ params }: PageProps) {
  const { token } = use(params);
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) return;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        setError(data.error || "Failed to reset password.");
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
          New Password
        </h2>
        <p className="text-xs text-gray-500 font-light">
          Set a secure, strong password for your account.
        </p>
      </div>

      {success ? (
        <div className="space-y-4 text-center py-4">
          <div className="w-12 h-12 bg-kishtwar-green-50 text-kishtwar-green-600 rounded-full flex items-center justify-center mx-auto border border-kishtwar-green-100">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h4 className="text-base font-serif font-bold text-kishtwar-green-950">
              Password Changed
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto font-light">
              Your password has been successfully reset. You can now log in using your new password.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-kishtwar-green-500 hover:bg-kishtwar-green-600 text-white font-serif font-bold text-xs shadow-sm transition-all"
          >
            Go to Log In
          </Link>
        </div>
      ) : (
        /* Form */
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-kishtwar-green-900 block">
              New Password
            </label>
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
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-655 cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-[10px] text-gray-400 leading-normal font-sans font-light mt-1">
              Must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number.
            </p>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-kishtwar-green-900 block">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-kishtwar-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-kishtwar-green-500 bg-white text-kishtwar-green-900 placeholder:text-gray-400"
                required
              />
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 font-medium leading-relaxed">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-kishtwar-green-500 hover:bg-kishtwar-green-600 text-white font-serif font-bold text-sm shadow-md transition-all disabled:opacity-50"
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}

      {/* Footer link */}
      {!success && (
        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center space-x-1.5 text-xs text-kishtwar-emerald hover:text-kishtwar-green-700 font-bold font-serif"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Log In</span>
          </Link>
        </div>
      )}
    </div>
  );
}
