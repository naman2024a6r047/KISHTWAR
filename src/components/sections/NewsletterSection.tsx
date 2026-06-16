"use client";

import { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
        setEmail("");
        setMessage("Welcome aboard! You have successfully subscribed to our newsletter.");
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to subscribe. Please check the email and try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Connection error. Please check your internet and try again.");
    }
  };

  return (
    <section className="relative py-24 bg-kishtwar-green-950 text-white overflow-hidden">
      {/* Background Mountain Photo Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20 scale-105 z-0" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1920')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-kishtwar-green-950 via-kishtwar-green-900/90 to-kishtwar-green-950 z-10" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 z-20">
        <div className="mx-auto h-12 w-12 rounded-2xl bg-white/10 text-kishtwar-gold flex items-center justify-center shadow-lg border border-white/5">
          <Mail className="h-6 w-6" />
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight">
            Keep Kishtwar in Your Inbox
          </h2>
          <p className="text-sm sm:text-base text-kishtwar-cream-200 max-w-lg mx-auto font-medium">
            Join our mailing list to receive curated travel guides, seasonal photography logs, cultural updates, and upcoming festival schedules.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubscribe} className="max-w-md mx-auto space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <input
              type="email"
              placeholder="Enter your email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-0 w-full"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-serif font-bold text-kishtwar-green-950 bg-kishtwar-gold hover:bg-kishtwar-gold-light transition-all disabled:opacity-50 shrink-0 select-none cursor-pointer"
            >
              <span>Subscribe</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </button>
          </div>

          {message && (
            <p
              className={cn(
                "text-xs font-semibold mt-2",
                status === "success" ? "text-kishtwar-emerald" : "text-red-400"
              )}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
