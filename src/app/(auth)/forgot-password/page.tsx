"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Sparkles, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        setError(data.error || "Failed to send reset email.");
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
          Reset Password
        </h2>
        <p className="text-xs text-gray-500 font-light">
          Enter your email to receive a password reset link.
        </p>
      </div>

      {success ? (
        <div className="space-y-4 text-center py-4">
          <div className="w-12 h-12 bg-kishtwar-green-50 text-kishtwar-green-600 rounded-full flex items-center justify-center mx-auto border border-kishtwar-green-100">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h4 className="text-base font-serif font-bold text-kishtwar-green-950">
              Check Your Inbox
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto font-light">
              If an account with that email exists, we have sent a password reset link. Please follow the instructions to choose a new password.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center space-x-1.5 text-xs text-kishtwar-emerald hover:text-kishtwar-green-700 font-bold font-serif"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Log In</span>
          </Link>
        </div>
      ) : (
        /* Form */
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

          {/* Error Message */}
          {error && (
            <div className="text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 font-medium">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-kishtwar-green-500 hover:bg-kishtwar-green-600 text-white font-serif font-bold text-sm shadow-md transition-all disabled:opacity-50"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
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
