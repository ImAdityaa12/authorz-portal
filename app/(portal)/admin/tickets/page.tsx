"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Funnel,
  Clock,
  ChatCircleDots,
  CheckCircle,
  ArrowRight,
  WarningCircle,
} from "@phosphor-icons/react";

interface Ticket {
  id: string;
  author_id: string;
  author_name: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  messages: { id: string; sender: string; message: string; timestamp: string }[];
  created_at: string;
  updated_at: string;
}

const priorityColors: Record<string, string> = {
  low: "bg-zinc-100 text-zinc-600",
  medium: "bg-blue-50 text-blue-700",
  high: "bg-amber-50 text-amber-700",
  urgent: "bg-red-50 text-red-700",
};

const statusColors: Record<string, string> = {
  open: "text-amber-500",
  in_progress: "text-blue-500",
  resolved: "text-emerald-500",
  closed: "text-zinc-400",
};

const categoryLabels: Record<string, string> = {
  royalty_query: "Royalty",
  book_status: "Book Status",
  technical_issue: "Technical",
  account_update: "Account",
  general: "General",
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 200, damping: 24 } },
};

export default function AdminTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  useEffect(() => {
    fetch("/api/tickets")
      .then((r) => r.json())
      .then((data) => {
        setTickets(data);
        setLoading(false);
      });
  }, []);

  const filtered = tickets.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
    return true;
  });

  const openCount = tickets.filter((t) => t.status === "open").length;
  const urgentCount = tickets.filter((t) => t.priority === "urgent" || t.priority === "high").length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-40 bg-zinc-100 rounded-lg animate-pulse" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-zinc-100 rounded-2xl animate-pulse" />
        ))}
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
          Ticket Management
        </h1>
        <div className="flex items-center gap-3 mt-1">
          <p className="text-sm text-muted">
            {tickets.length} total tickets
          </p>
          {openCount > 0 && (
            <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">
              {openCount} open
            </span>
          )}
          {urgentCount > 0 && (
            <span className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
              <WarningCircle size={12} /> {urgentCount} high priority
            </span>
          )}
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Funnel size={16} className="text-muted" />
          <span className="text-xs text-muted">Status:</span>
          {["all", "open", "in_progress", "resolved", "closed"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === s
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {s === "all" ? "All" : s === "in_progress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">Priority:</span>
          {["all", "urgent", "high", "medium", "low"].map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                priorityFilter === p
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {p === "all" ? "All" : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tickets Table */}
      <motion.div variants={itemVariants}>
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-zinc-50/50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                    Ticket
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                    Author
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-center px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="text-center px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-zinc-50/50 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-zinc-900 truncate max-w-[250px]">
                        {ticket.subject}
                      </p>
                      <p className="text-xs text-muted font-mono">{ticket.id}</p>
                    </td>
                    <td className="px-5 py-3.5 text-muted">
                      {ticket.author_name}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
                        {categoryLabels[ticket.category] || ticket.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          priorityColors[ticket.priority]
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      {ticket.status === "open" && (
                        <Clock size={16} className={statusColors[ticket.status]} />
                      )}
                      {ticket.status === "in_progress" && (
                        <ChatCircleDots
                          size={16}
                          className={statusColors[ticket.status]}
                        />
                      )}
                      {(ticket.status === "resolved" || ticket.status === "closed") && (
                        <CheckCircle
                          size={16}
                          className={statusColors[ticket.status]}
                          weight="fill"
                        />
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right text-xs text-muted">
                      {new Date(ticket.updated_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/admin/tickets/${ticket.id}`}
                        className="text-xs text-accent hover:text-accent-dark font-medium flex items-center gap-1"
                      >
                        View <ArrowRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="md:hidden divide-y divide-border">
            {filtered.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/admin/tickets/${ticket.id}`}
                className="block p-4 hover:bg-zinc-50/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-zinc-900 truncate flex-1">
                    {ticket.subject}
                  </p>
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
                      priorityColors[ticket.priority]
                    }`}
                  >
                    {ticket.priority}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted">
                  <span>{ticket.author_name}</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-300" />
                  <span>{categoryLabels[ticket.category]}</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-300" />
                  <span>{ticket.status.replace("_", " ")}</span>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-sm text-muted">No tickets match the current filters.</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
