import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getBooksByAuthor, getAllBooks } from "@/lib/data";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const books =
    session.role === "author"
      ? getBooksByAuthor(session.author_id!)
      : getAllBooks();

  const summary = {
    total_earned: books.reduce((s, b) => s + b.total_royalty_earned, 0),
    total_paid: books.reduce((s, b) => s + b.royalty_paid, 0),
    total_pending: books.reduce((s, b) => s + b.royalty_pending, 0),
    books: books
      .filter((b) => b.total_royalty_earned > 0)
      .map((b) => ({
        book_id: b.book_id,
        title: b.title,
        total_copies_sold: b.total_copies_sold,
        royalty_per_copy: b.author_royalty_per_copy,
        total_earned: b.total_royalty_earned,
        paid: b.royalty_paid,
        pending: b.royalty_pending,
        last_payout: b.last_royalty_payout_date,
      })),
  };

  return NextResponse.json(summary);
}
