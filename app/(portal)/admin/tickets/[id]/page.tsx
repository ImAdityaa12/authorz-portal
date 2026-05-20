"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  PaperPlaneTilt,
  CircleNotch,
  Robot,
  Lightning,
  Clock,
  CheckCircle,
} from "@phosphor-icons/react";

interface TicketDetail {
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

const categoryLabels: Record<string, string> = {
  royalty_query: "Royalty Query",
  book_status: "Book Status",
  technical_issue: "Technical Issue",
  account_update: "Account Update",
  general: "General",
};

const statusOptions = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

export default function AdminTicketDetail() {
  const params = useParams();
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");

  useEffect(() => {
    fetch(`/api/tickets/${params.id}`)
      .then((r) => r.json())
      .then(setTicket);
  }, [params.id]);

  const handleSendReply = async () => {
    if (!reply.trim()) return;
    setSending(true);

    const res = await fetch(`/api/tickets/${params.id}/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: reply }),
    });

    if (res.ok) {
      const updated = await res.json();
      setTicket(updated);
      setReply("");
      setAiSuggestion("");
    }
    setSending(false);
  };

  const handleStatusChange = async (status: string) => {
    const res = await fetch(`/api/tickets/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (res.ok && ticket) {
      setTicket({ ...ticket, status });
    }
  };

  const handleAiSuggest = async () => {
    setAiLoading(true);
    const res = await fetch("/api/ai/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticketId: params.id }),
    });

    if (res.ok) {
      const data = await res.json();
      setAiSuggestion(data.suggestion);
    }
    setAiLoading(false);
  };

  if (!ticket) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-24 bg-zinc-100 rounded animate-pulse" />
        <div className="h-40 bg-zinc-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-4xl"
    >
      <Link
        href="/admin/tickets"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-zinc-900 transition-colors"
      >
        <ArrowLeft size={16} /> Back to tickets
      </Link>

      {/* Ticket Header */}
      <div className="bg-surface border border-border rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-zinc-900">
              {ticket.subject}
            </h1>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-xs text-muted font-mono">{ticket.id}</span>
              <span className="w-1 h-1 rounded-full bg-zinc-300" />
              <span className="text-xs text-muted">
                by {ticket.author_name}
              </span>
              <span className="w-1 h-1 rounded-full bg-zinc-300" />
              <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
                {categoryLabels[ticket.category] || ticket.category}
              </span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  priorityColors[ticket.priority]
                }`}
              >
                {ticket.priority}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={ticket.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="h-9 px-3 rounded-lg border border-border bg-white text-xs font-medium focus:border-accent outline-none appearance-none cursor-pointer"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {ticket.status === "open" || ticket.status === "in_progress" ? (
              <Clock size={18} className="text-amber-500" />
            ) : (
              <CheckCircle
                size={18}
                className="text-emerald-500"
                weight="fill"
              />
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 mt-3 text-xs text-muted">
          <span>
            Created:{" "}
            {new Date(ticket.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <span>
            Updated:{" "}
            {new Date(ticket.updated_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-3">
        {ticket.messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl ${
              msg.sender === "author"
                ? "bg-zinc-50 border border-border"
                : msg.sender === "admin"
                ? "bg-emerald-50 border border-emerald-100"
                : "bg-blue-50 border border-blue-100"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold capitalize">
                {msg.sender === "author"
                  ? ticket.author_name
                  : msg.sender === "admin"
                  ? "BookLeaf Support"
                  : "AI Assistant"}
              </span>
              <span className="text-[10px] text-muted">
                {new Date(msg.timestamp).toLocaleString("en-IN", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {msg.message}
            </p>
          </motion.div>
        ))}
      </div>

      {/* AI Suggestion */}
      {ticket.status !== "closed" && ticket.status !== "resolved" && (
        <div className="bg-surface border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Robot size={20} className="text-blue-600" weight="duotone" />
              <h3 className="text-sm font-semibold text-zinc-900">
                AI-Powered Response
              </h3>
            </div>
            <button
              onClick={handleAiSuggest}
              disabled={aiLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 active:scale-[0.98] transition-all disabled:opacity-60"
            >
              {aiLoading ? (
                <CircleNotch size={14} className="animate-spin" />
              ) : (
                <Lightning size={14} weight="fill" />
              )}
              Generate Suggestion
            </button>
          </div>

          {aiSuggestion && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-4"
            >
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 text-sm whitespace-pre-wrap leading-relaxed">
                {aiSuggestion}
              </div>
              <button
                onClick={() => {
                  setReply(aiSuggestion);
                  setAiSuggestion("");
                }}
                className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Use this response
              </button>
            </motion.div>
          )}

          {/* Reply Box */}
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type your response..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm placeholder:text-zinc-400 focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors outline-none resize-none"
          />
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-muted">
              Tip: Use AI to generate a contextual response based on the author&apos;s data.
            </p>
            <button
              onClick={handleSendReply}
              disabled={sending || !reply.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 active:scale-[0.98] transition-all disabled:opacity-60"
            >
              {sending ? (
                <CircleNotch size={16} className="animate-spin" />
              ) : (
                <>
                  <PaperPlaneTilt size={16} weight="bold" />
                  Send Reply
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
