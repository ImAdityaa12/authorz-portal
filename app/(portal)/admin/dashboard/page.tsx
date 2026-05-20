"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Books,
  CurrencyInr,
  TrendUp,
  Ticket,
  ArrowRight,
  Factory,
} from "@phosphor-icons/react";
import Link from "next/link";

interface AdminStats {
  totalAuthors: number;
  totalBooks: number;
  publishedBooks: number;
  inProductionBooks: number;
  totalCopiesSold: number;
  totalRoyaltyEarned: number;
  totalRoyaltyPaid: number;
  totalRoyaltyPending: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
}

interface Author {
  author_id: string;
  name: string;
  city: string;
  joined_date: string;
  books: {
    total_copies_sold: number;
    total_royalty_earned: number;
    status: string;
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

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [authors, setAuthors] = useState<Author[]>([]);

  useEffect(() => {
    fetch("/api/stats").then((r) => r.json()).then(setStats);
    fetch("/api/authors").then((r) => r.json()).then(setAuthors);
  }, []);

  if (!stats) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-zinc-100 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 bg-zinc-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Authors",
      value: stats.totalAuthors,
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Published Books",
      value: stats.publishedBooks,
      sub: `${stats.inProductionBooks} in production`,
      icon: Books,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Copies Sold",
      value: stats.totalCopiesSold.toLocaleString("en-IN"),
      icon: TrendUp,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "Total Revenue",
      value: `Rs ${stats.totalRoyaltyEarned.toLocaleString("en-IN")}`,
      sub: `Rs ${stats.totalRoyaltyPending.toLocaleString("en-IN")} pending`,
      icon: CurrencyInr,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Open Tickets",
      value: stats.openTickets,
      sub: `${stats.inProgressTickets} in progress`,
      icon: Ticket,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
    {
      label: "In Production",
      value: stats.inProductionBooks,
      icon: Factory,
      color: "text-teal-600",
      bg: "bg-teal-50",
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
          Admin Dashboard
        </h1>
        <p className="text-sm text-muted mt-1">
          Overview of BookLeaf publishing operations
        </p>
      </motion.div>

      {/* Stats Grid - asymmetric */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <motion.div
            key={card.label}
            variants={itemVariants}
            className="p-5 rounded-2xl bg-surface border border-border hover:border-zinc-300 transition-colors"
          >
            <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
              <card.icon size={20} className={card.color} weight="duotone" />
            </div>
            <p className="text-2xl font-semibold tracking-tight text-zinc-900 font-mono">
              {card.value}
            </p>
            <p className="text-sm text-muted">{card.label}</p>
            {card.sub && <p className="text-xs text-zinc-400 mt-0.5">{card.sub}</p>}
          </motion.div>
        ))}
      </div>

      {/* Top Authors */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
            Authors
          </h2>
          <Link
            href="/admin/authors"
            className="text-sm text-accent hover:text-accent-dark font-medium flex items-center gap-1"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-zinc-50/50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                    Author
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                    City
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                    Books
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                    Total Sales
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                    Royalty Earned
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {authors.map((author) => {
                  const totalSales = author.books.reduce(
                    (s, b) => s + b.total_copies_sold,
                    0
                  );
                  const totalRoyalty = author.books.reduce(
                    (s, b) => s + b.total_royalty_earned,
                    0
                  );
                  return (
                    <tr
                      key={author.author_id}
                      className="hover:bg-zinc-50/50 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/admin/authors/${author.author_id}`}
                          className="font-medium text-zinc-900 hover:text-accent transition-colors"
                        >
                          {author.name}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-muted">{author.city}</td>
                      <td className="px-5 py-3.5 text-right font-mono">
                        {author.books.length}
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono">
                        {totalSales.toLocaleString("en-IN")}
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono font-medium">
                        Rs {totalRoyalty.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="md:hidden divide-y divide-border">
            {authors.map((author) => {
              const totalSales = author.books.reduce(
                (s, b) => s + b.total_copies_sold, 0
              );
              const totalRoyalty = author.books.reduce(
                (s, b) => s + b.total_royalty_earned, 0
              );
              return (
                <Link
                  key={author.author_id}
                  href={`/admin/authors/${author.author_id}`}
                  className="block p-4 hover:bg-zinc-50/50 transition-colors"
                >
                  <p className="font-medium text-zinc-900">{author.name}</p>
                  <p className="text-xs text-muted">{author.city}</p>
                  <div className="flex gap-4 mt-2 text-xs">
                    <span className="font-mono">{author.books.length} books</span>
                    <span className="font-mono">{totalSales.toLocaleString("en-IN")} sold</span>
                    <span className="font-mono">Rs {totalRoyalty.toLocaleString("en-IN")}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
