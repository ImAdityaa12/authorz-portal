"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Plus,
  ChatCircleDots,
  Clock,
  CheckCircle,
  ArrowRight,
  Funnel,
} from "@phosphor-icons/react";

interface Ticket {
  id: string;
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

const statusIcons: Record<string, typeof Clock> = {
  open: Clock,
  in_progress: ChatCircleDots,
  resolved: CheckCircle,
  closed: CheckCircle,
};

const categoryLabels: Record<string, string> = {
  royalty_query: "Royalty Query",
  book_status: "Book Status",
  technical_issue: "Technical Issue",
  account_update: "Account Update",
  general: "General",
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 200, damping: 24 } },
};

export default function AuthorSupport() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/tickets")
      .then((r) => r.json())
      .then((data) => {
        setTickets(data);
        setLoading(false);
      });
  }, []);

  const filtered =
    filter === "all" ? tickets : tickets.filter((t) => t.status === filter);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-40 bg-zinc-100 rounded-lg animate-pulse" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-zinc-100 rounded-2xl animate-pulse" />
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
      <motion.div variants={itemVariants} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Support Tickets
          </h1>
          <p className="text-sm text-muted mt-1">
            {tickets.length} ticket{tickets.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link
          href="/author/support/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 active:scale-[0.98] transition-all"
        >
          <Plus size={16} weight="bold" />
          New Ticket
        </Link>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex items-center gap-2">
        <Funnel size={16} className="text-muted" />
        {["all", "open", "in_progress", "resolved"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === s
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {s === "all"
              ? "All"
              : s === "in_progress"
              ? "In Progress"
              : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </motion.div>

      {/* Tickets List */}
      {filtered.length === 0 ? (
        <motion.div
          variants={itemVariants}
          className="p-12 text-center bg-surface border border-border rounded-2xl"
        >
          <ChatCircleDots size={40} className="text-zinc-300 mx-auto mb-3" />
          <p className="text-sm text-muted">No tickets found.</p>
          <Link
            href="/author/support/new"
            className="inline-flex items-center gap-1 text-sm text-accent font-medium mt-2"
          >
            Create your first ticket <ArrowRight size={14} />
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {filtered.map((ticket) => {
            const StatusIcon = statusIcons[ticket.status] || Clock;
            return (
              <motion.div key={ticket.id} variants={itemVariants}>
                <TicketCard ticket={ticket} StatusIcon={StatusIcon} />
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

function TicketCard({
  ticket,
  StatusIcon,
}: {
  ticket: Ticket;
  StatusIcon: typeof Clock;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden hover:border-zinc-300 transition-colors">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left flex items-start gap-3"
      >
        <StatusIcon
          size={20}
          weight="duotone"
          className={`mt-0.5 shrink-0 ${
            ticket.status === "resolved" || ticket.status === "closed"
              ? "text-emerald-500"
              : ticket.status === "in_progress"
              ? "text-blue-500"
              : "text-amber-500"
          }`}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-zinc-900 truncate">
            {ticket.subject}
          </p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-xs text-muted">
              {categoryLabels[ticket.category] || ticket.category}
            </span>
            <span className="w-1 h-1 rounded-full bg-zinc-300" />
            <span className="text-xs text-muted">
              {new Date(ticket.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })}
            </span>
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                priorityColors[ticket.priority]
              }`}
            >
              {ticket.priority}
            </span>
          </div>
        </div>
        <span className="text-xs text-muted shrink-0">
          {ticket.messages.length} message{ticket.messages.length !== 1 ? "s" : ""}
        </span>
      </button>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="border-t border-border"
        >
          <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
            {ticket.messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-xl text-sm ${
                  msg.sender === "author"
                    ? "bg-zinc-50 text-zinc-800"
                    : msg.sender === "admin"
                    ? "bg-emerald-50 text-emerald-900"
                    : "bg-blue-50 text-blue-900"
                }`}
              >
                <p className="text-xs font-medium mb-1 capitalize opacity-70">
                  {msg.sender === "author"
                    ? "You"
                    : msg.sender === "admin"
                    ? "BookLeaf Support"
                    : "AI Assistant"}
                </p>
                <p className="whitespace-pre-wrap leading-relaxed">
                  {msg.message}
                </p>
                <p className="text-[10px] text-right opacity-50 mt-1">
                  {new Date(msg.timestamp).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
