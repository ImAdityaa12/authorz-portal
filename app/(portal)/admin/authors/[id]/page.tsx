"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  EnvelopeSimple,
  Phone,
  MapPin,
  CalendarBlank,
  BookOpen,
  Globe,
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
    isbn: string;
    genre: string;
    publication_date: string | null;
    status: string;
    mrp: number | null;
    author_royalty_per_copy: number | null;
    total_copies_sold: number;
    total_royalty_earned: number;
    royalty_paid: number;
    royalty_pending: number;
    last_royalty_payout_date: string | null;
    print_partner: string | null;
    available_on: string[];
  }[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 200, damping: 24 } },
};

export default function AuthorDetail() {
  const params = useParams();
  const [author, setAuthor] = useState<Author | null>(null);

  useEffect(() => {
    fetch(`/api/authors?id=${params.id}`)
      .then((r) => r.json())
      .then(setAuthor);
  }, [params.id]);

  if (!author) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-24 bg-zinc-100 rounded animate-pulse" />
        <div className="h-40 bg-zinc-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  const totalSales = author.books.reduce((s, b) => s + b.total_copies_sold, 0);
  const totalEarned = author.books.reduce(
    (s, b) => s + b.total_royalty_earned,
    0
  );
  const totalPaid = author.books.reduce((s, b) => s + b.royalty_paid, 0);
  const totalPending = author.books.reduce((s, b) => s + b.royalty_pending, 0);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <Link
          href="/admin/authors"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-zinc-900 mb-4 transition-colors"
        >
          <ArrowLeft size={16} /> Back to authors
        </Link>
      </motion.div>

      {/* Author Profile */}
      <motion.div
        variants={itemVariants}
        className="bg-surface border border-border rounded-2xl p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent text-xl font-semibold mb-3">
              {author.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              {author.name}
            </h1>
            <p className="text-sm text-muted mt-1 font-mono">
              {author.author_id}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="text-center p-3 rounded-xl bg-zinc-50">
              <p className="text-xl font-semibold font-mono text-zinc-900">
                {author.books.length}
              </p>
              <p className="text-[11px] text-muted">Books</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-zinc-50">
              <p className="text-xl font-semibold font-mono text-zinc-900">
                {totalSales.toLocaleString("en-IN")}
              </p>
              <p className="text-[11px] text-muted">Copies Sold</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-zinc-50">
              <p className="text-xl font-semibold font-mono text-zinc-900">
                Rs {(totalEarned / 1000).toFixed(1)}k
              </p>
              <p className="text-[11px] text-muted">Total Earned</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-zinc-50">
              <p className={`text-xl font-semibold font-mono ${totalPending > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                Rs {(totalPending / 1000).toFixed(1)}k
              </p>
              <p className="text-[11px] text-muted">Pending</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 pt-5 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted">
            <EnvelopeSimple size={16} /> {author.email}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted">
            <Phone size={16} /> {author.phone}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted">
            <MapPin size={16} /> {author.city}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted">
            <CalendarBlank size={16} /> Joined{" "}
            {new Date(author.joined_date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
      </motion.div>

      {/* Books */}
      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900 mb-4">
          Books ({author.books.length})
        </h2>
        <div className="space-y-3">
          {author.books.map((book) => (
            <motion.div
              key={book.book_id}
              variants={itemVariants}
              className="bg-surface border border-border rounded-2xl p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen size={16} className="text-accent" weight="duotone" />
                    <h3 className="text-sm font-semibold text-zinc-900">
                      {book.title}
                    </h3>
                  </div>
                  <p className="text-xs text-muted">
                    {book.genre} | ISBN: {book.isbn}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    book.status === "Published & Live"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {book.status}
                </span>
              </div>

              {book.status === "Published & Live" && (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <p className="text-xs text-muted">MRP</p>
                    <p className="text-sm font-mono font-medium">Rs {book.mrp}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Copies Sold</p>
                    <p className="text-sm font-mono font-medium">
                      {book.total_copies_sold.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Total Earned</p>
                    <p className="text-sm font-mono font-medium">
                      Rs {book.total_royalty_earned.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Paid</p>
                    <p className="text-sm font-mono font-medium text-emerald-600">
                      Rs {book.royalty_paid.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Pending</p>
                    <p className={`text-sm font-mono font-medium ${book.royalty_pending > 0 ? "text-amber-600" : ""}`}>
                      Rs {book.royalty_pending.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              )}

              {book.available_on.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border flex items-center gap-2 flex-wrap">
                  <Globe size={12} className="text-muted" />
                  {book.available_on.map((s) => (
                    <span
                      key={s}
                      className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Payment Summary */}
      <motion.div
        variants={itemVariants}
        className="bg-surface border border-border rounded-2xl p-5"
      >
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900 mb-4">
          Payment Summary
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted">Total Royalties Earned</span>
            <span className="font-mono font-medium">
              Rs {totalEarned.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Total Paid</span>
            <span className="font-mono font-medium text-emerald-600">
              Rs {totalPaid.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex justify-between text-sm">
            <span className="font-medium text-zinc-900">Outstanding Balance</span>
            <span className={`font-mono font-semibold ${totalPending > 0 ? "text-amber-600" : "text-emerald-600"}`}>
              Rs {totalPending.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted mb-1.5">
            <span>Payment Progress</span>
            <span className="font-mono">
              {totalEarned > 0
                ? ((totalPaid / totalEarned) * 100).toFixed(1)
                : "0"}
              %
            </span>
          </div>
          <div className="h-2 rounded-full bg-zinc-100 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${
                  totalEarned > 0 ? (totalPaid / totalEarned) * 100 : 0
                }%`,
              }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full bg-emerald-500"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
