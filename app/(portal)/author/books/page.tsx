"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Globe,
  Tag,
  CalendarBlank,
  Barcode,
} from "@phosphor-icons/react";

interface Book {
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
  royalty_pending: number;
  print_partner: string | null;
  available_on: string[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 200, damping: 24 } },
};

export default function AuthorBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/books")
      .then((r) => r.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-32 bg-zinc-100 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-zinc-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          My Books
        </h1>
        <p className="text-sm text-muted mt-1">
          {books.length} title{books.length !== 1 ? "s" : ""} in your portfolio
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        {books.map((book) => (
          <motion.div
            key={book.book_id}
            variants={cardVariants}
            className="bg-surface border border-border rounded-2xl p-6 hover:border-zinc-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen size={18} className="text-accent shrink-0" weight="duotone" />
                  <h3 className="text-base font-semibold text-zinc-900 truncate">
                    {book.title}
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <Tag size={12} /> {book.genre}
                  </span>
                  {book.publication_date && (
                    <span className="flex items-center gap-1">
                      <CalendarBlank size={12} />{" "}
                      {new Date(book.publication_date).toLocaleDateString(
                        "en-IN",
                        { month: "short", year: "numeric" }
                      )}
                    </span>
                  )}
                </div>
              </div>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${
                  book.status === "Published & Live"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {book.status}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted mb-4">
              <Barcode size={12} />
              <span className="font-mono">{book.isbn}</span>
            </div>

            {book.status === "Published & Live" && (
              <>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-3 rounded-xl bg-zinc-50">
                    <p className="text-lg font-semibold font-mono text-zinc-900">
                      {book.total_copies_sold.toLocaleString("en-IN")}
                    </p>
                    <p className="text-[11px] text-muted">Copies Sold</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-zinc-50">
                    <p className="text-lg font-semibold font-mono text-zinc-900">
                      Rs {book.mrp}
                    </p>
                    <p className="text-[11px] text-muted">MRP</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-zinc-50">
                    <p className="text-lg font-semibold font-mono text-zinc-900">
                      Rs {book.author_royalty_per_copy}
                    </p>
                    <p className="text-[11px] text-muted">Per Copy</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm mb-4 px-1">
                  <span className="text-muted">Total Earned</span>
                  <span className="font-mono font-medium text-zinc-900">
                    Rs {book.total_royalty_earned.toLocaleString("en-IN")}
                  </span>
                </div>
                {book.royalty_pending > 0 && (
                  <div className="flex items-center justify-between text-sm px-1 mb-4">
                    <span className="text-muted">Pending</span>
                    <span className="font-mono font-medium text-amber-600">
                      Rs {book.royalty_pending.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                <div className="border-t border-border pt-3">
                  <p className="text-xs text-muted mb-2 flex items-center gap-1">
                    <Globe size={12} /> Available on
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {book.available_on.map((store) => (
                      <span
                        key={store}
                        className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600"
                      >
                        {store}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {book.status !== "Published & Live" && (
              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 text-center">
                <p className="text-sm text-amber-700">
                  This book is currently in the production pipeline.
                </p>
                <p className="text-xs text-amber-600 mt-1">
                  We will notify you when it progresses to the next stage.
                </p>
              </div>
            )}

            {book.print_partner && (
              <p className="text-xs text-muted mt-3">
                Print Partner: {book.print_partner}
              </p>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
