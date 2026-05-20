"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CurrencyInr,
  ArrowUp,
  Clock,
  CheckCircle,
} from "@phosphor-icons/react";

interface RoyaltyBook {
  book_id: string;
  title: string;
  total_copies_sold: number;
  royalty_per_copy: number | null;
  total_earned: number;
  paid: number;
  pending: number;
  last_payout: string | null;
}

interface RoyaltySummary {
  total_earned: number;
  total_paid: number;
  total_pending: number;
  books: RoyaltyBook[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 200, damping: 24 } },
};

export default function AuthorRoyalties() {
  const [data, setData] = useState<RoyaltySummary | null>(null);

  useEffect(() => {
    fetch("/api/royalties")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-40 bg-zinc-100 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-zinc-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const paymentRate =
    data.total_earned > 0
      ? ((data.total_paid / data.total_earned) * 100).toFixed(1)
      : "0";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Royalty Reports
        </h1>
        <p className="text-sm text-muted mt-1">
          Track your earnings across all published titles.
        </p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          variants={itemVariants}
          className="p-5 rounded-2xl bg-surface border border-border"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
            <ArrowUp size={20} className="text-emerald-600" weight="bold" />
          </div>
          <p className="text-2xl font-semibold font-mono tracking-tight text-zinc-900">
            Rs {data.total_earned.toLocaleString("en-IN")}
          </p>
          <p className="text-sm text-muted">Total Earned</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="p-5 rounded-2xl bg-surface border border-border"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
            <CheckCircle size={20} className="text-blue-600" weight="duotone" />
          </div>
          <p className="text-2xl font-semibold font-mono tracking-tight text-zinc-900">
            Rs {data.total_paid.toLocaleString("en-IN")}
          </p>
          <p className="text-sm text-muted">
            Paid Out ({paymentRate}%)
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="p-5 rounded-2xl bg-surface border border-border"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
            <Clock size={20} className="text-amber-600" weight="duotone" />
          </div>
          <p className="text-2xl font-semibold font-mono tracking-tight text-zinc-900">
            Rs {data.total_pending.toLocaleString("en-IN")}
          </p>
          <p className="text-sm text-muted">Pending Payout</p>
        </motion.div>
      </div>

      {/* Royalty Breakdown Table */}
      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900 mb-4">
          Breakdown by Book
        </h2>
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-zinc-50/50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                    Book
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                    Copies Sold
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                    Per Copy
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                    Earned
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                    Paid
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                    Pending
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                    Last Payout
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.books.map((book) => (
                  <tr key={book.book_id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-zinc-900">
                      {book.title}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono">
                      {book.total_copies_sold.toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono">
                      Rs {book.royalty_per_copy}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono font-medium">
                      Rs {book.total_earned.toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono text-emerald-600">
                      Rs {book.paid.toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono text-amber-600">
                      {book.pending > 0
                        ? `Rs ${book.pending.toLocaleString("en-IN")}`
                        : "-"}
                    </td>
                    <td className="px-5 py-3.5 text-right text-muted">
                      {book.last_payout
                        ? new Date(book.last_payout).toLocaleDateString(
                            "en-IN",
                            { day: "numeric", month: "short", year: "numeric" }
                          )
                        : "Never"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-border">
            {data.books.map((book) => (
              <div key={book.book_id} className="p-4">
                <p className="font-medium text-zinc-900 mb-2">{book.title}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-muted">Copies</p>
                    <p className="font-mono">{book.total_copies_sold.toLocaleString("en-IN")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Earned</p>
                    <p className="font-mono">Rs {book.total_earned.toLocaleString("en-IN")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Paid</p>
                    <p className="font-mono text-emerald-600">Rs {book.paid.toLocaleString("en-IN")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Pending</p>
                    <p className="font-mono text-amber-600">
                      {book.pending > 0 ? `Rs ${book.pending.toLocaleString("en-IN")}` : "-"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Payment Schedule Info */}
      <motion.div
        variants={itemVariants}
        className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100"
      >
        <div className="flex items-start gap-3">
          <CurrencyInr size={20} className="text-emerald-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-emerald-900">
              Royalty Payment Schedule
            </p>
            <p className="text-sm text-emerald-700 mt-1">
              Royalties are processed on a quarterly basis. Payments are initiated
              within 15 business days after the end of each quarter. Minimum
              payout threshold is Rs 1,000.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
