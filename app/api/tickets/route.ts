import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getTickets,
  getTicketsByAuthor,
  createTicket,
  getAuthorById,
} from "@/lib/data";
import { v4 as uuidv4 } from "uuid";
import type { TicketCategory, TicketPriority } from "@/lib/types";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.role === "author") {
    return NextResponse.json(getTicketsByAuthor(session.author_id!));
  }

  const tickets = getTickets();
  const enriched = tickets.map((t) => {
    const author = getAuthorById(t.author_id);
    return { ...t, author_name: author?.name || "Unknown" };
  });
  return NextResponse.json(enriched);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "author") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { subject, message, category } = body;

  if (!subject || !message) {
    return NextResponse.json(
      { error: "Subject and message are required" },
      { status: 400 }
    );
  }

  // AI-based priority detection
  const priority = detectPriority(subject, message);
  const detectedCategory = category || detectCategory(subject, message);

  const ticket = createTicket({
    id: `TKT${String(Date.now()).slice(-6)}`,
    author_id: session.author_id!,
    subject,
    category: detectedCategory as TicketCategory,
    priority,
    status: "open",
    messages: [
      {
        id: uuidv4(),
        sender: "author",
        message,
        timestamp: new Date().toISOString(),
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  return NextResponse.json(ticket, { status: 201 });
}

function detectPriority(subject: string, message: string): TicketPriority {
  const text = `${subject} ${message}`.toLowerCase();
  if (
    text.includes("urgent") ||
    text.includes("immediately") ||
    text.includes("critical")
  )
    return "urgent";
  if (
    text.includes("payment") ||
    text.includes("royalty") ||
    text.includes("delay") ||
    text.includes("not received")
  )
    return "high";
  if (
    text.includes("issue") ||
    text.includes("problem") ||
    text.includes("error") ||
    text.includes("not working")
  )
    return "medium";
  return "low";
}

function detectCategory(subject: string, message: string): TicketCategory {
  const text = `${subject} ${message}`.toLowerCase();
  if (
    text.includes("royalty") ||
    text.includes("payment") ||
    text.includes("payout") ||
    text.includes("earning")
  )
    return "royalty_query";
  if (
    text.includes("book") ||
    text.includes("publish") ||
    text.includes("production") ||
    text.includes("listing")
  )
    return "book_status";
  if (
    text.includes("account") ||
    text.includes("profile") ||
    text.includes("update") ||
    text.includes("phone") ||
    text.includes("email")
  )
    return "account_update";
  if (
    text.includes("error") ||
    text.includes("bug") ||
    text.includes("technical") ||
    text.includes("not working")
  )
    return "technical_issue";
  return "general";
}
