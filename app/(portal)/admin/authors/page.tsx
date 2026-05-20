"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  MagnifyingGlass,
  ArrowRight,
  MapPin,
  CalendarBlank,
  Books,
} from "@phosphor-icons/react";

interface Author {
  author_id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  joined_date: string;
  books: {
    book_id: string;
    title: string;
    status: string;
    total_copies_sold: number;
    total_royalty_earned: number;
    royalty_pending: number;
  }[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 200, damping: 24 } },
};

export default function AdminAuthors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/authors")
      .then((r) => r.json())
      .then((data) => {
        setAuthors(data);
        setLoading(false);
      });
  }, []);

  const filtered = authors.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.city.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-32 bg-zinc-100 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-zinc-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Author Management
        </h1>
        <p className="text-sm text-muted mt-1">
          {authors.length} registered authors
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="relative max-w-sm">
        <MagnifyingGlass
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          size={18}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, city, or email..."
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-white text-sm placeholder:text-zinc-400 focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors outline-none"
        />
      </motion.div>

      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        {filtered.map((author) => {
          const totalSales = author.books.reduce(
            (s, b) => s + b.total_copies_sold,
            0
          );
          const totalEarned = author.books.reduce(
            (s, b) => s + b.total_royalty_earned,
            0
          );
          const totalPending = author.books.reduce(
            (s, b) => s + b.royalty_pending,
            0
          );

          return (
            <motion.div
              key={author.author_id}
              variants={itemVariants}
              className="bg-surface border border-border rounded-2xl p-5 hover:border-zinc-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-zinc-900">
                    {author.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {author.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarBlank size={12} /> Joined{" "}
                      {new Date(author.joined_date).toLocaleDateString(
                        "en-IN",
                        { month: "short", year: "numeric" }
                      )}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/admin/authors/${author.author_id}`}
                  className="text-xs text-accent hover:text-accent-dark font-medium flex items-center gap-1"
                >
                  View <ArrowRight size={12} />
                </Link>
              </div>

              <div className="text-xs text-muted mb-4 space-y-0.5">
                <p>{author.email}</p>
                <p>{author.phone}</p>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div className="text-center p-2.5 rounded-xl bg-zinc-50">
                  <p className="text-base font-semibold font-mono text-zinc-900">
                    {author.books.length}
                  </p>
                  <p className="text-[10px] text-muted">Books</p>
                </div>
                <div className="text-center p-2.5 rounded-xl bg-zinc-50">
                  <p className="text-base font-semibold font-mono text-zinc-900">
                    {totalSales.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[10px] text-muted">Sales</p>
                </div>
                <div className="text-center p-2.5 rounded-xl bg-zinc-50">
                  <p className="text-base font-semibold font-mono text-zinc-900">
                    Rs {(totalEarned / 1000).toFixed(1)}k
                  </p>
                  <p className="text-[10px] text-muted">Earned</p>
                </div>
                <div className="text-center p-2.5 rounded-xl bg-zinc-50">
                  <p className={`text-base font-semibold font-mono ${totalPending > 0 ? "text-amber-600" : "text-zinc-900"}`}>
                    Rs {(totalPending / 1000).toFixed(1)}k
                  </p>
                  <p className="text-[10px] text-muted">Pending</p>
                </div>
              </div>

              {/* Book titles */}
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted flex items-center gap-1 mb-1.5">
                  <Books size={12} /> Books
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {author.books.map((b) => (
                    <span
                      key={b.book_id}
                      className={`text-[11px] px-2 py-0.5 rounded-full ${
                        b.status === "Published & Live"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {b.title}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
