export interface Book {
  book_id: string;
  title: string;
  isbn: string;
  genre: string;
  publication_date: string | null;
  status: string;
  mrp: number | null;
  author_royalty_per_copy: number | null;
  total_copies_sold: number;
  total_royalty_earned: number;
  royalty_paid: number;
  royalty_pending: number;
  last_royalty_payout_date: string | null;
  print_partner: string | null;
  available_on: string[];
}

export interface Author {
  author_id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  joined_date: string;
  books: Book[];
}

export type TicketPriority = "low" | "medium" | "high" | "urgent";
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketCategory =
  | "royalty_query"
  | "book_status"
  | "technical_issue"
  | "account_update"
  | "general";

export interface TicketMessage {
  id: string;
  sender: "author" | "admin" | "ai";
  message: string;
  timestamp: string;
}

export interface Ticket {
  id: string;
  author_id: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  messages: TicketMessage[];
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: "author" | "admin";
  author_id?: string;
  name: string;
}

export interface AuthPayload {
  id: string;
  email: string;
  role: "author" | "admin";
  author_id?: string;
  name: string;
}
