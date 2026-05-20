import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getTicketById, getAuthorById } from "@/lib/data";

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
  const suggestion = generateSuggestion(ticket, author);

  return NextResponse.json({ suggestion });
}

function generateSuggestion(
  ticket: ReturnType<typeof getTicketById>,
  author: ReturnType<typeof getAuthorById>
) {
  if (!ticket || !author) return "Unable to generate suggestion.";

  const authorName = author.name.split(" ")[0];
  const lastMessage = ticket.messages[ticket.messages.length - 1];

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
