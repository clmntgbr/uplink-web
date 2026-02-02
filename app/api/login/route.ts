import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  COOKIE_MAX_AGE,
  encodeSession,
  type Session,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    console.log("Login attempt for:", email);

    const response = await fetch("https://localhost/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    console.log("Backend response status:", response.status);

    if (!response.ok) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const { token, user } = await response.json();

    console.log("Login successful for user:", user.email);

    const sessionData: Session = {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };

    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, encodeSession(sessionData), {
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({
      success: true,
      user: sessionData.user,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Authentication service unavailable" },
      { status: 500 }
    );
  }
}
