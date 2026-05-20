import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { addTicketMessage, getTicketById } from "@/lib/data";
import { v4 as uuidv4 } from "uuid";

export async function POST(
  request: Request,
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

  const { message } = await request.json();
  if (!message) {
    return NextResponse.json(
      { error: "Message is required" },
      { status: 400 }
    );
  }

  const sender = session.role === "admin" ? "admin" : "author";
  const updated = addTicketMessage(id, {
    id: uuidv4(),
    sender,
    message,
  });

  return NextResponse.json(updated);
}
