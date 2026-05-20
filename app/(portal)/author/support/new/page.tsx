"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  PaperPlaneTilt,
  CircleNotch,
} from "@phosphor-icons/react";
import Link from "next/link";

const categories = [
  { value: "royalty_query", label: "Royalty Query" },
  { value: "book_status", label: "Book Status" },
  { value: "technical_issue", label: "Technical Issue" },
  { value: "account_update", label: "Account Update" },
  { value: "general", label: "General" },
];

export default function NewTicket() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("general");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message, category }),
      });

      if (res.ok) {
        router.push("/author/support");
      } else {
        setError("Failed to create ticket. Please try again.");
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl"
    >
      <Link
        href="/author/support"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-zinc-900 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to tickets
      </Link>

      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 mb-1">
        Create Support Ticket
      </h1>
      <p className="text-sm text-muted mb-8">
        Our team typically responds within 24-48 hours.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-border bg-white text-sm focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors outline-none appearance-none cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Brief description of your issue"
            className="w-full h-11 px-4 rounded-xl border border-border bg-white text-sm placeholder:text-zinc-400 focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your issue in detail..."
            rows={6}
            className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm placeholder:text-zinc-400 focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors outline-none resize-none"
            required
          />
        </div>

        {error && (
          <p className="text-sm text-danger bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 active:scale-[0.98] transition-all disabled:opacity-60"
        >
          {loading ? (
            <CircleNotch size={18} className="animate-spin" />
          ) : (
            <>
              <PaperPlaneTilt size={16} weight="bold" />
              Submit Ticket
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
