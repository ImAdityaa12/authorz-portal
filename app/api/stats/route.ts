import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getStats, getAuthorById, getBooksByAuthor, getTicketsByAuthor } from "@/lib/data";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.role === "admin") {
    return NextResponse.json(getStats());
  }

  // Author-specific stats
  const author = getAuthorById(session.author_id!);
  if (!author) {
    return NextResponse.json({ error: "Author not found" }, { status: 404 });
  }

  const books = getBooksByAuthor(session.author_id!);
  const tickets = getTicketsByAuthor(session.author_id!);

  return NextResponse.json({
    totalBooks: books.length,
    publishedBooks: books.filter((b) => b.status === "Published & Live").length,
    inProductionBooks: books.filter((b) => b.status.startsWith("In Production")).length,
    totalCopiesSold: books.reduce((s, b) => s + b.total_copies_sold, 0),
    totalRoyaltyEarned: books.reduce((s, b) => s + b.total_royalty_earned, 0),
    totalRoyaltyPaid: books.reduce((s, b) => s + b.royalty_paid, 0),
    totalRoyaltyPending: books.reduce((s, b) => s + b.royalty_pending, 0),
    openTickets: tickets.filter((t) => t.status === "open").length,
    totalTickets: tickets.length,
  });
}
