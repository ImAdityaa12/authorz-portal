import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAuthors, getAuthorById } from "@/lib/data";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const author = getAuthorById(id);
    if (!author) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 });
    }
    return NextResponse.json(author);
  }

  if (session.role === "author") {
    const author = getAuthorById(session.author_id!);
    return NextResponse.json(author ? [author] : []);
  }

  return NextResponse.json(getAuthors());
}
