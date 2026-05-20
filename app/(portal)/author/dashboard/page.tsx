"use client";

import { useAuth } from "@/components/auth-provider";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Books,
  CurrencyInr,
  TrendUp,
  Ticket,
  ArrowRight,
} from "@phosphor-icons/react";
import Link from "next/link";

interface Stats {
  totalBooks: number;
  publishedBooks: number;
  inProductionBooks: number;
  totalCopiesSold: number;
  totalRoyaltyEarned: number;
  totalRoyaltyPaid: number;
  totalRoyaltyPending: number;
  openTickets: number;
  totalTickets: number;
}

interface Book {
  book_id: string;
  title: string;
  status: string;
  total_copies_sold: number;
  total_royalty_earned: number;
  genre: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 200, damping: 24 } },
};

export default function AuthorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetch("/api/stats").then((r) => r.json()).then(setStats);
    fetch("/api/books").then((r) => r.json()).then(setBooks);
  }, []);

  if (!stats) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-zinc-100 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-zinc-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Published Books",
      value: stats.publishedBooks,
      sub: `${stats.inProductionBooks} in production`,
      icon: Books,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Copies Sold",
      value: stats.totalCopiesSold.toLocaleString("en-IN"),
      sub: "Across all titles",
      icon: TrendUp,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Royalties",
      value: `Rs ${stats.totalRoyaltyEarned.toLocaleString("en-IN")}`,
      sub: `Rs ${stats.totalRoyaltyPending.toLocaleString("en-IN")} pending`,
      icon: CurrencyInr,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Support Tickets",
      value: stats.openTickets,
      sub: `${stats.totalTickets} total`,
      icon: Ticket,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Welcome back, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-sm text-muted mt-1">
          Here is a summary of your publishing activity.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <motion.div
            key={card.label}
            variants={itemVariants}
            className="p-5 rounded-2xl bg-surface border border-border hover:border-zinc-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                <card.icon size={20} className={card.color} weight="duotone" />
              </div>
            </div>
            <p className="text-2xl font-semibold tracking-tight text-zinc-900 font-mono">
              {card.value}
            </p>
            <p className="text-sm text-muted mt-0.5">{card.label}</p>
            <p className="text-xs text-zinc-400 mt-1">{card.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Books List */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
            Your Books
          </h2>
          <Link
            href="/author/books"
            className="text-sm text-accent hover:text-accent-dark font-medium flex items-center gap-1"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="divide-y divide-border">
            {books.map((book, index) => (
              <motion.div
                key={book.book_id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 hover:bg-zinc-50/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 truncate">
                    {book.title}
                  </p>
                  <p className="text-xs text-muted mt-0.5">{book.genre}</p>
                </div>
                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-mono font-medium text-zinc-900">
                      {book.total_copies_sold.toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-muted">copies sold</p>
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
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
