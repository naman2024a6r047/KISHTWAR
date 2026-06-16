"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Sparkles, XCircle, Loader2 } from "lucide-react";

interface PageProps {
  params: Promise<{
    token: string;
  }>;
}

export default function VerifyEmailPage({ params }: PageProps) {
  const { token } = use(params);
  const [status, setStatus] = useState<"loading" | "success" | "error">(token ? "loading" : "error");
  const [message, setMessage] = useState(token ? "" : "Verification token is missing.");

  useEffect(() => {
    if (!token) return;

    const verifyToken = async () => {
      try {
        const res = await fetch(`/api/auth/verify-email/${token}`);
        const data = await res.json();

        if (res.ok && data.success) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
        } else {
          setStatus("error");
          setMessage(data.error || "Verification failed. The link may have expired or is invalid.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("An unexpected error occurred. Please try again.");
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="space-y-6 text-center py-4">
      {status === "loading" && (
        <div className="space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-kishtwar-emerald mx-auto" />
          <div className="space-y-1.5">
            <h3 className="text-xl font-serif font-bold text-kishtwar-green-950">
              Verifying Email
            </h3>
            <p className="text-xs text-gray-500 font-light max-w-xs mx-auto">
              Please wait while we verify your email address and activate your account.
            </p>
          </div>
        </div>
      )}

      {status === "success" && (
        <div className="space-y-4 animate-fade-in">
          <div className="w-12 h-12 bg-kishtwar-green-50 text-kishtwar-green-600 rounded-full flex items-center justify-center mx-auto border border-kishtwar-green-100">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-xl font-serif font-bold text-kishtwar-green-950">
              Account Activated!
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto font-light">
              {message}
            </p>
          </div>
          <Link
            href="/login"
            className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-kishtwar-green-500 hover:bg-kishtwar-green-600 text-white font-serif font-bold text-xs shadow-sm transition-all"
          >
            Log In to Account
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-4 animate-fade-in">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-100">
            <XCircle className="h-6 w-6" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-xl font-serif font-bold text-kishtwar-green-950">
              Verification Failed
            </h3>
            <p className="text-xs text-red-650 leading-relaxed max-w-xs mx-auto font-medium">
              {message}
            </p>
          </div>
          <Link
            href="/login"
            className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-kishtwar-green-500 hover:bg-kishtwar-green-600 text-white font-serif font-bold text-xs shadow-sm transition-all"
          >
            Go to Log In
          </Link>
        </div>
      )}
    </div>
  );
}
