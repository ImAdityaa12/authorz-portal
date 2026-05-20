import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getTicketById, getAuthorById } from "@/lib/data";
import type { Author, Ticket } from "@/lib/types";

const NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const NVIDIA_MODEL = "meta/llama-3.3-70b-instruct";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ticketId } = await request.json();
  const ticket = getTicketById(ticketId);
  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  const author = getAuthorById(ticket.author_id);
  if (!author) {
    return NextResponse.json({ error: "Author not found" }, { status: 404 });
  }

  const apiKey = process.env.NVIDIA_API_KEY;

  // Use NVIDIA LLaMA if API key is available, otherwise fall back to rule-based
  if (apiKey) {
    try {
      const suggestion = await generateWithLLaMA(ticket, author, apiKey);
      return NextResponse.json({ suggestion, model: NVIDIA_MODEL });
    } catch (error) {
      console.error("NVIDIA API error, falling back to rule-based:", error);
      const suggestion = generateFallback(ticket, author);
      return NextResponse.json({ suggestion, model: "fallback" });
    }
  }

  const suggestion = generateFallback(ticket, author);
  return NextResponse.json({ suggestion, model: "fallback" });
}

async function generateWithLLaMA(
  ticket: Ticket,
  author: Author,
  apiKey: string
): Promise<string> {
  const systemPrompt = buildSystemPrompt(author);
  const userPrompt = buildUserPrompt(ticket, author);

  const response = await fetch(NVIDIA_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: NVIDIA_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `NVIDIA API returned ${response.status}: ${errorText}`
    );
  }

  const data = await response.json();

  if (!data.choices?.[0]?.message?.content) {
    throw new Error("Invalid response format from NVIDIA API");
  }

  return data.choices[0].message.content.trim();
}

function buildSystemPrompt(author: Author): string {
  const booksInfo = author.books
    .map((b) => {
      const parts = [
        `Title: "${b.title}"`,
        `Genre: ${b.genre}`,
        `Status: ${b.status}`,
      ];
      if (b.status === "Published & Live") {
        parts.push(
          `MRP: Rs ${b.mrp}`,
          `Royalty per copy: Rs ${b.author_royalty_per_copy}`,
          `Copies sold: ${b.total_copies_sold}`,
          `Total royalty earned: Rs ${b.total_royalty_earned}`,
          `Royalty paid: Rs ${b.royalty_paid}`,
          `Royalty pending: Rs ${b.royalty_pending}`,
          `Last payout: ${b.last_royalty_payout_date || "Never"}`,
          `Print partner: ${b.print_partner}`,
          `Available on: ${b.available_on.join(", ")}`
        );
      }
      return parts.join("\n    ");
    })
    .join("\n\n  ");

  return `You are a professional customer support agent for BookLeaf Publishing, an Indian publishing house. Your role is to draft helpful, empathetic, and accurate support ticket responses for authors.

IMPORTANT GUIDELINES:
- Be warm and professional. Address the author by first name.
- Use ONLY the factual data provided below. Never fabricate numbers, dates, or statuses.
- Keep responses concise (150-250 words). Do not be overly verbose.
- If the query is about royalties, reference the exact pending amounts and last payout dates from the data.
- If the query is about book status, reference the exact production stage from the data.
- Sign off as "BookLeaf Support Team".
- Use Indian Rupee formatting (Rs) for all monetary values.
- Our royalty payout cycle is quarterly, processed within 15 business days after each quarter ends. Minimum payout threshold is Rs 1,000.

AUTHOR PROFILE:
  Name: ${author.name}
  Email: ${author.email}
  Phone: ${author.phone}
  City: ${author.city}
  Joined: ${author.joined_date}

AUTHOR'S BOOKS:
  ${booksInfo}`;
}

function buildUserPrompt(ticket: Ticket, author: Author): string {
  const conversationHistory = ticket.messages
    .map(
      (m) =>
        `[${m.sender.toUpperCase()}] (${new Date(m.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}): ${m.message}`
    )
    .join("\n\n");

  return `Draft a support response for this ticket.

TICKET DETAILS:
  ID: ${ticket.id}
  Subject: ${ticket.subject}
  Category: ${ticket.category.replace("_", " ")}
  Priority: ${ticket.priority}
  Status: ${ticket.status}

CONVERSATION HISTORY:
${conversationHistory}

Write a professional reply from the BookLeaf Support Team that directly addresses the author's concern using their actual data. Do not include a subject line, just the response body.`;
}

// Fallback rule-based generation (used when NVIDIA API key is not configured)
function generateFallback(ticket: Ticket, author: Author): string {
  const authorName = author.name.split(" ")[0];

  switch (ticket.category) {
    case "royalty_query": {
      const booksWithPending = author.books.filter(
        (b) => b.royalty_pending > 0
      );
      const totalPending = booksWithPending.reduce(
        (s, b) => s + b.royalty_pending,
        0
      );
      return `Dear ${authorName},\n\nThank you for reaching out regarding your royalty query.\n\nAs per our records, you have a total pending royalty of Rs ${totalPending.toLocaleString("en-IN")} across ${booksWithPending.length} book(s):\n${booksWithPending.map((b) => `- "${b.title}": Rs ${b.royalty_pending.toLocaleString("en-IN")} pending`).join("\n")}\n\nOur standard royalty payout cycle is quarterly. Your next scheduled payout will be processed by the end of the current quarter. If you have any specific concerns, please don't hesitate to let us know.\n\nWarm regards,\nBookLeaf Support Team`;
    }
    case "book_status": {
      const inProdBooks = author.books.filter((b) =>
        b.status.startsWith("In Production")
      );
      if (inProdBooks.length > 0) {
        return `Dear ${authorName},\n\nThank you for your inquiry about your book's status.\n\nHere is the current production status:\n${inProdBooks.map((b) => `- "${b.title}": ${b.status}`).join("\n")}\n\nWe are working diligently to move your book through the production pipeline. Our editorial team will keep you updated on any progress. Typical timelines for each production stage are 2-4 weeks.\n\nBest regards,\nBookLeaf Support Team`;
      }
      return `Dear ${authorName},\n\nThank you for reaching out about your book's status.\n\nWe have noted your concern and are looking into it with our distribution and production teams. We will provide you with a detailed update within 48 hours.\n\nBest regards,\nBookLeaf Support Team`;
    }
    case "account_update":
      return `Dear ${authorName},\n\nThank you for reaching out.\n\nYour account update request has been noted. We have processed the change as requested. Please verify the update in your author profile and let us know if everything looks correct.\n\nIf you need any further modifications, feel free to reach out.\n\nBest regards,\nBookLeaf Support Team`;
    case "technical_issue":
      return `Dear ${authorName},\n\nThank you for reporting this technical issue.\n\nWe have escalated this to our technical team for investigation. Here is what we need from you to resolve this quickly:\n1. The browser and device you are using\n2. Screenshots of the issue (if applicable)\n3. Steps to reproduce the problem\n\nOur team will work on resolving this at the earliest. We will update you on the progress.\n\nBest regards,\nBookLeaf Support Team`;
    default:
      return `Dear ${authorName},\n\nThank you for contacting BookLeaf Support.\n\nWe have received your query and are reviewing it. Our team will get back to you with a detailed response within 24-48 hours.\n\nIn the meantime, if you have any additional information to share, please feel free to reply to this ticket.\n\nBest regards,\nBookLeaf Support Team`;
  }
}
