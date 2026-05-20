import { NextResponse } from "next/server";
import { createToken } from "@/lib/auth";
import { getUserByEmail } from "@/lib/data";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  const user = getUserByEmail(email);

  if (!user || user.password !== password) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  const token = await createToken({
    id: user.id,
    email: user.email,
    role: user.role,
    author_id: user.author_id,
    name: user.name,
  });

  const response = NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      author_id: user.author_id,
      name: user.name,
    },
  });

  response.cookies.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  return response;
}
