import type { Author, Ticket, User } from "./types";

// In-memory data store seeded from sample data
// In production, this would be a real database

const sampleData = {
  authors: [
    {
      author_id: "AUTH001",
      name: "Priya Sharma",
      email: "priya.sharma@email.com",
      phone: "+91-98765-43210",
      city: "Mumbai",
      joined_date: "2023-03-15",
      books: [
        {
          book_id: "BK001",
          title: "Whispers of the Ganges",
          isbn: "978-93-5XXXX-01-1",
          genre: "Literary Fiction",
          publication_date: "2023-06-20",
          status: "Published & Live",
          mrp: 399,
          author_royalty_per_copy: 35,
          total_copies_sold: 342,
          total_royalty_earned: 11970,
          royalty_paid: 8400,
          royalty_pending: 3570,
          last_royalty_payout_date: "2025-10-15",
          print_partner: "In-House",
          available_on: ["Amazon India", "Flipkart", "BookLeaf Store"],
        },
        {
          book_id: "BK002",
          title: "The Saffron Diaries",
          isbn: "978-93-5XXXX-02-8",
          genre: "Non-Fiction / Memoir",
          publication_date: "2024-01-10",
          status: "Published & Live",
          mrp: 450,
          author_royalty_per_copy: 42,
          total_copies_sold: 189,
          total_royalty_earned: 7938,
          royalty_paid: 7938,
          royalty_pending: 0,
          last_royalty_payout_date: "2025-12-01",
          print_partner: "In-House",
          available_on: ["Amazon India", "BookLeaf Store"],
        },
      ],
    },
    {
      author_id: "AUTH002",
      name: "Rohit Kapoor",
      email: "rohit.kapoor@email.com",
      phone: "+91-87654-32109",
      city: "Delhi",
      joined_date: "2022-11-08",
      books: [
        {
          book_id: "BK003",
          title: "Code & Karma",
          isbn: "978-93-5XXXX-03-5",
          genre: "Self-Help / Technology",
          publication_date: "2023-02-14",
          status: "Published & Live",
          mrp: 350,
          author_royalty_per_copy: 30,
          total_copies_sold: 876,
          total_royalty_earned: 26280,
          royalty_paid: 21000,
          royalty_pending: 5280,
          last_royalty_payout_date: "2025-09-01",
          print_partner: "Repro India",
          available_on: [
            "Amazon India",
            "Flipkart",
            "Amazon US",
            "BookLeaf Store",
          ],
        },
        {
          book_id: "BK004",
          title: "Startup Sutra",
          isbn: "978-93-5XXXX-04-2",
          genre: "Business / Entrepreneurship",
          publication_date: "2024-05-22",
          status: "Published & Live",
          mrp: 499,
          author_royalty_per_copy: 48,
          total_copies_sold: 1203,
          total_royalty_earned: 57744,
          royalty_paid: 50000,
          royalty_pending: 7744,
          last_royalty_payout_date: "2025-11-15",
          print_partner: "In-House",
          available_on: [
            "Amazon India",
            "Flipkart",
            "Amazon US",
            "Amazon UK",
            "BookLeaf Store",
          ],
        },
      ],
    },
    {
      author_id: "AUTH003",
      name: "Ananya Reddy",
      email: "ananya.reddy@email.com",
      phone: "+91-76543-21098",
      city: "Hyderabad",
      joined_date: "2024-02-20",
      books: [
        {
          book_id: "BK005",
          title: "Between Two Temples",
          isbn: "978-93-5XXXX-05-9",
          genre: "Historical Fiction",
          publication_date: "2024-07-05",
          status: "Published & Live",
          mrp: 425,
          author_royalty_per_copy: 38,
          total_copies_sold: 67,
          total_royalty_earned: 2546,
          royalty_paid: 0,
          royalty_pending: 2546,
          last_royalty_payout_date: null,
          print_partner: "Epitome Books",
          available_on: ["Amazon India", "BookLeaf Store"],
        },
      ],
    },
    {
      author_id: "AUTH004",
      name: "Vikram Joshi",
      email: "vikram.joshi@email.com",
      phone: "+91-65432-10987",
      city: "Pune",
      joined_date: "2023-07-12",
      books: [
        {
          book_id: "BK006",
          title: "Debugging Life",
          isbn: "978-93-5XXXX-06-6",
          genre: "Self-Help",
          publication_date: "2023-11-30",
          status: "Published & Live",
          mrp: 299,
          author_royalty_per_copy: 25,
          total_copies_sold: 534,
          total_royalty_earned: 13350,
          royalty_paid: 10000,
          royalty_pending: 3350,
          last_royalty_payout_date: "2025-08-20",
          print_partner: "In-House",
          available_on: ["Amazon India", "Flipkart", "BookLeaf Store"],
        },
        {
          book_id: "BK007",
          title: "The Last Monsoon",
          isbn: "978-93-5XXXX-07-3",
          genre: "Poetry",
          publication_date: "2024-08-15",
          status: "Published & Live",
          mrp: 199,
          author_royalty_per_copy: 15,
          total_copies_sold: 123,
          total_royalty_earned: 1845,
          royalty_paid: 1845,
          royalty_pending: 0,
          last_royalty_payout_date: "2025-12-01",
          print_partner: "In-House",
          available_on: ["Amazon India", "BookLeaf Store"],
        },
      ],
    },
    {
      author_id: "AUTH005",
      name: "Meera Nair",
      email: "meera.nair@email.com",
      phone: "+91-54321-09876",
      city: "Kochi",
      joined_date: "2023-01-05",
      books: [
        {
          book_id: "BK008",
          title: "Cardamom & Chaos",
          isbn: "978-93-5XXXX-08-0",
          genre: "Contemporary Fiction",
          publication_date: "2023-04-18",
          status: "Published & Live",
          mrp: 375,
          author_royalty_per_copy: 32,
          total_copies_sold: 445,
          total_royalty_earned: 14240,
          royalty_paid: 14240,
          royalty_pending: 0,
          last_royalty_payout_date: "2025-12-01",
          print_partner: "Repro India",
          available_on: ["Amazon India", "Flipkart", "BookLeaf Store"],
        },
        {
          book_id: "BK009",
          title: "Letters from Lakshadweep",
          isbn: "978-93-5XXXX-09-7",
          genre: "Travel / Non-Fiction",
          publication_date: "2024-03-01",
          status: "Published & Live",
          mrp: 550,
          author_royalty_per_copy: 55,
          total_copies_sold: 201,
          total_royalty_earned: 11055,
          royalty_paid: 8000,
          royalty_pending: 3055,
          last_royalty_payout_date: "2025-10-15",
          print_partner: "In-House",
          available_on: ["Amazon India", "Amazon US", "BookLeaf Store"],
        },
      ],
    },
    {
      author_id: "AUTH006",
      name: "Arjun Malhotra",
      email: "arjun.malhotra@email.com",
      phone: "+91-43210-98765",
      city: "Chandigarh",
      joined_date: "2024-06-01",
      books: [
        {
          book_id: "BK010",
          title: "Turban Tales",
          isbn: "978-93-5XXXX-10-3",
          genre: "Humor / Essays",
          publication_date: "2024-09-10",
          status: "Published & Live",
          mrp: 325,
          author_royalty_per_copy: 28,
          total_copies_sold: 88,
          total_royalty_earned: 2464,
          royalty_paid: 0,
          royalty_pending: 2464,
          last_royalty_payout_date: null,
          print_partner: "In-House",
          available_on: ["Amazon India", "BookLeaf Store"],
        },
      ],
    },
    {
      author_id: "AUTH007",
      name: "Sneha Kulkarni",
      email: "sneha.kulkarni@email.com",
      phone: "+91-32109-87654",
      city: "Bangalore",
      joined_date: "2022-09-18",
      books: [
        {
          book_id: "BK011",
          title: "The Algorithm of Love",
          isbn: "978-93-5XXXX-11-0",
          genre: "Romance",
          publication_date: "2022-12-25",
          status: "Published & Live",
          mrp: 299,
          author_royalty_per_copy: 25,
          total_copies_sold: 1567,
          total_royalty_earned: 39175,
          royalty_paid: 35000,
          royalty_pending: 4175,
          last_royalty_payout_date: "2025-11-15",
          print_partner: "Repro India",
          available_on: [
            "Amazon India",
            "Flipkart",
            "Amazon US",
            "BookLeaf Store",
          ],
        },
        {
          book_id: "BK012",
          title: "Ctrl+Alt+Delete My Ex",
          isbn: "978-93-5XXXX-12-7",
          genre: "Romance / Humor",
          publication_date: "2024-02-14",
          status: "Published & Live",
          mrp: 350,
          author_royalty_per_copy: 30,
          total_copies_sold: 723,
          total_royalty_earned: 21690,
          royalty_paid: 18000,
          royalty_pending: 3690,
          last_royalty_payout_date: "2025-10-15",
          print_partner: "In-House",
          available_on: ["Amazon India", "Flipkart", "BookLeaf Store"],
        },
        {
          book_id: "BK013",
          title: "Midnight in Mysore",
          isbn: "978-93-5XXXX-13-4",
          genre: "Thriller",
          publication_date: null,
          status: "In Production - Cover Design",
          mrp: null,
          author_royalty_per_copy: null,
          total_copies_sold: 0,
          total_royalty_earned: 0,
          royalty_paid: 0,
          royalty_pending: 0,
          last_royalty_payout_date: null,
          print_partner: null,
          available_on: [],
        },
      ],
    },
    {
      author_id: "AUTH008",
      name: "Farhan Sheikh",
      email: "farhan.sheikh@email.com",
      phone: "+91-21098-76543",
      city: "Lucknow",
      joined_date: "2023-10-01",
      books: [
        {
          book_id: "BK014",
          title: "Ghazal of the Forgotten",
          isbn: "978-93-5XXXX-14-1",
          genre: "Poetry / Urdu Literature",
          publication_date: "2024-01-26",
          status: "Published & Live",
          mrp: 250,
          author_royalty_per_copy: 20,
          total_copies_sold: 156,
          total_royalty_earned: 3120,
          royalty_paid: 3120,
          royalty_pending: 0,
          last_royalty_payout_date: "2025-12-01",
          print_partner: "Epitome Books",
          available_on: ["Amazon India", "BookLeaf Store"],
        },
      ],
    },
    {
      author_id: "AUTH009",
      name: "Kavita Deshmukh",
      email: "kavita.deshmukh@email.com",
      phone: "+91-10987-65432",
      city: "Nagpur",
      joined_date: "2024-04-10",
      books: [
        {
          book_id: "BK015",
          title: "Raising Roots",
          isbn: "978-93-5XXXX-15-8",
          genre: "Parenting / Non-Fiction",
          publication_date: null,
          status: "In Production - Typesetting",
          mrp: null,
          author_royalty_per_copy: null,
          total_copies_sold: 0,
          total_royalty_earned: 0,
          royalty_paid: 0,
          royalty_pending: 0,
          last_royalty_payout_date: null,
          print_partner: null,
          available_on: [],
        },
        {
          book_id: "BK016",
          title: "The Nagpur Notebooks",
          isbn: "978-93-5XXXX-16-5",
          genre: "Essays / Memoir",
          publication_date: "2024-11-05",
          status: "Published & Live",
          mrp: 299,
          author_royalty_per_copy: 25,
          total_copies_sold: 34,
          total_royalty_earned: 850,
          royalty_paid: 0,
          royalty_pending: 850,
          last_royalty_payout_date: null,
          print_partner: "In-House",
          available_on: ["Amazon India", "BookLeaf Store"],
        },
      ],
    },
    {
      author_id: "AUTH010",
      name: "Diya Chatterjee",
      email: "diya.chatterjee@email.com",
      phone: "+91-09876-54321",
      city: "Kolkata",
      joined_date: "2023-05-22",
      books: [
        {
          book_id: "BK017",
          title: "Durga\u2019s Daughters",
          isbn: "978-93-5XXXX-17-2",
          genre: "Literary Fiction",
          publication_date: "2023-10-15",
          status: "Published & Live",
          mrp: 475,
          author_royalty_per_copy: 45,
          total_copies_sold: 612,
          total_royalty_earned: 27540,
          royalty_paid: 25000,
          royalty_pending: 2540,
          last_royalty_payout_date: "2025-11-15",
          print_partner: "Repro India",
          available_on: [
            "Amazon India",
            "Flipkart",
            "Amazon US",
            "BookLeaf Store",
          ],
        },
        {
          book_id: "BK018",
          title: "Howrah Nights",
          isbn: "978-93-5XXXX-18-9",
          genre: "Crime / Thriller",
          publication_date: "2025-01-20",
          status: "Published & Live",
          mrp: 399,
          author_royalty_per_copy: 35,
          total_copies_sold: 45,
          total_royalty_earned: 1575,
          royalty_paid: 0,
          royalty_pending: 1575,
          last_royalty_payout_date: null,
          print_partner: "In-House",
          available_on: ["Amazon India", "BookLeaf Store"],
        },
      ],
    },
  ] as Author[],
};

// Users for authentication
const users: User[] = [
  {
    id: "USR001",
    email: "admin@bookleaf.in",
    password: "admin123",
    role: "admin",
    name: "BookLeaf Admin",
  },
  {
    id: "USR002",
    email: "priya.sharma@email.com",
    password: "author123",
    role: "author",
    author_id: "AUTH001",
    name: "Priya Sharma",
  },
  {
    id: "USR003",
    email: "rohit.kapoor@email.com",
    password: "author123",
    role: "author",
    author_id: "AUTH002",
    name: "Rohit Kapoor",
  },
  {
    id: "USR004",
    email: "ananya.reddy@email.com",
    password: "author123",
    role: "author",
    author_id: "AUTH003",
    name: "Ananya Reddy",
  },
  {
    id: "USR005",
    email: "vikram.joshi@email.com",
    password: "author123",
    role: "author",
    author_id: "AUTH004",
    name: "Vikram Joshi",
  },
  {
    id: "USR006",
    email: "meera.nair@email.com",
    password: "author123",
    role: "author",
    author_id: "AUTH005",
    name: "Meera Nair",
  },
  {
    id: "USR007",
    email: "arjun.malhotra@email.com",
    password: "author123",
    role: "author",
    author_id: "AUTH006",
    name: "Arjun Malhotra",
  },
  {
    id: "USR008",
    email: "sneha.kulkarni@email.com",
    password: "author123",
    role: "author",
    author_id: "AUTH007",
    name: "Sneha Kulkarni",
  },
  {
    id: "USR009",
    email: "farhan.sheikh@email.com",
    password: "author123",
    role: "author",
    author_id: "AUTH008",
    name: "Farhan Sheikh",
  },
  {
    id: "USR010",
    email: "kavita.deshmukh@email.com",
    password: "author123",
    role: "author",
    author_id: "AUTH009",
    name: "Kavita Deshmukh",
  },
  {
    id: "USR011",
    email: "diya.chatterjee@email.com",
    password: "author123",
    role: "author",
    author_id: "AUTH010",
    name: "Diya Chatterjee",
  },
];

// Sample tickets
const tickets: Ticket[] = [
  {
    id: "TKT001",
    author_id: "AUTH001",
    subject: "Royalty payment delay for Whispers of the Ganges",
    category: "royalty_query",
    priority: "high",
    status: "open",
    messages: [
      {
        id: "MSG001",
        sender: "author",
        message:
          "I notice my pending royalty of Rs 3,570 for 'Whispers of the Ganges' has not been credited yet. The last payout was on October 15, 2025. Could you please check and confirm when I can expect the next payment?",
        timestamp: "2026-01-15T10:30:00Z",
      },
    ],
    created_at: "2026-01-15T10:30:00Z",
    updated_at: "2026-01-15T10:30:00Z",
  },
  {
    id: "TKT002",
    author_id: "AUTH002",
    subject: "Startup Sutra not showing on Amazon UK",
    category: "book_status",
    priority: "medium",
    status: "in_progress",
    messages: [
      {
        id: "MSG002",
        sender: "author",
        message:
          "My book 'Startup Sutra' is listed as available on Amazon UK but I cannot find it when searching. Can you please investigate?",
        timestamp: "2026-01-10T14:20:00Z",
      },
      {
        id: "MSG003",
        sender: "admin",
        message:
          "Thank you for reporting this, Rohit. We are checking with our distribution partner. Will update you within 48 hours.",
        timestamp: "2026-01-10T16:45:00Z",
      },
    ],
    created_at: "2026-01-10T14:20:00Z",
    updated_at: "2026-01-10T16:45:00Z",
  },
  {
    id: "TKT003",
    author_id: "AUTH003",
    subject: "When will I receive my first royalty payout?",
    category: "royalty_query",
    priority: "medium",
    status: "open",
    messages: [
      {
        id: "MSG004",
        sender: "author",
        message:
          "I have Rs 2,546 in pending royalties for 'Between Two Temples' but have never received a payout. What is the minimum threshold and payment schedule?",
        timestamp: "2026-01-18T09:15:00Z",
      },
    ],
    created_at: "2026-01-18T09:15:00Z",
    updated_at: "2026-01-18T09:15:00Z",
  },
  {
    id: "TKT004",
    author_id: "AUTH007",
    subject: "Update on Midnight in Mysore cover design",
    category: "book_status",
    priority: "low",
    status: "open",
    messages: [
      {
        id: "MSG005",
        sender: "author",
        message:
          "My book 'Midnight in Mysore' has been in cover design stage for a while. Could you share an estimated timeline for when we will move to the next production step?",
        timestamp: "2026-01-20T11:00:00Z",
      },
    ],
    created_at: "2026-01-20T11:00:00Z",
    updated_at: "2026-01-20T11:00:00Z",
  },
  {
    id: "TKT005",
    author_id: "AUTH005",
    subject: "Request to update phone number",
    category: "account_update",
    priority: "low",
    status: "resolved",
    messages: [
      {
        id: "MSG006",
        sender: "author",
        message:
          "I would like to update my contact number. My new number is +91-54321-11111.",
        timestamp: "2026-01-05T08:30:00Z",
      },
      {
        id: "MSG007",
        sender: "admin",
        message:
          "Your phone number has been updated successfully. Please verify the change in your profile.",
        timestamp: "2026-01-05T10:00:00Z",
      },
    ],
    created_at: "2026-01-05T08:30:00Z",
    updated_at: "2026-01-05T10:00:00Z",
  },
];

// Data access functions
export function getAuthors(): Author[] {
  return sampleData.authors;
}

export function getAuthorById(id: string): Author | undefined {
  return sampleData.authors.find((a) => a.author_id === id);
}

export function getAllBooks() {
  return sampleData.authors.flatMap((a) =>
    a.books.map((b) => ({ ...b, author_name: a.name, author_id: a.author_id }))
  );
}

export function getBooksByAuthor(authorId: string) {
  const author = getAuthorById(authorId);
  return author?.books || [];
}

export function getUsers(): User[] {
  return users;
}

export function getUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email === email);
}

export function getTickets(): Ticket[] {
  return tickets;
}

export function getTicketById(id: string): Ticket | undefined {
  return tickets.find((t) => t.id === id);
}

export function getTicketsByAuthor(authorId: string): Ticket[] {
  return tickets.filter((t) => t.author_id === authorId);
}

export function createTicket(ticket: Ticket): Ticket {
  tickets.push(ticket);
  return ticket;
}

export function addTicketMessage(
  ticketId: string,
  message: { id: string; sender: "author" | "admin" | "ai"; message: string }
) {
  const ticket = tickets.find((t) => t.id === ticketId);
  if (!ticket) return null;
  const msg = { ...message, timestamp: new Date().toISOString() };
  ticket.messages.push(msg);
  ticket.updated_at = new Date().toISOString();
  return ticket;
}

export function updateTicketStatus(
  ticketId: string,
  status: Ticket["status"]
) {
  const ticket = tickets.find((t) => t.id === ticketId);
  if (!ticket) return null;
  ticket.status = status;
  ticket.updated_at = new Date().toISOString();
  return ticket;
}

// Aggregate stats
export function getStats() {
  const authors = getAuthors();
  const allBooks = getAllBooks();
  const allTickets = getTickets();

  return {
    totalAuthors: authors.length,
    totalBooks: allBooks.length,
    publishedBooks: allBooks.filter((b) => b.status === "Published & Live")
      .length,
    inProductionBooks: allBooks.filter((b) =>
      b.status.startsWith("In Production")
    ).length,
    totalCopiesSold: allBooks.reduce((sum, b) => sum + b.total_copies_sold, 0),
    totalRoyaltyEarned: allBooks.reduce(
      (sum, b) => sum + b.total_royalty_earned,
      0
    ),
    totalRoyaltyPaid: allBooks.reduce((sum, b) => sum + b.royalty_paid, 0),
    totalRoyaltyPending: allBooks.reduce(
      (sum, b) => sum + b.royalty_pending,
      0
    ),
    openTickets: allTickets.filter((t) => t.status === "open").length,
    inProgressTickets: allTickets.filter((t) => t.status === "in_progress")
      .length,
    resolvedTickets: allTickets.filter(
      (t) => t.status === "resolved" || t.status === "closed"
    ).length,
  };
}
