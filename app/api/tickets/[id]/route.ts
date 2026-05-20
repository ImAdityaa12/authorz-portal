import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getTicketById, updateTicketStatus, getAuthorById } from "@/lib/data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const ticket = getTicketById(id);
  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  if (session.role === "author" && ticket.author_id !== session.author_id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const author = getAuthorById(ticket.author_id);
  return NextResponse.json({ ...ticket, author_name: author?.name || "Unknown" });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await request.json();
  const ticket = updateTicketStatus(id, status);

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  return NextResponse.json(ticket);
}
