"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"USER" | "CONTRIBUTOR">("USER");
  
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !username || !email || !password) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await register({
        name,
        username: username.toLowerCase().replace(/\s+/g, ""),
        email,
        password,
        role,
      });

      if (res.success) {
        setSuccess(true);
        // Clear input form
        setName("");
        setUsername("");
        setEmail("");
        setPassword("");
      } else {
        setError(res.error || "Registration failed. Try using a different username or email.");
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
          Create Account
        </h2>
        <p className="text-xs text-gray-500 font-light">
          Sign up to explore, write blogs, and save travel bookmarks.
        </p>
      </div>

      {success ? (
        <div className="space-y-4 text-center py-4">
          <div className="w-12 h-12 bg-kishtwar-green-50 text-kishtwar-green-600 rounded-full flex items-center justify-center mx-auto border border-kishtwar-green-100">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h4 className="text-base font-serif font-bold text-kishtwar-green-950">
              Registration Successful!
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto font-light">
              We have sent a verification link to your email address. Please check your inbox (and spam folder) to activate your account.
            </p>
          </div>
          <Link
            href={`/login${redirect !== "/" ? `?redirect=${redirect}` : ""}`}
            className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-kishtwar-green-500 hover:bg-kishtwar-green-600 text-white font-serif font-bold text-xs shadow-sm transition-all"
          >
            Go to Log In
          </Link>
        </div>
      ) : (
        /* Form */
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-kishtwar-green-900 block">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-kishtwar-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-kishtwar-green-500 bg-white text-kishtwar-green-900 placeholder:text-gray-400"
                required
              />
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Username */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-kishtwar-green-900 block">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-kishtwar-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-kishtwar-green-500 bg-white text-kishtwar-green-900 placeholder:text-gray-400"
                required
              />
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-kishtwar-green-900 block">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-kishtwar-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-kishtwar-green-500 bg-white text-kishtwar-green-900 placeholder:text-gray-400"
                required
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-kishtwar-green-900 block">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2 rounded-xl border border-kishtwar-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-kishtwar-green-500 bg-white text-kishtwar-green-900 placeholder:text-gray-400"
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

          {/* Account Role Selector */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-semibold text-kishtwar-green-900 block">
              Join as...
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("USER")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border text-center ${
                  role === "USER"
                    ? "bg-kishtwar-green-900 text-white border-kishtwar-green-900"
                    : "bg-white text-kishtwar-green-700 border-kishtwar-cream-200 hover:bg-kishtwar-green-50/50"
                }`}
              >
                Visitor / Traveler
              </button>
              <button
                type="button"
                onClick={() => setRole("CONTRIBUTOR")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border text-center ${
                  role === "CONTRIBUTOR"
                    ? "bg-kishtwar-green-900 text-white border-kishtwar-green-900"
                    : "bg-white text-kishtwar-green-700 border-kishtwar-cream-200 hover:bg-kishtwar-green-50/50"
                }`}
              >
                Writer / Photographer
              </button>
            </div>
            {role === "CONTRIBUTOR" && (
              <p className="text-[10px] text-kishtwar-gold font-medium leading-relaxed font-sans mt-1">
                Note: Contributor accounts must be approved by administrators before stories are published.
              </p>
            )}
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
            {isSubmitting ? "Registering..." : "Sign Up"}
          </button>
        </form>
      )}

      {/* Footer link */}
      {!success && (
        <div className="text-center text-xs text-gray-500 font-light">
          Already have an account?{" "}
          <Link
            href={`/login${redirect !== "/" ? `?redirect=${redirect}` : ""}`}
            className="text-kishtwar-emerald hover:text-kishtwar-green-700 font-bold font-serif"
          >
            Log In
          </Link>
        </div>
      )}
    </div>
  );
}
