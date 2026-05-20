import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAllBooks, getBooksByAuthor } from "@/lib/data";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.role === "author") {
    return NextResponse.json(getBooksByAuthor(session.author_id!));
  }

  return NextResponse.json(getAllBooks());
}
