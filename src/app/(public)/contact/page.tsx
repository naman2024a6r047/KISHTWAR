"use client";

import { useState } from "react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import MapEmbed from "@/components/common/MapEmbed";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import type { MapMarker } from "@/types";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          subject: subject || undefined,
          message,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        setName("");
        setEmail("");
        setPhone("");
        setSubject("");
        setMessage("");
      } else {
        setError(data.error || "Failed to send message.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tourism office location coordinate
  const officeCenter: [number, number] = [33.3135, 75.7661];
  const markers: MapMarker[] = [
    {
      id: 1,
      name: "Kishtwar District Tourism Office",
      slug: "tourism-office",
      type: "police", // Use general icon type
      lat: 33.3135,
      lng: 75.7661,
      description: "TRC building, Near Parade Ground, Kishtwar, J&K, 182204",
    },
  ];

  return (
    <main className="min-h-screen bg-kishtwar-cream/30 pb-16">
      {/* Banner / Header */}
      <section className="relative bg-kishtwar-green-900 text-white overflow-hidden py-16 sm:py-24">
        {/* Background Image / Overlay */}
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-15"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-kishtwar-green-950/50 via-kishtwar-green-900/90 to-kishtwar-green-900"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-kishtwar-gold/20 text-kishtwar-gold text-xs font-bold tracking-widest uppercase border border-kishtwar-gold/30">
            Reach Out
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight">
            Contact <span className="text-gradient-gold">Tourism Board</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-300 leading-relaxed font-light font-sans">
            Have questions about your upcoming trip to Kishtwar? Get in touch with our local travel guides and administrators.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-8">
        {/* Breadcrumbs */}
        <Breadcrumbs className="text-kishtwar-green-600 mb-6" />

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Info cards (Left column - 1 span) */}
          <div className="space-y-6">
            {/* Quick Contact Info */}
            <div className="bg-white rounded-3xl border border-kishtwar-cream-200 p-6 shadow-sm space-y-6">
              <h3 className="text-lg font-serif font-bold text-kishtwar-green-950 border-b border-kishtwar-cream-100 pb-2">
                Office Coordinates
              </h3>

              <div className="space-y-4">
                {/* Office Location */}
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-kishtwar-green-50 text-kishtwar-green-600 shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block leading-none mb-1">
                      Address
                    </span>
                    <span className="text-xs font-bold text-kishtwar-green-900 leading-relaxed">
                      Tourist Reception Centre (TRC),<br />
                      Near Parade Ground, Kishtwar,<br />
                      Jammu & Kashmir, India — 182204
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-kishtwar-green-50 text-kishtwar-green-600 shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block leading-none mb-1">
                      Email
                    </span>
                    <span className="text-xs font-bold text-kishtwar-green-900">
                      info@kishtwartourism.org
                    </span>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-kishtwar-green-50 text-kishtwar-green-600 shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block leading-none mb-1">
                      Helpline
                    </span>
                    <span className="text-xs font-bold text-kishtwar-green-900">
                      +91-1995-259124
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Traveler Support banner */}
            <div className="bg-gradient-to-br from-kishtwar-green-900 to-kishtwar-green-950 rounded-3xl p-6 text-white border border-kishtwar-green-800/80 shadow-md flex flex-col justify-between h-[230px]">
              <div>
                <span className="text-[10px] text-kishtwar-gold font-bold uppercase tracking-widest block mb-1">
                  Travel Support
                </span>
                <h4 className="text-lg font-serif font-bold mb-2">
                  Emergency Helpline
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed font-light">
                  For immediate assistance during winter treks, snow disruptions, or pilgrimage security, contact District Emergency Control.
                </p>
              </div>
              <div className="text-xl font-serif font-bold text-kishtwar-gold-light">
                100 / +91-1995-259220
              </div>
            </div>
          </div>

          {/* Form (Right column - 2 span) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-kishtwar-cream-200 p-6 sm:p-8 shadow-sm space-y-6 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-serif font-bold text-kishtwar-green-950 flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-kishtwar-emerald" />
                  <span>Send a Message</span>
                </h3>
                <p className="text-xs text-gray-500 font-light mt-1">
                  Have feedback, query, or would like to partner with us? Drop us a line.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 flex-1 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-kishtwar-green-900 block">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-kishtwar-cream-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-kishtwar-green-500 text-kishtwar-green-900 placeholder:text-gray-400"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-kishtwar-green-900 block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-kishtwar-cream-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-kishtwar-green-500 text-kishtwar-green-900 placeholder:text-gray-400"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-kishtwar-green-900 block">
                      Phone Number <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-kishtwar-cream-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-kishtwar-green-500 text-kishtwar-green-900 placeholder:text-gray-400"
                    />
                  </div>

                  {/* Subject */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-kishtwar-green-900 block">
                      Subject <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Machail Yatra guidelines query"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-kishtwar-cream-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-kishtwar-green-500 text-kishtwar-green-900 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-kishtwar-green-900 block">
                    Message Body
                  </label>
                  <textarea
                    placeholder="Enter details about your inquiry..."
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-kishtwar-cream-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-kishtwar-green-500 text-kishtwar-green-900 placeholder:text-gray-400 resize-none leading-relaxed"
                    required
                  />
                </div>

                {/* Status messages */}
                {error && (
                  <div className="text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 font-medium">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="text-xs text-kishtwar-green-700 bg-kishtwar-green-50 p-3 rounded-lg border border-kishtwar-green-100 font-medium">
                    Your inquiry has been successfully sent. We will review it and follow up shortly.
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-fit px-6 py-2.5 rounded-xl bg-kishtwar-green-500 hover:bg-kishtwar-green-600 text-white font-serif font-bold text-xs shadow-sm flex items-center justify-center space-x-1.5 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{isSubmitting ? "Sending message..." : "Send Message"}</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Tourism Office Interactive Map */}
        <div className="bg-white rounded-3xl border border-kishtwar-cream-200 p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-serif font-bold text-kishtwar-green-950 flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-kishtwar-emerald" />
            <span>Tourism Reception Centre Location Map</span>
          </h3>
          <MapEmbed markers={markers} center={officeCenter} zoom={13} height="320px" />
        </div>
      </div>
    </main>
  );
}
